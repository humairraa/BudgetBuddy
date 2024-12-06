const transactionService = require("../services/transactionService");
const budgetService = require("../services/budgetService");

const createTransaction = async (req, res) => {
	// console.log(req.params);
	const { budgetID } = req.params;
	try {
		const transaction = await transactionService.createTransaction(
			budgetID,
			req.body,
			req.userID
		);
		res.status(201).json(transaction);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getTransaction = async (req, res) => {
	const { budgetID, transactionID } = req.params;
	try {
		const transaction = await transactionService.getTransaction(
			transactionID,
			budgetID
		);
		if (!transaction)
			return res.status(404).json({ message: "Transaction not found" });
		res.json(transaction);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAllTransaction = async (req, res) => {
	const { budgetID } = req.params;
	const { day, month, year } = req.query;
	try {
		const transactions = await transactionService.getAllTransaction(
			budgetID,
			req.userID,
			{ day, month, year }
		);
		res.json(transactions);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateTransaction = async (req, res) => {
	const { budgetID, transactionID } = req.params;
	try {
		const updatedTransaction = await transactionService.updateTransaction(
			transactionID,
			req.body,
			budgetID,
			req.userID
		);
		res.json(updatedTransaction);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const deleteTransaction = async (req, res) => {
	const { budgetID, transactionID } = req.params;
	try {
		await transactionService.deleteTransaction(
			transactionID,
			req.userID,
			budgetID
		);
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	createTransaction,
	getTransaction,
	getAllTransaction,
	updateTransaction,
	deleteTransaction,
};
