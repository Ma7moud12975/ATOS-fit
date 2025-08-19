import React, { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import Button from '../../../components/ui/Button';

const SocialLogin = ({ isLoading = false, onSocialLogin }) => {
  const { isLoaded, signIn } = useSignIn();
  const [socialLoading, setSocialLoading] = useState(false);

  const handleSocialLogin = async (provider) => {
    if (!isLoaded || socialLoading || isLoading) return;
    
    try {
      setSocialLoading(true);
      
      if (provider === 'Google') {
        await signIn.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/dashboard"
        });
      } else if (onSocialLogin) {
        onSocialLogin(provider);
      }
    } catch (err) {
      console.error(`${provider} authentication error:`, err);
      // You might want to show an error message here
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-card text-muted-foreground">Or continue with</span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="flex justify-center">
        {/* Google Login */}
        <Button
          variant="outline"
          onClick={() => handleSocialLogin('Google')}
          disabled={isLoading || socialLoading}
          className="h-12 flex items-center justify-center space-x-2 w-full max-w-sm"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-sm font-medium">Google</span>
        </Button>
      </div>
    </div>
  );
};

export default SocialLogin;