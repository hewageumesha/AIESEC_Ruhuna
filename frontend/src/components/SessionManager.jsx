import { useIdleTimer } from 'react-idle-timer';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';

export default function SessionManager() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const callSignoutAPI = async (token) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/signout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: "include"  // important if backend uses cookies
      });

      if (!response.ok) {
        console.error("Signout API failed:", response.status);
      } else {
        console.log("✅ Backend & DB updated to LOGGED_OUT");
      }
    } catch (error) {
      console.error("Auto signout error:", error);
    }
  };

  const performLogout = async () => {
    const token = sessionStorage.getItem("token");

    if (token) {
      await callSignoutAPI(token);
    }

    // Clear frontend
    sessionStorage.removeItem("token");
    dispatch(signoutSuccess());

    alert("You have been logged out due to inactivity.");
    navigate("/");
  };

  // Idle timeout handler
  useIdleTimer({
    timeout: 30 * 60 * 1000, // 30 minutes
    onIdle: performLogout,
    debounce: 500,
  });

  // Handle browser/tab close
  useEffect(() => {
    const handleUnload = async () => {
      const token = sessionStorage.getItem("token");
      if (token) {
        await callSignoutAPI(token);
      }
      sessionStorage.removeItem("token");
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  return null;
}
