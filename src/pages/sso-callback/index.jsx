import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';

const SSOCallback = () => {
  const navigate = useNavigate();
  const clerk = useClerk();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Handle the OAuth callback
        await clerk.handleRedirectCallback();
        
        // Redirect to dashboard after successful authentication
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('SSO callback error:', error);
        // Redirect to login on error
        navigate('/login-screen', { replace: true });
      }
    };

    handleCallback();
  }, [clerk, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
};

export default SSOCallback;