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

  // Check local storage directly for token
  const token = localStorage.getItem('token');
  const userCurrentStr = localStorage.getItem('user-current');
  
  // Force authenticated if token exists but state doesn't reflect it
  const actuallyAuthenticated = !!token;
  
  useEffect(() => {
    const checkAuth = async () => {
      // If we have a token but user state is not authenticated
      if (token && (!isAuthenticated || !currentUser)) {
        try {
          // We have a token, try to fetch user data
          await dispatch(fetchCurrentUser() as any);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
      
      setIsCheckingAuth(false);
    };
    
    checkAuth();
  }, [token, isAuthenticated, currentUser, dispatch]);

  // Show loading state while checking auth
  if (isCheckingAuth || loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If token exists but Redux state doesn't show authenticated, this is likely an issue with the state
  // We'll let the user through, but the subsequent API calls might still fail
  if (!isAuthenticated && !actuallyAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If we get here, either isAuthenticated is true or token exists
  return <>{children}</>;
};

export default ProtectedRoute;