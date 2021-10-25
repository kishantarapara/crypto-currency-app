import axios from "axios";

const axiosConfig = {
  baseURL: "https://api.coincap.io/v2",
  timeout: 120000,
};

const axiosInstance = axios.create(axiosConfig);

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.detail) {
      error.response.data.detail = `Error: ${error.response.data.detail}`;
    } else {
      error = {
        response: {
          data: {
            detail: error.message || "Error while connecting to server",
          },
        },
      };
    }
    return error;
  }
);

export { axiosInstance };
