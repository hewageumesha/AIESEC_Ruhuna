import { useSelector } from 'react-redux';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import React from 'react'

export default function PrivateRoute() {
  const { currentUser, loading } = useSelector((state) => state.user);
  const location = useLocation();

  if (loading) return null; // Prevent redirecting while authentication is loading

  return currentUser ? (
    <Outlet />
  ) : (
    <Navigate to='/sign-in' state={{ from: location }} replace />
  );
}
