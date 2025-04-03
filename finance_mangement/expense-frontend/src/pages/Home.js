import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import InvoiceDownload from "../components/InvoiceDownload";
import ParentComponent from "../parentcomponent";

const Home = () => {
  return (
    <div>
      <h2>Manage Expenses</h2>
      <ExpenseForm />
      <ExpenseList />
      <InvoiceDownload />
      <ParentComponent />  {/* Render ParentComponent here */}
    </div>
    
  );
};

export default Home;
