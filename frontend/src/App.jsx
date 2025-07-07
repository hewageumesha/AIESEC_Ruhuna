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
import TaskDashboard from "./components/Task/TaskDashboard.jsx";
import TaskList from "./components/Task/TaskList.jsx";
import AssignedTasks from "./components/Task/AssignedTasks.jsx";
import UserProgressPage from "./components/Task/UserProgressPage.jsx";
import CreateTask from "./components/Task/CreateTask.jsx";
import TaskUpdate from "./components/Task/TaskUpdate.jsx";

function App() {
  console.log("👀 current user from localStorage:", JSON.parse(localStorage.getItem("user")));

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
        <Route path="/das" element={<EventDetails />} />

        {/* Task Routs */}
        <Route path="/user/:id/TaskList" element={<TaskList />}/>
        <Route path="/assigned-tasks" element={<AssignedTasks/>}/>
        <Route path="/user/:id/progress" element={<UserProgressPage />} />
        <Route path="/user/:id/CreateTask" element={<CreateTask/>}/>
        <Route path="/users/:id/tasks/:taskId/edit" element={<TaskUpdate/>}/>

        {/* LCP dashboard */}
        <Route path="/user/:id/TaskDashboard" element={<TaskDashboard />} />
      </Routes>
    <Footer/>
    </BrowserRouter>
  )
}

export default App
