const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
});

db.connect((err) => {
	if (err) throw err;
	console.log("Connected to MySQL");

	db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => {
		if (err) throw err;
		console.log(
			`Database ${process.env.DB_NAME} created or exists already`
		);

		db.changeUser({ database: process.env.DB_NAME }, (err) => {
			if (err) throw err;

			// will prob have to change client list implementation to retain atomic value rule

			const createUserTable = `
        CREATE TABLE IF NOT EXISTS User (
          userID INT PRIMARY KEY AUTO_INCREMENT,
          username VARCHAR(255) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255),
          userType ENUM('Client', 'FinancialAdvisor'),
          clientList JSON
        )`;

			const createBudgetTable = `
        CREATE TABLE IF NOT EXISTS Budget (
          budgetID INT PRIMARY KEY AUTO_INCREMENT,
          title VARCHAR(255) NOT NULL,
          totalBalance DOUBLE,
          totalIncome DOUBLE,
          totalExpenses DOUBLE,
          accountType ENUM('Individual', 'Shared'),
          financialHealthScore INT,
          creationDate DATE,
          ownerID INT,
          FOREIGN KEY (ownerID) REFERENCES User(userID) ON DELETE CASCADE
        )`;

			const createUserBudgetTable = `
        CREATE TABLE IF NOT EXISTS UserBudget (
	      userID INT,
        budgetID INT,
		    PRIMARY KEY (userID, budgetID),
          FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE,
          FOREIGN KEY (budgetID) REFERENCES Budget(budgetID) ON DELETE CASCADE
        )`;

			const createCategoryTable = `
        CREATE TABLE IF NOT EXISTS Category (
          categoryID INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(255),
          colour VARCHAR(255),
          isCustom BOOLEAN,
          budgetID INT,
          FOREIGN KEY (budgetID) REFERENCES Budget(budgetID) ON DELETE CASCADE
        )`;

			const createTransactionTable = `
        CREATE TABLE IF NOT EXISTS Transaction (
          transactionID INT PRIMARY KEY AUTO_INCREMENT,
          title VARCHAR(255),
          categoryID INT,
          budgetID INT,
          amount DOUBLE,
          date DATE,
          transactionType ENUM('Income', 'Expense'),
          recurrenceFrequency ENUM('DAILY', 'MONTHLY', 'YEARLY', 'WEEKLY', 'BI-WEEKLY'),
          recurrenceStartDate DATE,
          recurrenceEndDate DATE,
          FOREIGN KEY (categoryID) REFERENCES Category(categoryID), 
          FOREIGN KEY (budgetID) REFERENCES Budget(budgetID) ON DELETE CASCADE
        )`;

			const createUserTransactionTable = `
        CREATE TABLE IF NOT EXISTS UserTransaction (
          userID INT,
          transactionID INT,
		  PRIMARY KEY (userID, transactionID),
          FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE,
          FOREIGN KEY (transactionID) REFERENCES Transaction(transactionID) ON DELETE CASCADE
        )`;

			const createFinancialReportTable = `
        CREATE TABLE IF NOT EXISTS FinancialReport (
          reportID INT PRIMARY KEY AUTO_INCREMENT,
          userID INT,
          budgetID INT,
          generatedDate DATE,
          reportPeriodStartDate DATE,
          reportPeriodEndDate DATE,
          totalIncome DOUBLE,
          totalExpenses DOUBLE,
          spendingPerCategory JSON,
          savings DOUBLE,
          FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE,
          FOREIGN KEY (budgetID) REFERENCES Budget(budgetID) ON DELETE CASCADE
        )`;

			const createSpendingGoalTable = `
        CREATE TABLE IF NOT EXISTS SpendingGoal (
          spendingGoalID INT PRIMARY KEY AUTO_INCREMENT,
          categoryID INT,
          budgetID INT,
          spendingLimit DOUBLE,
          currAmount DOUBLE,
          startDate DATE,
          endDate DATE,
          FOREIGN KEY (categoryID) REFERENCES Category(categoryID),
          FOREIGN KEY (budgetID) REFERENCES Budget(budgetID) ON DELETE CASCADE
        )`;

			// Run all table creation queries
			db.query(createUserTable, (err) => {
				if (err) throw err;
			});
			db.query(createBudgetTable, (err) => {
				if (err) throw err;
			});
			db.query(createUserBudgetTable, (err) => {
				if (err) throw err;
			});
			db.query(createCategoryTable, (err) => {
				if (err) throw err;
			});
			db.query(createTransactionTable, (err) => {
				if (err) throw err;
			});
			db.query(createUserTransactionTable, (err) => {
				if (err) throw err;
			});
			db.query(createFinancialReportTable, (err) => {
				if (err) throw err;
			});
			db.query(createSpendingGoalTable, (err) => {
				if (err) throw err;
			});

			console.log("All tables created or already exist.");
		});
	});
});

module.exports = db;
