import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { fetchCurrentUser } from '../store/slices/userSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const dispatch = useDispatch();
  const { isAuthenticated, currentUser, role, loading, userId } = useSelector((state: RootState) => state.user);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const token = localStorage.getItem('token');
  const userCurrentStr = localStorage.getItem('user-current');
  

  const actuallyAuthenticated = !!token;
  
  useEffect(() => {
    const checkAuth = async () => {
      if (token && (!isAuthenticated || !currentUser)) {
        try {
          await dispatch(fetchCurrentUser() as any);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
      
      setIsCheckingAuth(false);
    };
    
    checkAuth();
  }, [token, isAuthenticated, currentUser, dispatch]);

  if (isCheckingAuth || loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  if (!isAuthenticated && !actuallyAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;