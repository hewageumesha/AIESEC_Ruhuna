import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import InvoiceDownload from "../components/InvoiceDownload";

const Home = () => {
  return (
    <div>
      <h2>Manage Expenses</h2>
      <ExpenseForm />
      <ExpenseList />
      <InvoiceDownload />
    </div>
  );
};

export default Home;
