import { useEffect, useState } from "react";
import { getExpenses } from "../services/expenseService";

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        getExpenses().then(setExpenses);
    }, []);

    return (
        <div>
            <h2>Expense List</h2>
            <ul>
                {expenses.map(expense => (
                    <li key={expense.id}>
                        {expense.date} - {expense.category}: ${expense.amount}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Expenses;
