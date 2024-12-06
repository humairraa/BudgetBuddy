const jwtUtil = require("./jwtUtil");

const authMiddleware = (req, res, next) => {
	let token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "Access token missing" });
	}
	const decoded = jwtUtil.verifyToken(token);

	if (!decoded) {
		return res.status(403).json({ message: "Invalid or expired token" });
	}

	req.userID = decoded.userID;
	next();
};

module.exports = authMiddleware;
