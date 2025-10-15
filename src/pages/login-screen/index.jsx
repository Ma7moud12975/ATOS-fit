import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../hooks/useICPDatabase';
import AuthenticationLayout from '../../components/ui/AuthenticationLayout';
import InternetIdentityLogin from './components/InternetIdentityLogin';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const LoginScreen = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const [isVisible, setIsVisible] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      setIsChecking(true);
      
      // Wait for profile check to complete
      if (!profileLoading) {
        if (profile) {
          // User has profile in ICP database, go to dashboard
          console.log('User has profile, redirecting to dashboard');
          navigate('/dashboard', { replace: true });
        } else {
          // New user, redirect to onboarding
          console.log('New user, redirecting to onboarding');
          navigate('/onboarding', { replace: true });
        }
        setIsChecking(false);
      }
    }
  }, [isAuthenticated, authLoading, profile, profileLoading, navigate]);

  // Enforce dark mode on the login screen only
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    return () => {
      root.classList.remove('dark');
    };
  }, []);
  // Show loading while checking authentication and profile
  if (isChecking || (isAuthenticated && profileLoading)) {
    return (
      <AuthenticationLayout>
        <div className="w-full max-w-md mx-auto p-6 bg-card rounded-xl shadow-lg">
          <div className="flex flex-col items-center justify-center py-8">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-muted-foreground">Checking your profile...</p>
          </div>
        </div>
      </AuthenticationLayout>
    );
  }

  return (
    <AuthenticationLayout>
      <div className="w-full max-w-md mx-auto p-6 bg-card rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign in to ATOS fit</h2>
        {/* Restore the login form */}
        <React.Suspense fallback={<div>Loading...</div>}>
          {/** Dynamically import LoginForm to avoid breaking changes if not present **/}
          {(() => {
            try {
              const LoginForm = require('./components/LoginForm').default;
              return <LoginForm />;
            } catch (e) {
              return <InternetIdentityLogin />;
            }
          })()}
        </React.Suspense>
      </div>
    </AuthenticationLayout>
  );
  
};

export default LoginScreen;