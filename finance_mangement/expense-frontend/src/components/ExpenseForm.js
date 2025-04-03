import { useState, useEffect } from "react"; // ✅ Import useEffect
import { createExpense, updateExpense, deleteExpense } from "../services/api"; // ✅ Import API functions

const ExpenseForm = ({ refreshExpenses, editingExpense, setEditingExpense }) => {
  const [expense, setExpense] = useState({
    amount: "",
    category: "",
    date: "",
    description: "",
    paymentMethod: "",
    role: "",
    userId: "",
  });

  // Populate form when editing
  useEffect(() => {
    if (editingExpense) {
      setExpense(editingExpense);
    } else {
      setExpense({
        amount: "",
        category: "",
        date: "",
        description: "",
        paymentMethod: "",
        role: "",
        userId: "",
      });
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, expense); // ✅ Use correct function
        alert("Expense updated successfully!");
        setEditingExpense(null); // ✅ Clear edit mode
      } else {
        await createExpense(expense); // ✅ Use correct function
        alert("Expense added successfully!");
      }
      refreshExpenses();
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const handleDelete = async () => {
    // Prompt the user for confirmation
    const isConfirmed = window.confirm("Are you sure you want to delete this expense?");
    
    if (isConfirmed) {
      try {
        await deleteExpense(editingExpense.id); // Replace with correct API call
        console.log("Expense deleted successfully!"); // Log successful deletion
        alert("Expense deleted successfully!"); // Show alert to user
        setEditingExpense(null); // Clear edit mode
        refreshExpenses(); // Refresh the list of expenses
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    } else {
      console.log("Deletion canceled.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editingExpense ? "Edit Expense" : "Add Expense"}</h2>

      <input
        type="number"
        name="amount"
        value={expense.amount}
        onChange={handleChange}
        placeholder="Amount"
        required
      />

      <select name="category" value={expense.category} onChange={handleChange} required>
        <option value="">Select Category</option>
        <option value="food">Food</option>
        <option value="transport">Transport</option>
        <option value="entertainment">Entertainment</option>
        <option value="education">Education</option>
        <option value="other">Other</option>
      </select>

      <input
        type="date"
        name="date"
        value={expense.date}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="description"
        value={expense.description}
        onChange={handleChange}
        placeholder="Description"
      />

      <select name="paymentMethod" value={expense.paymentMethod} onChange={handleChange} required>
        <option value="">Select Payment Method</option>
        <option value="cash">Cash</option>
        <option value="card">Card</option>
        <option value="bankTransfer">Bank Transfer</option>
      </select>

      <select name="role" value={expense.role} onChange={handleChange} required>
        <option value="">Select Role</option>
        <option value="lcp">LCP</option>
        <option value="lcvp">LCVP</option>
      </select>

      <input
        type="text"
        name="userId"
        value={expense.userId}
        onChange={handleChange}
        placeholder="User ID"
        required
      />

      <button type="submit">{editingExpense ? "Update Expense" : "Add Expense"}</button>
      
      {/* Delete Button only visible when editing an expense */}
      {editingExpense && (
        <>
          <button type="button" onClick={handleDelete}>Delete Expense</button>
          <button type="button" onClick={() => setEditingExpense(null)}>Cancel</button>
        </>
      )}
    </form>
  );
};

export default ExpenseForm;
