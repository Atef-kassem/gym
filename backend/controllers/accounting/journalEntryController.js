const { JournalEntry, JournalEntryItem, Account, User, Branch } = require("../../Model/index");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");

// Generate entry number
const generateEntryNumber = async (entryType = "daily") => {
  const prefix = entryType === "daily" ? "JE-D" : entryType === "monthly" ? "JE-M" : entryType === "annual" ? "JE-A" : "JE";
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0].replace(/-/g, "");
  
  const lastEntry = await JournalEntry.findOne({
    where: {
      entryNumber: { [Op.like]: `${prefix}-${dateStr}%` },
    },
    order: [["entryNumber", "DESC"]],
  });

  let sequence = 1;
  if (lastEntry) {
    const lastSeq = parseInt(lastEntry.entryNumber.split("-").pop());
    sequence = lastSeq + 1;
  }

  return `${prefix}-${dateStr}-${sequence.toString().padStart(4, "0")}`;
};

// Get all journal entries
exports.getAllJournalEntries = async (req, res) => {
  try {
    const { search, entryType, status, startDate, endDate, branchId } = req.query;
    
    const where = {};
    if (search) {
      where[Op.or] = [
        { entryNumber: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { reference: { [Op.like]: `%${search}%` } },
      ];
    }
    if (entryType) {
      where.entryType = entryType;
    }
    if (status) {
      where.status = status;
    }
    if (startDate && endDate) {
      where.entryDate = {
        [Op.between]: [startDate, endDate],
      };
    } else if (startDate) {
      where.entryDate = { [Op.gte]: startDate };
    } else if (endDate) {
      where.entryDate = { [Op.lte]: endDate };
    }
    if (branchId) {
      where.branchId = branchId;
    }

    const entries = await JournalEntry.findAll({
      where,
      include: [
        { model: Branch, as: "branch", attributes: ["id", "arabicName", "englishName"], required: false },
        { model: User, as: "postedByUser", attributes: ["id", "arabicName", "englinshName"], required: false },
        { model: User, as: "createdByUser", attributes: ["id", "arabicName", "englinshName"], required: false },
        {
          model: JournalEntryItem,
          as: "items",
          include: [
            { model: Account, as: "account", attributes: ["id", "code", "name", "type"] },
          ],
        },
      ],
      order: [["entryDate", "DESC"], ["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: entries,
      count: entries.length,
    });
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching journal entries",
      error: error.message,
    });
  }
};

// Get journal entry by ID
exports.getJournalEntryById = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await JournalEntry.findByPk(id, {
      include: [
        { model: Branch, as: "branch", required: false },
        { model: User, as: "postedByUser", required: false },
        { model: User, as: "createdByUser", required: false },
        {
          model: JournalEntryItem,
          as: "items",
          include: [
            { model: Account, as: "account" },
          ],
          order: [["lineOrder", "ASC"]],
        },
      ],
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found",
      });
    }

    res.json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error("Error fetching journal entry:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching journal entry",
      error: error.message,
    });
  }
};

// Create journal entry
exports.createJournalEntry = async (req, res) => {
  const transaction = await JournalEntry.sequelize.transaction();
  try {
    const { entryDate, entryType, description, reference, items, branchId, createdBy } = req.body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Journal entry must have at least 2 items",
      });
    }

    // Calculate totals
    const totalDebit = items.reduce((sum, item) => sum + parseFloat(item.debit || 0), 0);
    const totalCredit = items.reduce((sum, item) => sum + parseFloat(item.credit || 0), 0);

    // Validate double entry
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return res.status(400).json({
        success: false,
        message: `Debit (${totalDebit}) and Credit (${totalCredit}) must be equal`,
      });
    }

    // Validate each item
    for (const item of items) {
      if ((!item.debit || parseFloat(item.debit) === 0) && (!item.credit || parseFloat(item.credit) === 0)) {
        return res.status(400).json({
          success: false,
          message: "Each item must have either debit or credit amount",
        });
      }
      if (item.debit && item.credit && parseFloat(item.debit) > 0 && parseFloat(item.credit) > 0) {
        return res.status(400).json({
          success: false,
          message: "Each item cannot have both debit and credit amounts",
        });
      }

      const account = await Account.findByPk(item.accountId);
      if (!account) {
        return res.status(400).json({
          success: false,
          message: `Account ${item.accountId} not found`,
        });
      }
    }

    // Generate entry number
    const entryNumber = await generateEntryNumber(entryType);

    // Create journal entry
    const entry = await JournalEntry.create({
      entryNumber,
      entryDate,
      entryType: entryType || "daily",
      description,
      reference,
      totalDebit,
      totalCredit,
      status: "draft",
      branchId,
      createdBy,
    }, { transaction });

    // Create items
    const entryItems = await Promise.all(
      items.map((item, index) =>
        JournalEntryItem.create(
          {
            journalEntryId: entry.id,
            accountId: item.accountId,
            debit: parseFloat(item.debit || 0),
            credit: parseFloat(item.credit || 0),
            description: item.description,
            reference: item.reference,
            lineOrder: index + 1,
          },
          { transaction }
        )
      )
    );

    await transaction.commit();

    // Fetch entry with relations
    const createdEntry = await JournalEntry.findByPk(entry.id, {
      include: [
        { model: Branch, as: "branch", required: false },
        { model: User, as: "createdByUser", required: false },
        {
          model: JournalEntryItem,
          as: "items",
          include: [{ model: Account, as: "account" }],
          order: [["lineOrder", "ASC"]],
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: createdEntry,
      message: "Journal entry created successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating journal entry:", error);
    console.error("Error stack:", error.stack);
    console.error("Request body:", req.body);
    res.status(500).json({
      success: false,
      message: "Error creating journal entry",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Update journal entry
exports.updateJournalEntry = async (req, res) => {
  const transaction = await JournalEntry.sequelize.transaction();
  try {
    const { id } = req.params;
    const { entryDate, entryType, description, reference, items, branchId } = req.body;

    const entry = await JournalEntry.findByPk(id);
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found",
      });
    }

    // Cannot update posted entries
    if (entry.status === "posted") {
      return res.status(400).json({
        success: false,
        message: "Cannot update posted journal entry",
      });
    }

    // If items provided, validate and update
    if (items) {
      if (!Array.isArray(items) || items.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Journal entry must have at least 2 items",
        });
      }

      const totalDebit = items.reduce((sum, item) => sum + parseFloat(item.debit || 0), 0);
      const totalCredit = items.reduce((sum, item) => sum + parseFloat(item.credit || 0), 0);

      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        return res.status(400).json({
          success: false,
          message: "Debit and Credit must be equal",
        });
      }

      // Delete old items
      await JournalEntryItem.destroy({
        where: { journalEntryId: id },
        transaction,
      });

      // Create new items
      await Promise.all(
        items.map((item, index) =>
          JournalEntryItem.create(
            {
              journalEntryId: id,
              accountId: item.accountId,
              debit: parseFloat(item.debit || 0),
              credit: parseFloat(item.credit || 0),
              description: item.description,
              reference: item.reference,
              lineOrder: index + 1,
            },
            { transaction }
          )
        )
      );

      await entry.update(
        {
          entryDate,
          entryType,
          description,
          reference,
          totalDebit,
          totalCredit,
          branchId,
        },
        { transaction }
      );
    } else {
      await entry.update(
        {
          entryDate,
          entryType,
          description,
          reference,
          branchId,
        },
        { transaction }
      );
    }

    await transaction.commit();

    const updatedEntry = await JournalEntry.findByPk(id, {
      include: [
        { model: Branch, as: "branch", required: false },
        { model: User, as: "createdByUser", required: false },
        {
          model: JournalEntryItem,
          as: "items",
          include: [{ model: Account, as: "account" }],
          order: [["lineOrder", "ASC"]],
        },
      ],
    });

    res.json({
      success: true,
      data: updatedEntry,
      message: "Journal entry updated successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating journal entry:", error);
    res.status(500).json({
      success: false,
      message: "Error updating journal entry",
      error: error.message,
    });
  }
};

// Post journal entry
exports.postJournalEntry = async (req, res) => {
  const transaction = await JournalEntry.sequelize.transaction();
  try {
    const { id } = req.params;
    const { postedBy } = req.body;

    const entry = await JournalEntry.findByPk(id, {
      include: [
        {
          model: JournalEntryItem,
          as: "items",
          include: [{ model: Account, as: "account" }],
        },
      ],
      transaction,
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found",
      });
    }

    if (entry.status === "posted") {
      return res.status(400).json({
        success: false,
        message: "Journal entry already posted",
      });
    }

    if (entry.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot post cancelled journal entry",
      });
    }

    // Update account balances
    for (const item of entry.items) {
      const account = item.account;
      const debitAmount = parseFloat(item.debit);
      const creditAmount = parseFloat(item.credit);

      // Update balance based on account type
      let balanceChange = 0;
      if (account.type === "asset" || account.type === "expense") {
        balanceChange = debitAmount - creditAmount;
      } else {
        balanceChange = creditAmount - debitAmount;
      }

      await account.update(
        {
          balance: Sequelize.literal(`balance + ${balanceChange}`),
        },
        { transaction }
      );
    }

    // Update entry status
    await entry.update(
      {
        status: "posted",
        postedAt: new Date(),
        postedBy,
      },
      { transaction }
    );

    await transaction.commit();

    res.json({
      success: true,
      data: entry,
      message: "Journal entry posted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error posting journal entry:", error);
    res.status(500).json({
      success: false,
      message: "Error posting journal entry",
      error: error.message,
    });
  }
};

// Cancel journal entry
exports.cancelJournalEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const entry = await JournalEntry.findByPk(id);
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found",
      });
    }

    if (entry.status === "posted") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel posted journal entry. Please reverse it instead.",
      });
    }

    await entry.update({ status: "cancelled" });

    res.json({
      success: true,
      message: "Journal entry cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling journal entry:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling journal entry",
      error: error.message,
    });
  }
};

// Delete journal entry
exports.deleteJournalEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const entry = await JournalEntry.findByPk(id);
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found",
      });
    }

    if (entry.status === "posted") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete posted journal entry",
      });
    }

    await JournalEntryItem.destroy({ where: { journalEntryId: id } });
    await entry.destroy();

    res.json({
      success: true,
      message: "Journal entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting journal entry",
      error: error.message,
    });
  }
};

