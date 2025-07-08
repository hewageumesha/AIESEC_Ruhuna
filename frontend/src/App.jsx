import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn"
import ForgetPassword from "./pages/ForgetPassword";
import ChangePassword from "./pages/ChangePassword";
import HomePage from "./pages/Home";
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Header from "./components/Header";
import Footer from './components/Footer';
import Gallery from './pages/Gallery';
import PrivateRoute from "./components/PrivateRoute";
import GlobalIntern from "./pages/GlobalIntern";
import GlobalVolunteer from "./pages/GlobalVolunteer";
import GlobalTeacher from "./pages/GlobalTeacher";
import BecomeMember from "./pages/BecomeMember";
import React from 'react';
import Contact from './pages/Contact';
import EventDetails from "./pages/EventDetails";
import EditEvent from "./components/event/EditEvent";
import HomeB from './pages/HomeB';
import AddBirthday from './pages/AddBirthday';
import DashBirthday from './components/DashBirthday';
import AddExpensePage from "./pages/AddExpensePage";
import EditExpensePage from "./pages/EditExpensePage";
import HomeExpensePage from "./pages/HomeExpensePage";
import DashFinance from "./components/DashFinance";


function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path='/gallery' element={<Gallery />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route element={<PrivateRoute/>}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/global-intern" element={<GlobalIntern />} />
        <Route path="/global-teacher" element={<GlobalTeacher />} />
        <Route path="/global-volunteer" element={<GlobalVolunteer />} />
        <Route path="/become-member" element={<BecomeMember />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/edit-event/:id" element={<EditEvent />} />
         <Route path="/add-birthday" element={<AddBirthday />} />
        <Route path="/homeB-birthday" element={<HomeB />} />
         <Route path="/expense" element={<HomeExpensePage />} />
        <Route path="/expense/add" element={<AddExpensePage />} />
        <Route path="/expense/edit/:id" element={<EditExpensePage />} />
        <Route path="/dashboard/birthday/*" element={<DashBirthday />} />
        <Route path="/dashboard/finance/*" element={<DashFinance />} />

      </Routes>
    <Footer/>
    </BrowserRouter>
  )
}

export default App
