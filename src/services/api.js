import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://bank-transaction-system-4938.onrender.com",
});

export default api;
