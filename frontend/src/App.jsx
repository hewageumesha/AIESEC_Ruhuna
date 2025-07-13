import {BrowserRouter, Routes, Route, useParams} from "react-router-dom";
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


import Function from "./pages/FunctionalArea";
import TaskDashboard from "./components/Task/TaskDashboard.jsx";
import TaskList from "./components/Task/TaskList.jsx";
import AssignedTasks from "./components/Task/AssignedTasks.jsx";
import UserProgressPage from "./components/Task/UserProgressPage.jsx";
import CreateTask from "./components/Task/CreateTask.jsx";
import TaskUpdate from "./components/Task/TaskUpdate.jsx";
import Notifications from "./components/Task/Notifications.jsx";
import TaskDashboardLCVP from "./components/Task/TaskDashboardLCVP.jsx";
import TaskDashboardTL from "./components/Task/TaskDashboardTL.jsx";
import TaskDashboardMember from "./components/Task/TaskDashboardMember.jsx";

import PublicEventsPage from "./pages/PublicEvents";
import EventAnalytics from "./pages/EventAnalytics";

const NotificationsWrapper = () => {
  const { id } = useParams();
  console.log("🚀 Extracted ID from URL:", id);
  if (!id) return <div>User ID missing</div>;
  return <Notifications id={id}></Notifications>;
};


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
         <Route path="/add-birthday" element={<AddBirthday />} />
        <Route path="/homeB-birthday" element={<HomeB />} />
         <Route path="/expense" element={<HomeExpensePage />} />
        <Route path="/expense/add" element={<AddExpensePage />} />
        <Route path="/expense/edit/:id" element={<EditExpensePage />} />
        <Route path="/dashboard/birthday/*" element={<DashBirthday />} />
        <Route path="/dashboard/finance/*" element={<DashFinance />} />

        <Route path="/functional-area" element={<Function />} />
        <Route path="/das" element={<EventDetails />} />

        {/* Task Routes */}
        <Route path="/user/:id/TaskList" element={<TaskList />} />
        <Route path="/assigned-tasks" element={<AssignedTasks />} />
        <Route path="/user/:id/progress" element={<UserProgressPage />} />
        <Route path="/user/:id/CreateTask" element={<CreateTask />} />
        <Route path="/users/:id/tasks/:taskId/edit" element={<TaskUpdate />} />
        <Route path="/user/:id/notifications" element={<NotificationsWrapper />} />

        {/* LCP dashboard */}
        <Route path="/user/:id/TaskDashboard" element={<TaskDashboard />} />
        {/* LCVP dashboard */}
        <Route path="/user/:id/TaskDashboardLCVP" element={<TaskDashboardLCVP />} />
        {/* TL dashboard */}
        <Route path="/user/:id/TaskDashboardTL" element={<TaskDashboardTL />} />
        {/* Member dashboard */}
        <Route path="/user/:id/TaskDashboardMember" element={<TaskDashboardMember />} />

        {/* Event Routes */}
        <Route path="/public-event" element={<PublicEventsPage />} />
        <Route path="/public-event/:id" element={<EventDetails />} />
        <Route path="/event-analytics" element={<EventAnalytics />} />


      </Routes>
    <Footer/>
    </BrowserRouter>
  )
}

export default App
