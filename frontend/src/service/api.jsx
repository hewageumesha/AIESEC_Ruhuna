import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // Update this based on your backend
});

// API functions for CRUD operations
export const getExpenses = () => api.get("/expenses");
export const createExpense = (expense) => api.post("/expenses", expense);
export const updateExpense = (id, expense) => api.put(`/expenses/${id}`, expense);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

export default api;


