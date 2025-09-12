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
import Function from "./pages/FunctionalArea";
import SessionManager from "./components/SessionManager"; 
import Project from "./pages/Project";
import HomeB from './pages/birthday/HomeB';
import AddBirthday from './pages/birthday/AddBirthday';
import DashBirthday from './components/DashBirthday';
import ProjectDetail from "./pages/ProjectDetail";
import { Navigate } from "react-router-dom";
import Developers from "./pages/developers";

function App() {
  return (
    <BrowserRouter>
      <SessionManager /> 
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
        <Route path="/functional-area" element={<Function />} />
        <Route path="/project" element={<Project />} />
        <Route path="/add-birthday" element={<AddBirthday />} />
        <Route path="/homeB-birthday" element={<HomeB />} />
        <Route path="/dashboard/birthday/*" element={<DashBirthday />} />
        <Route path="/projects/igv" element={<Project mainType="iGV" />} />
        <Route path="/projects/igta" element={<Project mainType="iGTa" />} />
        <Route path="/projects" element={<Project />} />
        <Route path="/projects/:type" element={<Project />} />
        <Route path="/projects/:type/:projectName" element={<ProjectDetail />} />
        <Route path="/developers" element={<Developers />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
