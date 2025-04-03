import { useState } from "react";
import axios from "../services/api";

const ExpenseForm = ({ refreshExpenses }) => {
  const [expense, setExpense] = useState({
    amount: "",
    category: "",
    date: "",
    description: "",
    paymentMethod: "",
    role: "",
    userId: "",
  });

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/expenses", expense);
      alert("Expense added successfully!");
      refreshExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        name="amount"
        onChange={handleChange}
        placeholder="Amount"
        required
      />

      <select name="category" onChange={handleChange} required>
        <option value="">Select Category</option>
        <option value="food">Food</option>
        <option value="transport">Transport</option>
        <option value="entertainment">Entertainment</option>
        <option value="education">Education</option>
        <option value="other">Other</option>
      </select>

      <input type="date" name="date" onChange={handleChange} required />

      <input
        type="text"
        name="description"
        onChange={handleChange}
        placeholder="Description"
      />

      <select name="paymentMethod" onChange={handleChange} required>
        <option value="">Select Payment Method</option>
        <option value="cash">Cash</option>
        <option value="card">Card</option>
        <option value="bankTransfer">Bank Transfer</option>
      </select>

      <select name="role" onChange={handleChange} required>
        <option value="">Select Role</option>
        <option value="lcp">LCP</option>
        <option value="lcvp">LCVP</option>
      </select>

      <input
        type="text"
        name="userId"
        onChange={handleChange}
        placeholder="User ID"
        required
      />

      <button type="submit">Add Expense</button>
    </form>
  );
};

export default ExpenseForm;
