const authService = require("../services/authService");
const passport = require("../../config/passportConfig");
const jwtUtil = require("../utils/jwtUtil");

const register = async (req, res) => {
	const { email, username, password } = req.body;
	if (!email || !username || !password) {
		return res.status(400).json({ error: "All fields are required" });
	}
	try {
		let token = await authService.registerUser(email, username, password);
		res.status(201).json(token);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ error: "All fields are required" });
	}

	try {
		let token = await authService.loginUser(email, password);
		return res.status(201).json(token);
	} catch (error) {
		res.status(401).json({ error });
	}
};

const google = passport.authenticate("google", {
	scope: ["profile", "email"],
});

const googleCallback = passport.authenticate("google", {
	session: false,
	access_type: "offline",
	scope: ["profile", "email"],
});

const googleCallbackFunction = (req, res) => {
	if (!req.user) {
		res.redirect("http://localhost:5173/login");
	}
	const token = jwtUtil.generateToken(req.user.userID, req.user.userType);

	res.redirect(`http://localhost:5173/login-success?token=${token}`);
};

module.exports = {
	register,
	login,
	googleCallback,
	google,
	googleCallbackFunction,
};
