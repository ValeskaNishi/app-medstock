import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      "Ocorreu um erro inesperado. Tente novamente mais tarde";
    return Promise.reject(new Error(message));
  },
);

export default api;
