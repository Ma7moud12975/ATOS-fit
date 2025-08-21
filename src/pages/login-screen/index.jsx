import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthenticationLayout from '../../components/ui/AuthenticationLayout';
import InternetIdentityLogin from './components/InternetIdentityLogin';

const LoginScreen = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      // Check if user has completed onboarding
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        // If user has basic profile data, go to dashboard, otherwise onboarding
        if (user.name && user.email) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/onboarding', { replace: true });
        }
      } else {
        // New user, redirect to onboarding
        navigate('/onboarding', { replace: true });
      }
    }
  }, [isAuthenticated, loading, navigate]);

  // Enforce dark mode on the login screen only
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    return () => {
      root.classList.remove('dark');
    };
  }, []);

  // Show loading while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <AuthenticationLayout
        title="Welcome Back"
        subtitle="Sign in securely with Internet Identity"
        showLogo={true}
      >
        <InternetIdentityLogin />
      </AuthenticationLayout>
    </div>
  );
};

export default LoginScreen;