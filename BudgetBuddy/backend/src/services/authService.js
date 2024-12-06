const userService = require("./userService");
const jwtUtil = require("../utils/jwtUtil");
const bcrypt = require("bcryptjs");

const registerUser = async (email, username, password) => {
	try {
		const userID = await userService.createUser(email, username , password);
		const user = await userService.findUserByID(userID);
		let token = jwtUtil.generateToken(user.userID, user.userType);

		return { token: token };
	} catch (error) {
		throw error;
	}
};

const loginUser = async (identifier, password) => {
	try {
		const user = await userService.findUser(identifier);
		if (!user) throw new Error("Invalid email/username or password");

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			console.log("invalid password");
			throw new Error("Invalid email/username or password");
		}

		let token = jwtUtil.generateToken(user.userID, user.userType);

		return { token: token };
	} catch (error) {
		throw error;
	}
};

module.exports = { registerUser, loginUser };
