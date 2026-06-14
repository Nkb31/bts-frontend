import axios from "axios";

const api = axios.create({
  baseURL: "https://bank-transaction-system-4938.onrender.com",
});

export default api;