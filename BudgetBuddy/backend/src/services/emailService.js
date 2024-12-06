const postmark = require("postmark");
const client = new postmark.ServerClient(
	"8d5d6dfa-16b7-4678-adbb-e1c1b1cae65c"
);

async function sendEmail(to, subject, htmlBody) {
	try {
		await client.sendEmail({
			From: "wisdom1.ng@torontomu.ca",
			To: to,
			Subject: subject,
			HtmlBody: htmlBody,
		});
		console.log(`Email sent to ${to}`);
	} catch (error) {
		console.error("Error sending email:", error.message);
	}
}

module.exports = {
	sendEmail,
};
