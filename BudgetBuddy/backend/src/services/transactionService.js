const db = require("../../config/db");
const helperService = require("./helperService");
const { format, addDays, addWeeks, addMonths, addYears } = require('date-fns');

const generateRecurringDates = (startDate, endDate, frequency)=>{
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];
    let current = start;

    while (current <= end) {
        dates.push(format(current, 'yyyy-MM-dd'));

        switch (frequency) {
            case 'DAILY':
                current = addDays(current, 1);
                break;
            case 'WEEKLY':
                current = addWeeks(current, 1);
                break;
            case 'BI-WEEKLY':
                current = addWeeks(current, 2);
                break;
            case 'MONTHLY':
                current = addMonths(current, 1);
                break;
            case 'YEARLY':
                current = addYears(current, 1);
                break;
            default:
                throw new Error(`Unknown frequency: ${frequency}`);
        }
    }

    return dates;
}

const createTransaction = async (budgetID, transaction, userID) => {
	const transactionQuery = `
	  INSERT INTO Transaction (budgetID, title, categoryID, amount, date, transactionType, recurrenceFrequency, recurrenceStartDate, recurrenceEndDate)
	  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
	`;

	let dates = []

	if (transaction.recurrenceFrequency && transaction.recurrenceStartDate && transaction.recurrenceEndDate ){
		dates = generateRecurringDates(transaction.recurrenceStartDate, transaction.recurrenceEndDate, transaction.recurrenceFrequency);
		
	}else{
		dates.push(transaction.date.split("T")[0])
	}

	for (let date of dates){
		const transactionValues = [
			budgetID,
			transaction.title,
			transaction.categoryID,
			parseFloat(transaction.amount),
			date,
			transaction.transactionType,
			transaction.recurrenceFrequency || null,
			transaction.recurrenceStartDate ? transaction.recurrenceStartDate.split("T")[0] : null,
			transaction.recurrenceEndDate ? transaction.recurrenceEndDate.split("T")[0] : null,
		];


		await new Promise((resolve, reject) => {
			db.query(transactionQuery, transactionValues, (error, results) => {
				if (error) {
					reject(error);
				}
				for (let userID of transaction.users){
					const userTransactionQuery = `INSERT INTO UserTransaction (userID, transactionID) VALUES (?, ?)`;
					const userTransactionValues = [userID, results.insertId];
					
					db.query(userTransactionQuery, userTransactionValues, (error) => {
						if (error) {
							reject(error);
						}else{
							resolve()
						}

					});
					
				}
			});
		});
	}
	
	return await helperService.updateBudget(budgetID, userID);
	
};

const getTransaction = (transactionID, budgetID) => {
	//need to pull any transaction in budget including when the current user is not a part of transaction (shared budget)
	const query = `SELECT * FROM Transaction  WHERE budgetID = ? AND transactionID = ?`;
	return new Promise((resolve, reject) => {
		db.query(query, [budgetID, transactionID], async (error, results) => {
			if (error) return reject(error);
			let transaction = results[0];

			if (!transaction){
				return reject("Transaction does not exist")
			}
			
			let transactionUsersQuery = "SELECT User.userID, User.username FROM User INNER JOIN UserTransaction ON User.userID = UserTransaction.userID INNER JOIN Transaction ON Transaction.transactionID = UserTransaction.transactionID WHERE Transaction.transactionID = ?"
			
			// retrieve users associated with transaction
			db.query(transactionUsersQuery, [transactionID], (error, userResults) => {	
				if (error) return reject(error)
				transaction.users = userResults
				resolve(transaction);
			})			

			
			
			
		});
	});
};

const getAllTransaction = (budgetID, userID, { day, month, year }) => {
	//need to pull all transactions in budget including transactions the current user is not a part of like in a shared budget
	let query = `SELECT * FROM transaction WHERE budgetID = ?`
	const queryParams = [budgetID];

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

	if (!year && !month && !day) {
		const currentDate = new Date();
		const currentYear = currentDate.getFullYear();
		const currentMonth = currentDate.getMonth() + 1;
		const currentDay = currentDate.getDate();

		query += ` AND YEAR(date) = ? AND MONTH(date) = ? AND DAY(date) = ?`;
		queryParams.push(currentYear, currentMonth, currentDay);
	}

	return new Promise((resolve, reject) => {
		db.query(query, queryParams, (error, results) => {
			if (error) return reject(error);
			resolve(results);
		});
	});
};

const updateTransaction = async (
	transactionID,
	transactionData,
	budgetID,
	userID
) => {
	const query = `
    UPDATE Transaction
    INNER JOIN UserTransaction ON Transaction.transactionID = UserTransaction.transactionID
    SET title = ?, categoryID = ?, amount = ?, date = ?, transactionType = ?, 
        recurrenceFrequency = ?, recurrenceStartDate = ?, recurrenceEndDate = ?
    WHERE Transaction.transactionID = ? AND UserTransaction.userID = ?
  `;

	const values = [
		transactionData.title,
		transactionData.categoryID,
		parseFloat(transactionData.amount),
		transactionData.date.split("T")[0],
		transactionData.transactionType,
		transactionData.recurrenceFrequency || null,
		transactionData.recurrenceStartDate || null,
		transactionData.recurrenceEndDate || null,
		transactionID,
		userID,
	];
	await new Promise((resolve, reject) => {
		db.query(query, values, (error, results) => {
			if (error) return reject(error);
			resolve(results);
			
		});
	});

	const currTransactionUsers = await new Promise((resolve,reject)=>{
		const userTransactionQuery = `SELECT * FROM UserTransaction WHERE transactionID = ?`;
		db.query(userTransactionQuery, [ transactionID], (error, results) => {
			if (error) return reject(error);
			resolve(results);
		});
	})
	
	// add new users to transaction 
	for (const newUserID of transactionData.users){
		let found = currTransactionUsers.find((t)=>t.userID === newUserID) 
		if (!found){
			const addUserTransactionQuery = `INSERT IGNORE INTO UserTransaction (userID, transactionID) VALUES (?, ?)`;
			const addUserTransactionValues = [newUserID, transactionID];
		
			await new Promise((resolve, reject) => { 
				db.query(addUserTransactionQuery, addUserTransactionValues, (error, results) => {
					if (error) {
						reject(error);
					}
					resolve()
				})
			});
	
		}
	}

	// delete any users not in new users to be added only if there are at least 1 user tied to transaction
	if (currTransactionUsers.length > 1){
		let count = currTransactionUsers.length;
		for (const currUser of currTransactionUsers){
			let found = transactionData.users.find((id)=>id === currUser.userID) 
			if (!found && count > 1){
				const addUserTransactionQuery = `DELETE FROM UserTransaction WHERE userID = ? AND transactionID = ?`;
				const addUserTransactionValues = [currUser.userID, transactionID];
				
				await new Promise((resolve, reject) => { 
					db.query(addUserTransactionQuery, addUserTransactionValues, (error, results) => {
						if (error) {
							reject(error);
						}
						count -= 1;
						resolve()
					})
				});
			}
		}

	}	
	

	return await helperService.updateBudget(budgetID, userID);
};

const deleteTransaction = async (transactionID, userID, budgetID) => {
	await new Promise((resolve, reject) => {
		const checkOwnershipQuery = `
		SELECT * FROM UserTransaction WHERE transactionID = ? AND userID = ?
		`;

		db.query(
			checkOwnershipQuery,
			[transactionID, userID],
			(error, results) => {
				if (error) return reject(error);
				if (results.length === 0) {
					return reject("Failed to delete transaction. User not part of transaction")
				}

				const deleteUserTransactionQuery = `DELETE FROM UserTransaction WHERE transactionID = ?`;
				db.query(
					deleteUserTransactionQuery,
					[transactionID],
					(error) => {
						if (error) return reject(error);
						const deleteTransactionQuery = `DELETE FROM Transaction WHERE transactionID = ?`;
						db.query(
							deleteTransactionQuery,
							[transactionID],
							(error, results) => {
								if (error) return reject(error);
								resolve(results);
							}
						);
					}
				);
			}
		);
	});

	return await helperService.updateBudget(budgetID, userID);
};

module.exports = {
	createTransaction,
	getTransaction,
	getAllTransaction,
	updateTransaction,
	deleteTransaction,
};
