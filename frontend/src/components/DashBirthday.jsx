import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/birthday/HomeB';

export default function DashBirthday() {
  return (
    <div>

      {/* Nested Routes */}
      <Routes>
        <Route index element={<Home />} />
        {/* <Route path="add" element={<AddBirthday />} /> */}
      </Routes>
    </div>
  );
// import React from 'react'

// export default function DashBirthday() {
//   return <div>DashBirthday</div>;
}
