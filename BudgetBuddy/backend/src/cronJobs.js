const cron = require("node-cron");
const { sendEmail } = require("./services/emailService");
const userService = require("./services/userService");
const budgetService = require("./services/budgetService");

// Email to be sent on the 1st of every month at 9 AM
cron.schedule("0 9 1 * *", async () => {
	try {
		const users = await userService.getAllUsers();

		for (const user of users) {
			const message = "";
			const budgets = await budgetService.getAllBudgets(user.userID);

			for (const budget of budgets) {
				const totalBalance = budget.totalBalance;
				const totalIncome = budget.totalIncome;
				const totalExpenses = budget.totalExpenses;
				const financialHealthScore = budget.financialHealthScore;
				const title = budget.title;

				message += `<h2>${title}</h2>`;
				message += `<p>Total Balance: ${totalBalance}</p>`;
				message += `<p>Total Income: ${totalIncome}</p>`;
				message += `<p>Total Expenses: ${totalExpenses}</p>`;
				message += `<p>Financial Health Score: ${financialHealthScore}</p>`;
			}
			await sendEmail(user.email, "Monthly Report", message);
		}
	} catch (error) {
		console.error("Failed to send monthly email:", error.message);
	}
});
