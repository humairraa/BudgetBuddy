const db = require("../../config/db");
const helperService = require("./helperService");

const createCategory = async (categoryData, userID) => {
	const budget = await helperService.checkBudgetExists(
		categoryData.budgetID,
		userID
	);
	const query = `
    INSERT INTO Category (name, colour, isCustom, budgetID) 
    VALUES (?, ?, ?, ?)`;
	const values = [
		categoryData.name,
		categoryData.colour,
		categoryData.isCustom,
		budget.budgetID,
	];

	return new Promise((resolve, reject) => {
		db.query(query, values, (error) => {
			if (error) return reject(error);
			resolve();
		});
	});
};

const getCategory = async (budgetID, categoryID, userID) => {
	const budget = await helperService.checkBudgetExists(budgetID, userID);
	const query = `SELECT * FROM Category WHERE budgetID = ? AND categoryID = ?`;
	return new Promise((resolve, reject) => {
		db.query(query, [budget.budgetID, categoryID], (error, results) => {
			if (error) return reject(error);
			resolve(results[0]);
		});
	});
};

const getAllCustomCategories = async (budgetID, userID) => {
	const budget = await budgetService.getBudget(budgetID, userID);
	const query = `SELECT * FROM Category WHERE budgetID = ? AND isCustom = true`;
	return new Promise((resolve, reject) => {
		db.query(query, [budget.budgetID], (error, results) => {
			if (error) return reject(error);
			resolve(results);
		});
	});
};

const getAllCategories = async (budgetID, userID) => {
	const budget = await helperService.checkBudgetExists(budgetID, userID);
	const query = `SELECT * FROM Category WHERE budgetID = ?`;
	return new Promise((resolve, reject) => {
		db.query(query, [budget.budgetID], (error, results) => {
			if (error) return reject(error);
			resolve(results);
		});
	});
};

const updateCategory = async (budgetID, categoryID, categoryData, userID) => {
	const budget = await helperService.checkBudgetExists(budgetID, userID);
	const query = `
    UPDATE Category 
    SET name = ?, colour = ?, isCustom = ? 
    WHERE budgetID = ? AND categoryID = ?`;
	const values = [
		categoryData.name,
		categoryData.colour,
		categoryData.isCustom,
		budget.budgetID,
		categoryID,
	];

	return new Promise((resolve, reject) => {
		db.query(query, values, (error) => {
			if (error) return reject(error);
			resolve({ id, ...categoryData });
		});
	});
};

const deleteCategory = async (budgetID, categoryID, userID) => {
	const budget = await helperService.checkBudgetExists(budgetID, userID);
	const category = await getCategory(budgetID, categoryID, userID);
	if (!category) {
		return { message: "Category not found" };
	} else if (!category.isCustom) {
		return { message: "Cannot delete default category" };
	} else {
		const query = `DELETE FROM Category WHERE budgetID = ? AND categoryID = ?`;
		await new Promise((resolve, reject) => {
			db.query(
				query,
				[budget.budgetID, categoryID, userID],
				(error, results) => {
					if (error) return reject(error);
					resolve(results.affectedRows > 0);
				}
			);
		});
		return { message: "Category deleted successfully" };
	}
};

module.exports = {
	createCategory,
	getCategory,
	getAllCategories,
	updateCategory,
	deleteCategory,
};
