const { Account, Branch } = require("../../Model");
const { Op } = require("sequelize");

// Get all accounts with hierarchy
exports.getAllAccounts = async (req, res) => {
  try {
    const { search, type, accountLevel, branchId } = req.query;
    
    const where = { isActive: true };
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { code: { [Op.like]: `%${search}%` } },
      ];
    }
    if (type) {
      where.type = type;
    }
    if (accountLevel) {
      where.accountLevel = accountLevel;
    }
    if (branchId) {
      where.branchId = branchId;
    }

    const accounts = await Account.findAll({
      where,
      include: [
        { model: Branch, as: "branch", attributes: ["id", "arabicName", "englishName"], required: false },
        { model: Account, as: "parent", attributes: ["id", "code", "name"], required: false },
      ],
      order: [["code", "ASC"]],
    });

    // Build hierarchy
    const buildTree = (accounts, parentId = null) => {
      return accounts
        .filter(acc => {
          if (parentId === null) return !acc.parentId;
          return acc.parentId === parentId;
        })
        .map(acc => ({
          ...acc.toJSON(),
          children: buildTree(accounts, acc.id),
        }));
    };

    const tree = buildTree(accounts);

    res.json({
      success: true,
      data: tree,
      flat: accounts.map(a => a.toJSON()),
      count: accounts.length,
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching accounts",
      error: error.message,
    });
  }
};

// Get account by ID
exports.getAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findByPk(id, {
      include: [
        { model: Branch, as: "branch", required: false },
        { model: Account, as: "parent", required: false },
        { model: Account, as: "children", required: false },
      ],
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    res.json({
      success: true,
      data: account,
    });
  } catch (error) {
    console.error("Error fetching account:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching account",
      error: error.message,
    });
  }
};

// Generate account code automatically
const generateAccountCode = async (accountLevel, parentId) => {
  if (accountLevel === "main") {
    // Get the highest main account code
    const lastMainAccount = await Account.findOne({
      where: { accountLevel: "main" },
      order: [["code", "DESC"]],
    });
    
    if (!lastMainAccount) {
      return "1";
    }
    
    const lastCode = parseInt(lastMainAccount.code);
    return String(lastCode + 1);
  } else if (accountLevel === "sub-main" && parentId) {
    // Get parent code and find last sub-main account under this parent
    const parent = await Account.findByPk(parentId);
    if (!parent) {
      throw new Error("Parent account not found");
    }
    
    const parentCode = parent.code;
    const lastSubMainAccount = await Account.findOne({
      where: {
        accountLevel: "sub-main",
        parentId: parentId,
      },
      order: [["code", "DESC"]],
    });
    
    if (!lastSubMainAccount) {
      return parentCode + "1";
    }
    
    const lastCode = lastSubMainAccount.code;
    const subCode = parseInt(lastCode.substring(parentCode.length));
    return parentCode + String(subCode + 1);
  } else if (accountLevel === "sub" && parentId) {
    // Get parent code and find last sub account under this parent
    const parent = await Account.findByPk(parentId);
    if (!parent) {
      throw new Error("Parent account not found");
    }
    
    const parentCode = parent.code;
    const lastSubAccount = await Account.findOne({
      where: {
        accountLevel: "sub",
        parentId: parentId,
      },
      order: [["code", "DESC"]],
    });
    
    if (!lastSubAccount) {
      return parentCode + "1";
    }
    
    const lastCode = lastSubAccount.code;
    const subCode = parseInt(lastCode.substring(parentCode.length));
    return parentCode + String(subCode + 1);
  }
  
  throw new Error("Invalid account level or missing parent");
};

// Create account
exports.createAccount = async (req, res) => {
  try {
    let { code, name, type, category, accountLevel, parentId, description, branchId } = req.body;

    // Auto-generate code if not provided
    if (!code || code.trim() === "") {
      accountLevel = accountLevel || "main";
      code = await generateAccountCode(accountLevel, parentId);
    }

    // Validate code uniqueness
    const existingAccount = await Account.findOne({ where: { code } });
    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message: "Account code already exists",
      });
    }

    // Validate parent if provided
    if (parentId) {
      const parent = await Account.findByPk(parentId);
      if (!parent) {
        return res.status(400).json({
          success: false,
          message: "Parent account not found",
        });
      }
      
      // Auto-set accountLevel based on parent if not provided
      if (!accountLevel) {
        if (parent.accountLevel === "main") {
          accountLevel = "sub-main";
        } else if (parent.accountLevel === "sub-main") {
          accountLevel = "sub";
        } else {
          return res.status(400).json({
            success: false,
            message: "Cannot add child to sub account",
          });
        }
      }
    } else {
      accountLevel = accountLevel || "main";
    }

    const account = await Account.create({
      code,
      name,
      type,
      category,
      accountLevel,
      parentId: parentId || null,
      description,
      branchId,
      balance: 0,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      data: account,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({
      success: false,
      message: "Error creating account",
      error: error.message,
    });
  }
};

// Update account
exports.updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, type, category, accountLevel, parentId, description, isActive, branchId } = req.body;

    const account = await Account.findByPk(id);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    // Validate code uniqueness if changed
    if (code && code !== account.code) {
      const existingAccount = await Account.findOne({ where: { code } });
      if (existingAccount) {
        return res.status(400).json({
          success: false,
          message: "Account code already exists",
        });
      }
    }

    // Validate parent if provided
    if (parentId && parentId !== account.parentId) {
      if (parentId === id) {
        return res.status(400).json({
          success: false,
          message: "Account cannot be its own parent",
        });
      }
      const parent = await Account.findByPk(parentId);
      if (!parent) {
        return res.status(400).json({
          success: false,
          message: "Parent account not found",
        });
      }
    }

    await account.update({
      code,
      name,
      type,
      category,
      accountLevel,
      parentId,
      description,
      isActive,
      branchId,
    });

    res.json({
      success: true,
      data: account,
      message: "Account updated successfully",
    });
  } catch (error) {
    console.error("Error updating account:", error);
    res.status(500).json({
      success: false,
      message: "Error updating account",
      error: error.message,
    });
  }
};

// Delete account (soft delete)
exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await Account.findByPk(id);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    // Check if account has children
    const children = await Account.count({ where: { parentId: id } });
    if (children > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete account with child accounts",
      });
    }

    // Check if account has balance
    if (parseFloat(account.balance) !== 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete account with non-zero balance",
      });
    }

    await account.update({ isActive: false });

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting account",
      error: error.message,
    });
  }
};

// Get account balance
exports.getAccountBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const account = await Account.findByPk(id);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    // TODO: Calculate balance from journal entries if dates provided
    // For now, return the stored balance
    res.json({
      success: true,
      data: {
        accountId: id,
        accountCode: account.code,
        accountName: account.name,
        balance: account.balance,
        startDate,
        endDate,
      },
    });
  } catch (error) {
    console.error("Error fetching account balance:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching account balance",
      error: error.message,
    });
  }
};

