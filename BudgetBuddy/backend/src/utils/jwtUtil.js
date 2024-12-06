const jwt = require("jsonwebtoken");

const generateToken = (userID, userType) => {
	return jwt.sign(
		{ userID: userID, userType: userType },
		process.env.JWT_SECRET,
		{
			expiresIn: "1h",
		}
	);
};

const verifyToken = (token) => {
	try {
		return jwt.verify(token, process.env.JWT_SECRET);
	} catch (error) {
		return null;
	}
};

const decodeToken = (token) => {
	try {
		return jwt.decode(token);
	} catch (error) {
		return null;
	}
};

module.exports = { generateToken, verifyToken, decodeToken };
