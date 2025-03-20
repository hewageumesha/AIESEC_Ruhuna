import React, { useState } from "react";

const ExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    id: "",
    date: "",
    amount: "",
    category: "Food",
    description: "",
    paymentMethod: "Cash",
  });

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!expense.id || !expense.date || !expense.amount) return;
    onAddExpense(expense);
    setExpense({ id: "", date: "", amount: "", category: "Food", description: "", paymentMethod: "Cash" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input type="text" name="id" value={expense.id} onChange={handleChange}
          placeholder="Expense ID" className="input-field" required />
        <input type="date" name="date" value={expense.date} onChange={handleChange}
          className="input-field" required />
      </div>
      <input type="number" name="amount" value={expense.amount} onChange={handleChange}
        placeholder="Amount ($)" className="input-field" required />
      <select name="category" value={expense.category} onChange={handleChange}
        className="input-field">
        <option>Food</option>
        <option>Transport</option>
        <option>Bills</option>
        <option>Entertainment</option>
      </select>
      <textarea name="description" value={expense.description} onChange={handleChange}
        placeholder="Description" className="input-field"></textarea>
      <select name="paymentMethod" value={expense.paymentMethod} onChange={handleChange}
        className="input-field">
        <option>Cash</option>
        <option>Credit Card</option>
        <option>Bank Transfer</option>
      </select>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600">
        Add Expense ✅
      </button>
    </form>
  );
};

export default ExpenseForm;
