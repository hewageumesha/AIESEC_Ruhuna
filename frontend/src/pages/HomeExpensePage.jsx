
import { Link } from "react-router-dom";
import ExpenseList from "../components/ExpenseList";
import InvoiceDownload from "../components/InvoiceDownload";


const HomeExpensePage = () => {
  const refreshExpenses = () => window.location.reload();

  return (
    <div className="p-4">
      <Link to="/expense/add"
        className="bg-green-500 !text-black px-4 py-2 rounded mb-4 inline-block"
      >
        Add Expense
      </Link>

      <ExpenseList refreshExpenses={refreshExpenses} />
      <InvoiceDownload />
    </div>
  );
};

export default HomeExpensePage;
