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
import TaskDashboard from "./components/Task/TaskDashboard";
import TaskDashboardLCVP from "./components/Task/TaskDashboardLCVP";
import TaskDashboardTL from "./components/Task/TaskDashboardTL";
import TaskDashboardMember from "./components/Task/TaskDashboardMember";
import TaskList from "./components/Task/TaskList";
import AssignedTasks from "./components/Task/AssignedTasks";
import UserProgressPage from "./components/Task/UserProgressPage";
import CreateTask from "./components/Task/CreateTask";
import TaskUpdate from "./components/Task/TaskUpdate";

const NotificationsWrapper = () => {
    const { id } = useParams();
    console.log("🚀 Extracted ID from URL:", id);
    if (!id) return <div>User ID missing</div>;
    return <Notifications id={id}></Notifications>;
};

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

        <Route path="/user/:id/TaskDashboard" element={<TaskDashboard />} />
        <Route path="/user/:id/TaskDashboardLCVP" element={<TaskDashboardLCVP />} />
        <Route path="/user/:id/TaskDashboardTL" element={<TaskDashboardTL />} />
        <Route path="/user/:id/TaskDashboardMember" element={<TaskDashboardMember />} />

        <Route path="/user/:id/TaskList" element={<TaskList />}/>
        <Route path="/assigned-tasks" element={<AssignedTasks/>}/>
        <Route path="/user/:id/progress" element={<UserProgressPage />} />
        <Route path="/user/:id/CreateTask" element={<CreateTask/>}/>
        <Route path="/users/:id/tasks/:taskId/edit" element={<TaskUpdate/>}/>
        <Route path="/user/:id/notifications" element={<NotificationsWrapper />} />
        

      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
