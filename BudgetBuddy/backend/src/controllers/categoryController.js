const categoryService = require("../services/categoryService");

const createCategory = async (req, res) => {
	const { budgetID } = req.params;
	const categoryData = { ...req.body, budgetID };

	try {
		await categoryService.createCategory(categoryData, req.userID);
		res.status(201).json({ message: "Category created successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getCategory = async (req, res) => {
	const { budgetID, categoryID } = req.params;

	try {
		const category = await categoryService.getCategory(
			budgetID,
			categoryID,
			req.userID
		);
		if (!category)
			return res.status(404).json({ message: "Category not found" });
		res.json(category);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getAllCategories = async (req, res) => {
	const { budgetID } = req.params;

	// console.log("getting all categories for budget:", budgetID);
	try {
		const categories = await categoryService.getAllCategories(
			budgetID,
			req.userID
		);
		res.json(categories);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateCategory = async (req, res) => {
	const { budgetID, categoryID } = req.params;
	const categoryData = req.body;

	try {
		const updatedCategory = await categoryService.updateCategory(
			budgetID,
			categoryID,
			categoryData,
			req.userID
		);
		if (!updatedCategory)
			return res.status(404).json({ message: "Category not found" });
		res.json({
			message: "Category updated successfully",
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const deleteCategory = async (req, res) => {
	const { budgetID, categoryID } = req.params;

	try {
		const result = await categoryService.deleteCategory(
			budgetID,
			categoryID,
			req.userID
		);
		if (!result)
			return res.status(404).json({ message: "Category not found" });
		res.status(204).send({
			message: "Category deleted successfully",
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	createCategory,
	getCategory,
	getAllCategories,
	updateCategory,
	deleteCategory,
};
