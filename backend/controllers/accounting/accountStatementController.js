const { Account, JournalEntryItem, JournalEntry } = require("../../Model");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");

// Helper function to get all child account IDs recursively (only children, not the parent)
const getAllChildAccountIds = async (parentId) => {
  const childIds = [];
  const children = await Account.findAll({
    where: { parentId },
    attributes: ['id'],
  });
  
  for (const child of children) {
    childIds.push(child.id);
    const grandChildren = await getAllChildAccountIds(child.id);
    childIds.push(...grandChildren);
  }
  
  return childIds;
};

// Get account statement
exports.getAccountStatement = async (req, res) => {
  try {
    const { accountId } = req.query; // Changed from params to query
    const { startDate, endDate, includeChildren } = req.query;

    if (!accountId) {
      return res.status(400).json({
        success: false,
        message: "Account ID is required",
      });
    }

    const account = await Account.findByPk(accountId);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    // Get all account IDs to include (parent + children if includeChildren is true)
    let accountIds = [parseInt(accountId)];
    if (includeChildren === 'true' || includeChildren === true) {
      const childIds = await getAllChildAccountIds(parseInt(accountId));
      accountIds = [...new Set(childIds)]; // Remove duplicates
    }

    // Get opening balance (balance before start date) - sum for all accounts if including children
    let openingBalance = 0;
    
    // Calculate opening balance for all accounts
    for (const accId of accountIds) {
      const acc = await Account.findByPk(accId);
      if (acc) {
        openingBalance += parseFloat(acc.balance || 0);
      }
    }
    
    if (startDate) {
      // Calculate opening balance from transactions before start date for all accounts
      for (const accId of accountIds) {
        const acc = await Account.findByPk(accId);
        if (!acc) continue;
        
        const openingEntries = await JournalEntryItem.findAll({
          attributes: [
            [Sequelize.fn("SUM", Sequelize.col("debit")), "totalDebit"],
            [Sequelize.fn("SUM", Sequelize.col("credit")), "totalCredit"],
          ],
          include: [
            {
              model: JournalEntry,
              as: "journalEntry",
              where: {
                status: "posted",
                entryDate: { [Op.lt]: startDate },
              },
              attributes: [],
            },
          ],
          where: { accountId: accId },
          raw: true,
        });

        if (openingEntries && openingEntries[0]) {
          const totalDebit = parseFloat(openingEntries[0].totalDebit || 0);
          const totalCredit = parseFloat(openingEntries[0].totalCredit || 0);
          
          if (acc.type === "asset" || acc.type === "expense") {
            openingBalance += totalDebit - totalCredit;
          } else {
            openingBalance += totalCredit - totalDebit;
          }
        }
      }
    }

    // Build date filter
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

    // Get transactions for all account IDs
    const transactions = await JournalEntryItem.findAll({
      where: { accountId: { [Op.in]: accountIds } },
      include: [
        {
          model: JournalEntry,
          as: "journalEntry",
          where: entryWhere,
          attributes: ["id", "entryNumber", "entryDate", "description", "reference"],
        },
        {
          model: Account,
          as: "account",
          attributes: ["id", "code", "name"],
        },
      ],
      order: [
        [{ model: JournalEntry, as: "journalEntry" }, "entryDate", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    // Build statement with running balance
    let runningBalance = openingBalance;
    const statement = transactions.map((item) => {
      const debit = parseFloat(item.debit || 0);
      const credit = parseFloat(item.credit || 0);
      
      // Use the account type of the actual transaction account (in case of children)
      const itemAccountType = item.account?.type || account.type;
      
      if (itemAccountType === "asset" || itemAccountType === "expense") {
        runningBalance += debit - credit;
      } else {
        runningBalance += credit - debit;
      }

      return {
        id: item.id,
        date: item.journalEntry.entryDate,
        entryNumber: item.journalEntry.entryNumber,
        description: item.description || item.journalEntry.description,
        reference: item.reference || item.journalEntry.reference,
        debit,
        credit,
        balance: runningBalance,
        accountCode: item.account?.code,
        accountName: item.account?.name,
      };
    });

    const totalDebit = transactions.reduce((sum, t) => sum + parseFloat(t.debit || 0), 0);
    const totalCredit = transactions.reduce((sum, t) => sum + parseFloat(t.credit || 0), 0);

    // Get child accounts info if including children
    let childAccounts = [];
    if (includeChildren === 'true' || includeChildren === true) {
      childAccounts = await Account.findAll({
        where: { 
          parentId: parseInt(accountId),
        },
        attributes: ['id', 'code', 'name', 'accountLevel'],
        order: [['code', 'ASC']],
      });
    }

    res.json({
      success: true,
      data: {
        account: {
          id: account.id,
          code: account.code,
          name: account.name,
          type: account.type,
          accountLevel: account.accountLevel,
        },
        childAccounts: childAccounts.map(acc => ({
          id: acc.id,
          code: acc.code,
          name: acc.name,
          accountLevel: acc.accountLevel,
        })),
        openingBalance,
        closingBalance: runningBalance,
        startDate,
        endDate,
        transactions: statement,
        totals: {
          debit: totalDebit,
          credit: totalCredit,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching account statement:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching account statement",
      error: error.message,
    });
  }
};

