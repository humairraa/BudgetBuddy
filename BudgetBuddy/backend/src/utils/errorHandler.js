const errorHandler = (err, req, res, next) => {
	console.error(err.stack);

	const statusCode = err.status || 500;

	res.status(statusCode).json({
		success: false,
		error: {
			message: err.message || "An unexpected error occurred",
		},
	});
};

module.exports = errorHandler;
