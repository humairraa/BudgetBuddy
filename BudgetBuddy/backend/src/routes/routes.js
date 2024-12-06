const express = require("express");
const authMiddleware = require("../utils/authMiddleware");
const authController = require("../controllers/authController");
const categoryController = require("../controllers/categoryController");
const budgetController = require("../controllers/budgetController");
const transactionController = require("../controllers/transactionController");
const financialReportController = require("../controllers/financialReportController");
const spendingGoalController = require("../controllers/spendingGoalController");

const router = express.Router();

// Auth Routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/google", authController.google);
router.get(
	"/google/callback",
	authController.googleCallback,
	authController.googleCallbackFunction
);

// Budget Routes
router.post("/budget", authMiddleware, budgetController.createBudget);
router.get("/budget/:budgetID", authMiddleware, budgetController.getBudget);
router.get("/budgets", authMiddleware, budgetController.getAllBudgets);
router.delete(
	"/budget/:budgetID",
	authMiddleware,
	budgetController.deleteBudget
);
router.post(
	"/budget/:budgetID/addUser",
	authMiddleware,
	budgetController.addUser
);
router.post(
	"/budget/:budgetID/removeUser",
	authMiddleware,
	budgetController.removeUser
);
router.post(
	"/budget/:budgetID/updateTitle",
	authMiddleware,
	budgetController.updateTitle
);

router.get(
	"/budget/:budgetID/getAllBudgetUsers",
	authMiddleware,
	budgetController.getAllBudgetUsers
);

// Category Routes
router.post(
	"/budget/:budgetID/category",
	authMiddleware,
	categoryController.createCategory
);
router.get(
	"/budget/:budgetID/category/:categoryID",
	authMiddleware,
	categoryController.getCategory
);
router.get(
	"/budget/:budgetID/categories",
	authMiddleware,
	categoryController.getAllCategories
);
router.put(
	"/budget/:budgetID/category/:categoryID",
	authMiddleware,
	categoryController.updateCategory
);
router.delete(
	"/budget/:budgetID/category/:categoryID",
	authMiddleware,
	categoryController.deleteCategory
);

// Transaction Routes
router.post(
	"/budget/:budgetID/transaction",
	authMiddleware,
	transactionController.createTransaction
);
router.get(
	"/budget/:budgetID/transaction/:transactionID",
	authMiddleware,
	transactionController.getTransaction
);
router.get(
	"/budget/:budgetID/transactions",
	authMiddleware,
	transactionController.getAllTransaction
);
router.put(
	"/budget/:budgetID/transaction/:transactionID",
	authMiddleware,
	transactionController.updateTransaction
);
router.delete(
	"/budget/:budgetID/transaction/:transactionID",
	authMiddleware,
	transactionController.deleteTransaction
);

// Spending Goal Routes
router.post(
	"/budget/:budgetID/spendingGoal",
	authMiddleware,
	spendingGoalController.createSpendingGoal
);
router.get(
	"/budget/:budgetID/spendingGoal/:spendingGoalID",
	authMiddleware,
	spendingGoalController.getSpendingGoal
);
router.get(
	"/budget/:budgetID/spendingGoals",
	authMiddleware,
	spendingGoalController.getAllSpendingGoal
);
router.put(
	"/budget/:budgetID/spendingGoal/:spendingGoalID",
	authMiddleware,
	spendingGoalController.updateSpendingGoal
);
router.delete(
	"/budget/:budgetID/spendingGoal/:spendingGoalID",
	authMiddleware,
	spendingGoalController.deleteSpendingGoal
);

// Financial Report Routes
router.post(
	"/budget/:budgetID/financialReport",
	authMiddleware,
	financialReportController.createFinancialReport
);
router.get(
	"/budget/:budgetID/financialReport/:financialReportID",
	authMiddleware,
	financialReportController.getFinancialReport
);
router.get(
	"/budget/:budgetID/financialReports",
	authMiddleware,
	financialReportController.getAllFinancialReports
);
router.delete(
	"/budget/:budgetID/financialReport/:financialReportID",
	authMiddleware,
	financialReportController.deleteFinancialReport
);

module.exports = router;
