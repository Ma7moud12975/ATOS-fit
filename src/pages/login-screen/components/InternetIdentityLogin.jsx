import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Icon from '../../../components/AppIcon';

const InternetIdentityLogin = () => {
  const { login, loading } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      setError(null);
      await login();
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Internet Identity Info */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Icon name="Shield" size={32} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Secure Login with Internet Identity
          </h3>
          <p className="text-sm text-muted-foreground">
            Use your Internet Identity to securely access ATOS fit. 
            No passwords required - just biometrics or hardware keys.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        </div>
      )}

      {/* Login Button */}
      <Button
        onClick={handleLogin}
        disabled={loading || isLoggingIn}
        className="w-full h-12 text-base font-medium"
        size="lg"
      >
        {isLoggingIn ? (
          <div className="flex items-center space-x-2">
            <LoadingSpinner size="sm" />
            <span>Connecting to Internet Identity...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Icon name="LogIn" size={20} />
            <span>Login with Internet Identity</span>
          </div>
        )}
      </Button>

      {/* Features */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground">Why Internet Identity?</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <Icon name="Check" size={16} className="text-green-500 flex-shrink-0" />
            <span className="text-sm text-muted-foreground">No passwords to remember</span>
          </div>
          <div className="flex items-center space-x-3">
            <Icon name="Check" size={16} className="text-green-500 flex-shrink-0" />
            <span className="text-sm text-muted-foreground">Biometric authentication</span>
          </div>
          <div className="flex items-center space-x-3">
            <Icon name="Check" size={16} className="text-green-500 flex-shrink-0" />
            <span className="text-sm text-muted-foreground">Fully decentralized and secure</span>
          </div>
          <div className="flex items-center space-x-3">
            <Icon name="Check" size={16} className="text-green-500 flex-shrink-0" />
            <span className="text-sm text-muted-foreground">Your data stays private</span>
          </div>
        </div>
      </div>

      {/* Help Link */}
      <div className="text-center pt-4">
        <a
          href="https://identity.ic0.app/faq"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Learn more about Internet Identity →
        </a>
      </div>
    </div>
  );
};

export default InternetIdentityLogin;