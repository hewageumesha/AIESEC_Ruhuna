import { Link } from "react-router-dom";
import ExpenseList from "../components/ExpenseList";
import InvoiceDownload from "../components/InvoiceDownload";


const HomePage = () => {
  const refreshExpenses = () => window.location.reload();

  return (
    <div className="p-4">
      <Link to="/add" className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Add Expense
      </Link>
      <ExpenseList refreshExpenses={refreshExpenses} />
      <InvoiceDownload />
    </div>
  );
};

export default HomePage;
