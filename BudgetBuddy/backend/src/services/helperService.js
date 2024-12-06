const db = require("../../config/db");
const { sendEmail } = require("./emailService");

const updateBudget = async (budgetID, userID) => {
	const transactions = await getAllTransaction(budgetID, userID, {
		day: null,
		month: null,
		year: null,
		current: true,
	});

	let totalBalance = 0;
	let totalIncome = 0;
	let totalExpenses = 0;
	let financialHealthScore = 50;

	for (const transaction of transactions) {	
		if (transaction.transactionType === "Income") {
			totalIncome += transaction.amount;
			totalBalance += transaction.amount;
		} else if (transaction.transactionType === "Expense") {
			totalExpenses += transaction.amount;
			totalBalance -= transaction.amount;
		}
	}

	if (totalBalance !== 0 && totalExpenses !== 0 && totalIncome !== 0) {
		
	
	  // 1. Calculate Savings Rate as percentage of income
	  const savingsRate = (totalBalance / totalIncome) * 100; // A higher savings rate contributes positively
	
	  // 2. Calculate Expense Ratio, inverted (lower is better)
	  const expenseRatio = Math.min(Math.max(1 - (totalExpenses / totalBalance), 0), 1); // Cap between 0 and 1
	  const normalizedExpenseRatio = expenseRatio * 50; // Scale this to contribute up to 50 points
	
	  // 3. Calculate Balance Stability (higher balance relative to expenses is better)
	  const balanceStability = Math.min(Math.max((totalBalance / totalExpenses) * 10, 0), 10); // Cap between 0 and 10
	  const normalizedBalanceStability = balanceStability * 2; // Scale this to contribute up to 20 points
	
	  // Final Financial Health Score as an average of all components
	  let score = (savingsRate + normalizedExpenseRatio + normalizedBalanceStability) / 100;
	
	  // Scale it to a 1-100 score
	  financialHealthScore = Math.min(Math.max(Math.round(score * 100), 0), 100);
	}else if (totalIncome > 0 && totalExpenses === 0 ) {
		financialHealthScore = 100;
	}else if (totalIncome === 0 && totalExpenses > 0){
		financialHealthScore = 0;
	}
	const query = `UPDATE Budget SET totalBalance = ?, totalIncome = ?, totalExpenses = ?, financialHealthScore = ? WHERE budgetID = ?`;
	const values = [
		totalBalance,
		totalIncome,
		totalExpenses,
		financialHealthScore,
		budgetID,
	];

	// Check if goals are met
	checkSpendingGoal(userID, budgetID);

	return new Promise((resolve, reject) => {
		db.query(query, values, (error) => {
			if (error){
				return reject(error);
			} 
			resolve({ budgetID, ...values });
		});
	});
};

const checkBudgetExists = (budgetID, userID) => {
	const query = `SELECT Budget.* FROM Budget INNER JOIN UserBudget ON Budget.budgetID = UserBudget.budgetID WHERE UserBudget.userID = ? AND Budget.budgetID = ?`;
	return new Promise((resolve, reject) => {
		db.query(query, [userID, budgetID], (error, results) => {
			if (error) return reject(error);
			resolve(results[0]);
		});
	});
};

const createTransaction = async (budgetID, transaction, userID) => {
	const transactionQuery = `
	  INSERT INTO Transaction (budgetID, title, categoryID, amount, date, transactionType, recurrenceFrequency, recurrenceStartDate, recurrenceEndDate)
	  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
	`;
	const transactionValues = [
		budgetID,
		transaction.title,
		transaction.categoryID,
		parseFloat(transaction.amount),
		transaction.date,
		transaction.transactionType,
		transaction.recurrenceFrequency || null,
		transaction.recurrenceStartDate || null,
		transaction.recurrenceEndDate || null,
	];

	await new Promise((resolve, reject) => {
		db.query(transactionQuery, transactionValues, (error, results) => {
			if (error) return reject(error);

			const userTransactionQuery = `INSERT INTO UserTransaction (userID, transactionID) VALUES (?, ?)`;
			const userTransactionValues = [userID, results.insertId];

			db.query(userTransactionQuery, userTransactionValues, (error) => {
				if (error) return reject(error);
				resolve({ transactionID: results.insertId, ...transaction });
			});
		});
	});

	return await updateBudget(budgetID, userID);
};

const getAllTransaction = (budgetID, userID, { day, month, year, current }) => {
	//need to pull all transactions in budget including when the current user is not a part of transaction (shared budget)
	let query = `SELECT * FROM Transaction WHERE budgetID = ?`;
	const queryParams = [budgetID];

	if (current) {
		query += " AND date <= CURDATE()"
	}else{
		if (year) {
			query += ` AND YEAR(date) = ?`;
			queryParams.push(year);
		}
	
		if (month) {
			query += ` AND MONTH(date) = ?`;
			queryParams.push(month);
		}
	
		if (day) {
			query += ` AND DAY(date) = ?`;
			queryParams.push(day);
		}

	}

	

	return new Promise((resolve, reject) => {
		db.query(query, queryParams, (error, results) => {
			if (error) return reject(error);
			resolve(results);
		});
	});
};

const createCategory = async (categoryData, userID) => {
	const budget = await checkBudgetExists(categoryData.budgetID, userID);
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
		db.query(query, values, (error, results) => {
			if (error) return reject(error);
			resolve(results);
		});
	});
};

const checkSpendingGoal = async (userID, budgetID) => {
	const spendingGoalQuery = `SELECT * FROM SpendingGoal WHERE budgetID = ? AND endDate >= CURDATE()`;

	// Get All Spending goals
	const goals = await new Promise((resolve, reject) => {
		db.query(spendingGoalQuery, [budgetID], (error, results) => {
			if (error) return reject(error);
			resolve(results);
		});
	});

	for (const goal of goals) {
		const transactionQuery = `SELECT * FROM Transaction WHERE budgetID = ? AND date >= ? AND date <= ? AND categoryID = ?`;

		const transactions = await new Promise((resolve, reject) => {
			db.query(
				transactionQuery,
				[budgetID, goal.startDate, goal.endDate, goal.categoryID],
				(error, results) => {
					if (error) return reject(error);
					resolve(results);
				}
			);
		});

		let total = 0;

		for (const transaction of transactions) {
			if (transaction.transactionType === "Expense") {
				total += transaction.amount;
			} else if (transaction.transactionType === "Income") {
				total -= transaction.amount;
			}
		}

		if (total >= goal.amount) {
			const user = await userService.findUserByID(userID);
			sendEmail(
				user.email,
				"Spending Goal Exceeded",
				"<h1>Spending Goal Exceeded</h1><p> You have exceeded your spending goal.</p>"
			);
		}
	}
};

module.exports = {
	updateBudget,
	createTransaction,
	getAllTransaction,
	createCategory,
	checkBudgetExists,
};
