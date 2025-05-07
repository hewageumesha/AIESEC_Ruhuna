import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function OnlyAdminPrivateRoute() {
  const { currentUser, loading } = useSelector((state) => state.user);

  if (loading) return null; // Prevent redirecting while loading

  return currentUser ? (
    currentUser.isAdmin ? <Outlet /> : <Navigate to='/403' />
  ) : (
    <Navigate to='/sign-in' />
  );
}
