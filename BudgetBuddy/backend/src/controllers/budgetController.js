const budgetService = require("../services/budgetService");

const createBudget = async (req, res) => {
	try {
		await budgetService.createBudget(req.userID, req.body);
		res.status(201).json({ message: "Budget created successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getBudget = async (req, res) => {
	const { budgetID } = req.params;
	try {
		const budget = await budgetService.getBudget(budgetID, req.userID);
		if (!budget)
			return res.status(404).json({ message: "Budget not found" });
		res.json(budget);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAllBudgets = async (req, res) => {
	try {
		// console.log("getting all budgets for user id:", req.userID);
		const budgets = await budgetService.getAllBudgets(req.userID);
		res.json(budgets);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const deleteBudget = async (req, res) => {
	const { budgetID } = req.params;
	try {
		await budgetService.deleteBudget(budgetID, req.userID);
		res.status(204).send({ message: "Budget deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const addUser = async (req, res) => {
	const { budgetID } = req.params;
	try {
		await budgetService.addUser(budgetID, req.userID, req.body.identifier);
		res.status(204).send({ message: "User added to budget successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateTitle = async (req, res) => {
	const { budgetID } = req.params;
	try {
		await budgetService.updateTitle(budgetID, req.userID, req.body.title);
		res.status(204).send({ message: "Budget title updated successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const removeUser = async (req, res) => {
	const { budgetID } = req.params;
	try {
		await budgetService.removeUser(budgetID, req.userID, req.body.userID);
		res.status(204).send({
			message: "User removed from budget successfully",
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAllBudgetUsers = async (req, res) => {
	const { budgetID } = req.params;
	try {
		const users = await budgetService.getAllBudgetUsers(
			budgetID,
			req.userID
		);
		res.json(users);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	createBudget,
	getBudget,
	getAllBudgets,
	deleteBudget,
	addUser,
	removeUser,
	updateTitle,
	getAllBudgetUsers,
};
