import axios from "axios";

const customAxiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

customAxiosInstance.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("jwt-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default customAxiosInstance;