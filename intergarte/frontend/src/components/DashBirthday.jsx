import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from '../pages/Home';
import AddBirthday from '../pages/AddBirthday';

export default function DashBirthday() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🎂 Birthday Reminder</h2>
      
      {/* Nav bar inside birthday section */}
      <nav className="bg-white text-blue-900 p-4 flex justify-between items-center shadow-md mb-4">
        <div className="space-x-4 flex items-center">
          <Link to="/dashboard/birthday" className="hover:underline">Home</Link>
          <Link to="/dashboard/birthday/add" className="hover:underline">Add Birthday</Link>
        </div>
      </nav>

      {/* Nested Routes */}
      <Routes>
        <Route index element={<Home />} />
        <Route path="add" element={<AddBirthday />} />
      </Routes>
    </div>
  );
}
