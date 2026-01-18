const Router = require("express").Router();
const accountController = require("../controllers/accounting/accountController");
const journalEntryController = require("../controllers/accounting/journalEntryController");
const trialBalanceController = require("../controllers/accounting/trialBalanceController");
const accountStatementController = require("../controllers/accounting/accountStatementController");

// Account routes
Router.route("/accounts")
  .get(accountController.getAllAccounts)
  .post(accountController.createAccount);

Router.route("/accounts/:id")
  .get(accountController.getAccountById)
  .patch(accountController.updateAccount)
  .delete(accountController.deleteAccount);

Router.route("/accounts/:id/balance")
  .get(accountController.getAccountBalance);

// Journal Entry routes
Router.route("/journal-entries")
  .get(journalEntryController.getAllJournalEntries)
  .post(journalEntryController.createJournalEntry);

Router.route("/journal-entries/:id")
  .get(journalEntryController.getJournalEntryById)
  .patch(journalEntryController.updateJournalEntry)
  .delete(journalEntryController.deleteJournalEntry);

Router.route("/journal-entries/:id/post")
  .post(journalEntryController.postJournalEntry);

Router.route("/journal-entries/:id/cancel")
  .post(journalEntryController.cancelJournalEntry);

// Trial Balance routes
Router.route("/trial-balance")
  .get(trialBalanceController.getTrialBalance);

// Account Statement routes
Router.route("/account-statement")
  .get(accountStatementController.getAccountStatement);

module.exports = Router;

