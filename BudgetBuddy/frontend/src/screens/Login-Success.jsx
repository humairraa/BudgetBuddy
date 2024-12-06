import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginSuccess = () => {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const queryParams = new URLSearchParams(location.search);
		const token = queryParams.get("token");

		if (token) {
			// Save the token to localStorage
			localStorage.setItem("jwt-token", token);
			// Navigate to the dashboard or another secure page
			navigate("/home");
		} else {
			navigate("/login");
		}
	}, [location, navigate]);

	return <div>Loading...</div>;
};

export default LoginSuccess;
