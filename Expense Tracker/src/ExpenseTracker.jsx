import React, { useState } from "react";
import InvoiceDownload from "./InvoiceDownload";
import "./index.css";

const ExpenseTracker = () => {
    const [expenses, setExpenses] = useState([]);
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
        setExpenses([...expenses, expense]);
        setExpense({
            id: "",
            date: "",
            amount: "",
            category: "Food",
            description: "",
            paymentMethod: "Cash",
        });
    };

    return (
        <div className="container">
            <h1 className="text-center text-3xl font-bold mb-4">Expense Tracker</h1>
            <div className="expense-list">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input type="text" name="id" value={expense.id} onChange={handleChange} placeholder="Expense ID" required />
                    <input type="date" name="date" value={expense.date} onChange={handleChange} required />
                    <input type="number" name="amount" value={expense.amount} onChange={handleChange} placeholder="Amount" required />
                    <select name="category" value={expense.category} onChange={handleChange}>
                        <option>Food</option>
                        <option>Transport</option>
                        <option>Bills</option>
                        <option>Entertainment</option>
                    </select>
                    <textarea name="description" value={expense.description} onChange={handleChange} placeholder="Description"></textarea>
                    <select name="paymentMethod" value={expense.paymentMethod} onChange={handleChange}>
                        <option>Cash</option>
                        <option>Credit Card</option>
                        <option>Bank Transfer</option>
                    </select>
                    <button type="submit">Add Expense</button>
                </form>
            </div>

            <h2 className="text-2xl font-bold mt-6">Expenses</h2>
            <div className="expense-list">
                {expenses.length === 0 ? (
                    <p>No expenses added.</p>
                ) : (
                    expenses.map((exp, index) => (
                        <div key={index} className="border-b p-3">
                            <p><strong>ID:</strong> {exp.id}</p>
                            <p><strong>Date:</strong> {exp.date}</p>
                            <p><strong>Amount:</strong> ${exp.amount}</p>
                            <p><strong>Category:</strong> {exp.category}</p>
                            <p><strong>Description:</strong> {exp.description}</p>
                            <p><strong>Payment Method:</strong> {exp.paymentMethod}</p>
                        </div>
                    ))
                )}
            </div>

            <InvoiceDownload expenses={expenses} />
        </div>
    );
};

export default ExpenseTracker;
