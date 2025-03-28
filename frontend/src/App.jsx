import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn"
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import HomePage from "./pages/Home";
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Header from "./components/Header";
import { Footer } from 'flowbite-react';
import Gallery from './pages/Gallery';
//import './index.css'

function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<PrivateRoute/>}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/gallery' element={<Gallery />} />
      </Routes>
    <Footer/>
    </BrowserRouter>
  )
}

export default App
