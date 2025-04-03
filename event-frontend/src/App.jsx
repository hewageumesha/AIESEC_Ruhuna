import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import AddEvent from "./components/AddEvent/AddEvent";
import ManageEvents from "./components/ManageEvents/ManageEvents";
import Gallery from "./components/Gallery/Gallery";
import './index.css'



const App = () => {
  return (
    <Router>

      <Routes>
        
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-event" element={<AddEvent />} />
        <Route path="/manage-events" element={<ManageEvents />} />
        <Route path="/gallery" element={<Gallery />} />
        
      </Routes>
    </Router>
  );
};

export default App;