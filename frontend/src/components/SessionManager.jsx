import { useIdleTimer } from 'react-idle-timer';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function SessionManager() {
  const navigate = useNavigate();

  const handleOnIdle = () => {
    // Remove token (if stored in localStorage or sessionStorage)
    sessionStorage.removeItem('token'); // or localStorage.removeItem
    alert('You have been logged out due to inactivity.');

    // Optional: call signout API
    fetch(`https://aiesecinruhuna-production.up.railway.app/api/auth/signout`, {
      method: 'POST',
    });

    navigate('/login'); // Redirect to login page
  };

  useIdleTimer({
    timeout: 30 * 60 * 1000, // 30 minutes
    onIdle: handleOnIdle,
    debounce: 500,
  });

  useEffect(() => {
    // Log out on browser/tab close
    const handleUnload = () => {
      sessionStorage.removeItem('token');
      fetch('https://aiesecinruhuna-production.up.railway.app/api/auth/signout', { method: 'POST' });
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  return null;
}
