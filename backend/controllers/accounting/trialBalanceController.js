const { Account, JournalEntryItem, JournalEntry } = require("../../Model");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");

// Get trial balance
exports.getTrialBalance = async (req, res) => {
  try {
    const { startDate, endDate, branchId } = req.query;

    // Get all active accounts
    const whereAccount = { isActive: true };
    if (branchId) {
      whereAccount.branchId = branchId;
    }

    const accounts = await Account.findAll({
      where: whereAccount,
      order: [["code", "ASC"]],
    });

    // Build date filter for journal entries
    const entryWhere = { status: "posted" };
    if (startDate && endDate) {
      entryWhere.entryDate = {
        [Op.between]: [startDate, endDate],
      };
    } else if (startDate) {
      entryWhere.entryDate = { [Op.gte]: startDate };
    } else if (endDate) {
      entryWhere.entryDate = { [Op.lte]: endDate };
    }
    if (branchId) {
      entryWhere.branchId = branchId;
    }

    // Calculate balances from journal entries
    const balances = await JournalEntryItem.findAll({
      attributes: [
        "accountId",
        [Sequelize.fn("SUM", Sequelize.col("debit")), "totalDebit"],
        [Sequelize.fn("SUM", Sequelize.col("credit")), "totalCredit"],
      ],
      include: [
        {
          model: JournalEntry,
          as: "journalEntry",
          where: entryWhere,
          attributes: [],
        },
        {
          model: Account,
          as: "account",
          attributes: ["id", "code", "name", "type"],
        },
      ],
      group: ["accountId"],
      raw: false,
    });

    // Create balance map
    const balanceMap = new Map();
    balances.forEach((item) => {
      balanceMap.set(item.accountId, {
        debit: parseFloat(item.dataValues.totalDebit || 0),
        credit: parseFloat(item.dataValues.totalCredit || 0),
      });
    });

    // Build trial balance data
    const trialBalance = accounts.map((account) => {
      const balance = balanceMap.get(account.id) || { debit: 0, credit: 0 };
      
      // For asset and expense accounts, calculate net balance
      let netDebit = 0;
      let netCredit = 0;
      
      if (account.type === "asset" || account.type === "expense") {
        const netBalance = parseFloat(account.balance) + balance.debit - balance.credit;
        if (netBalance >= 0) {
          netDebit = netBalance;
          netCredit = 0;
        } else {
          netDebit = 0;
          netCredit = Math.abs(netBalance);
        }
      } else {
        const netBalance = parseFloat(account.balance) + balance.credit - balance.debit;
        if (netBalance >= 0) {
          netDebit = 0;
          netCredit = netBalance;
        } else {
          netDebit = Math.abs(netBalance);
          netCredit = 0;
        }
      }

      return {
        id: account.id,
        code: account.code,
        name: account.name,
        type: account.type,
        debit: netDebit,
        credit: netCredit,
        openingBalance: parseFloat(account.balance),
        movements: {
          debit: balance.debit,
          credit: balance.credit,
        },
      };
    }).filter(item => item.debit !== 0 || item.credit !== 0); // Filter zero balances

    const totalDebit = trialBalance.reduce((sum, item) => sum + item.debit, 0);
    const totalCredit = trialBalance.reduce((sum, item) => sum + item.credit, 0);
    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

    res.json({
      success: true,
      data: trialBalance,
      summary: {
        totalDebit,
        totalCredit,
        difference: totalDebit - totalCredit,
        isBalanced,
        startDate,
        endDate,
      },
      count: trialBalance.length,
    });
  } catch (error) {
    console.error("Error fetching trial balance:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching trial balance",
      error: error.message,
    });
  }
};

