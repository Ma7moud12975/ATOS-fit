import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import NotFound from "pages/NotFound";
import AIAssistantFoodScanner from './pages/ai-assistant-food-scanner';
import LoginScreen from './pages/login-screen';
import Dashboard from './pages/dashboard';
import ExerciseWorkoutScreen from './pages/exercise-workout-screen';
import RegisterScreen from './pages/register-screen';
import UserProfile from './pages/user-profile';
import SSOCallback from './pages/sso-callback';

// Component to redirect authenticated users away from auth pages
const AuthRedirect = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public routes - redirect to dashboard if authenticated */}
        <Route path="/" element={<AuthRedirect><LoginScreen /></AuthRedirect>} />
        <Route path="/login-screen" element={<AuthRedirect><LoginScreen /></AuthRedirect>} />
        <Route path="/register-screen" element={<AuthRedirect><RegisterScreen /></AuthRedirect>} />
        
        {/* SSO callback route */}
        <Route path="/sso-callback" element={<SSOCallback />} />
        
        {/* Protected routes - require authentication */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/ai-assistant-food-scanner" element={<ProtectedRoute><AIAssistantFoodScanner /></ProtectedRoute>} />
        <Route path="/exercise-workout-screen" element={<ProtectedRoute><ExerciseWorkoutScreen /></ProtectedRoute>} />
        <Route path="/user-profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        
        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
