import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  // 1. If the app is still checking localStorage, show a simple message
  // This prevents the "White Screen of Death"
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-indigo-400">
        Authenticating session...
      </div>
    );
  }

  // 2. If user exists, let them pass to the Dashboard (Outlet)
  // 3. If no user, send them back to Login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;