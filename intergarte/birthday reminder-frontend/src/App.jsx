import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import AddBirthday from "./pages/AddBirthday";

const App = () => {
  const [todayCount, setTodayCount] = useState(0);

  return (
    <Router>
      <nav className="bg-white text-blue-900 p-4 flex justify-between items-center shadow-md">
        <h1 className="text-lg font-bold">🎂 Birthday Reminder</h1>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/add" className="hover:underline">Add Birthday</Link>

        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home setTodayCount={setTodayCount} />} />
        <Route path="/add" element={<AddBirthday />} />
      </Routes>
    </Router>
  );
};

export default App;
