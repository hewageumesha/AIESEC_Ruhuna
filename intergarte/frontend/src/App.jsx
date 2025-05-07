import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
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
import DashboardComp from './components/DashboardComp'; // ✅ main dashboard page
import DashBirthday from './components/DashBirthday';   // ✅ birthday page

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ✅ Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardComp />} /> {/* Dashboard Home */}
            <Route path="birthday" element={<DashBirthday />} /> {/* Birthday */}
          </Route>
        </Route>

        <Route path="/global-intern" element={<GlobalIntern />} />
        <Route path="/global-teacher" element={<GlobalTeacher />} />
        <Route path="/global-volunteer" element={<GlobalVolunteer />} />
        <Route path="/become-member" element={<BecomeMember />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
