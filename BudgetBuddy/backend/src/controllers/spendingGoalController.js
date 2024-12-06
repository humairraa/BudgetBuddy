const spendingGoalService = require("../services/spendingGoalService");

const createSpendingGoal = async (req, res) => {
	const { budgetID } = req.params;
	try {
		const spendingGoal = await spendingGoalService.createSpendingGoal(
			budgetID,
			req.body,
			req.userID
		);
		res.status(201).json(spendingGoal);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getSpendingGoal = async (req, res) => {
	const { budgetID, spendingGoalID } = req.params;
	try {
		const spendingGoal = await spendingGoalService.getSpendingGoal(
			budgetID,
			spendingGoalID,
			req.userID
		);
		if (!spendingGoal)
			return res.status(404).json({ message: "spendingGoal not found" });
		res.json(spendingGoal);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAllSpendingGoal = async (req, res) => {
	const { budgetID } = req.params;
	const { day, month, year } = req.query;
	try {
		const spendingGoals = await spendingGoalService.getAllSpendingGoals(
			budgetID,
			{ day, month, year },
			req.userID
		);
		res.json(spendingGoals);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateSpendingGoal = async (req, res) => {
	const { budgetID, spendingGoalID } = req.params;
	try {
		const updatedSpendingGoal =
			await spendingGoalService.updateSpendingGoal(
				spendingGoalID,
				budgetID,
				req.body,
				req.userID
			);
		res.json(updatedSpendingGoal);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const deleteSpendingGoal = async (req, res) => {
	const { budgetID, spendingGoalID } = req.params;
	try {
		await spendingGoalService.deleteSpendingGoal(
			budgetID,
			spendingGoalID,
			req.userID
		);
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	createSpendingGoal,
	getSpendingGoal,
	getAllSpendingGoal,
	updateSpendingGoal,
	deleteSpendingGoal,
};
