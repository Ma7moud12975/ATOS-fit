import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignUp } from '@clerk/clerk-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    fitnessLevel: '',
    workoutDuration: '30',
    goals: [],
    agreeToTerms: false,
    agreeToPrivacy: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  const fitnessLevelOptions = [
    { value: 'beginner', label: 'Beginner - New to fitness' },
    { value: 'intermediate', label: 'Intermediate - Some experience' },
    { value: 'advanced', label: 'Advanced - Regular training' }
  ];

  const goalOptions = [
    { value: 'weight_loss', label: 'Weight Loss' },
    { value: 'muscle_gain', label: 'Muscle Gain' },
    { value: 'endurance', label: 'Endurance' },
    { value: 'general_fitness', label: 'General Fitness' }
  ];

  const workoutDurations = [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '60 minutes' }
  ];

  const validatePassword = (password) => {
    const minLength = password?.length >= 8;
    const hasUpper = /[A-Z]/?.test(password);
    const hasLower = /[a-z]/?.test(password);
    const hasNumber = /\d/?.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/?.test(password);
    
    const score = [minLength, hasUpper, hasLower, hasNumber, hasSpecial]?.filter(Boolean)?.length;
    
    return {
      isValid: score >= 3 && minLength,
      strength: score <= 2 ? 'weak' : score <= 3 ? 'medium' : score <= 4 ? 'strong' : 'very-strong',
      score
    };
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleGoalChange = (goalValue, checked) => {
    setFormData(prev => ({
      ...prev,
      goals: checked 
        ? [...prev?.goals, goalValue]
        : prev?.goals?.filter(g => g !== goalValue)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData?.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const passwordValidation = validatePassword(formData?.password);
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordValidation?.isValid) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }

    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service';
    }

    if (!formData?.agreeToPrivacy) {
      newErrors.agreeToPrivacy = 'You must agree to the Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!isLoaded) return;
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Create user with Clerk
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
      });

      // Send email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      console.error("Error:", err);
      setErrors({ submit: err.errors?.[0]?.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const onPressVerify = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        
        // Save fitness preferences to Supabase after successful Clerk registration
        try {
          const { updateUserProfile } = await import('../../../utils/db');
          await updateUserProfile(completeSignUp.createdUserId, {
            fitnessLevel: formData?.fitnessLevel || 'beginner',
            workoutDuration: formData?.workoutDuration || '30',
            goals: formData?.goals || [],
            firstName: formData.firstName,
            lastName: formData.lastName,
          });
          
          // Reset per-user state for a new account (fresh start)
          localStorage.removeItem('fitcoach_badges');
          localStorage.removeItem('fitcoach_today_plan');
        } catch (dbError) {
          console.error('Error saving user profile:', dbError);
        }

        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Error:", err);
      setErrors({ submit: err.errors?.[0]?.message || 'Verification failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = async (provider) => {
    if (!isLoaded || isLoading) return;
    
    console.log(`Registering with ${provider}`);
    
    try {
      setIsLoading(true);
      setErrors({}); // Clear any previous errors
      
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard"
      });
    } catch (err) {
      console.error("Google authentication error:", err);
      setErrors({ submit: err.errors?.[0]?.message || 'Google authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValidation = validatePassword(formData?.password);

  // Show verification form if pending verification
  if (pendingVerification) {
    return (
      <form onSubmit={onPressVerify} className="space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Verify your email</h2>
          <p className="text-sm text-muted-foreground">
            We've sent a verification code to {formData.email}
          </p>
        </div>
        
        <Input
          label="Verification Code"
          type="text"
          placeholder="Enter verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          error={errors?.submit}
          required
        />

        {errors?.submit && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
            <p className="text-sm text-error">{errors?.submit}</p>
          </div>
        )}

        <Button
          type="submit"
          variant="default"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
          className="h-12"
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            placeholder="Enter your first name"
            value={formData?.firstName}
            onChange={(e) => handleInputChange('firstName', e?.target?.value)}
            error={errors?.firstName}
            required
          />
          
          <Input
            label="Last Name"
            type="text"
            placeholder="Enter your last name"
            value={formData?.lastName}
            onChange={(e) => handleInputChange('lastName', e?.target?.value)}
            error={errors?.lastName}
            required
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={formData?.email}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={errors?.email}
          required
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="Create a strong password"
            value={formData?.password}
            onChange={(e) => handleInputChange('password', e?.target?.value)}
            error={errors?.password}
            required
          />
          
          {/* Password Strength Indicator */}
          {formData?.password && (
            <div className="mt-2">
              <div className="flex items-center space-x-2 mb-1">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordValidation?.strength === 'weak' ? 'bg-error w-1/4' :
                      passwordValidation?.strength === 'medium' ? 'bg-warning w-2/4' :
                      passwordValidation?.strength === 'strong'? 'bg-success w-3/4' : 'bg-success w-full'
                    }`}
                  />
                </div>
                <span className={`text-xs font-medium ${
                  passwordValidation?.strength === 'weak' ? 'text-error' :
                  passwordValidation?.strength === 'medium'? 'text-warning' : 'text-success'
                }`}>
                  {passwordValidation?.strength === 'weak' ? 'Weak' :
                   passwordValidation?.strength === 'medium' ? 'Medium' :
                   passwordValidation?.strength === 'strong' ? 'Strong' : 'Very Strong'}
                </span>
              </div>
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={formData?.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
          error={errors?.confirmPassword}
          required
        />
      </div>
      {/* Advanced Preferences */}
      <div className="border-t border-border pt-6">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-left mb-4"
        >
          <span className="text-sm font-medium text-foreground">
            Fitness Preferences (Optional)
          </span>
          <Icon 
            name={showAdvanced ? "ChevronUp" : "ChevronDown"} 
            size={16} 
            className="text-muted-foreground"
          />
        </button>

        {showAdvanced && (
          <div className="space-y-4 animate-spring">
            <Select
              label="Fitness Level"
              placeholder="Select your fitness level"
              options={fitnessLevelOptions}
              value={formData?.fitnessLevel}
              onChange={(value) => handleInputChange('fitnessLevel', value)}
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Primary Goals (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {goalOptions?.map((goal) => (
                  <Checkbox
                    key={goal?.value}
                    label={goal?.label}
                    checked={formData?.goals?.includes(goal?.value)}
                    onChange={(e) => handleGoalChange(goal?.value, e?.target?.checked)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Preferred Workout Duration
              </label>
              <div className="grid grid-cols-2 gap-3">
                {workoutDurations?.map((duration) => (
                  <label
                    key={duration?.value}
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData?.workoutDuration === duration?.value
                        ? 'border-primary bg-primary/5' :'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <input
                      type="radio"
                      name="workoutDuration"
                      value={duration?.value}
                      checked={formData?.workoutDuration === duration?.value}
                      onChange={(e) => handleInputChange('workoutDuration', e?.target?.value)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      formData?.workoutDuration === duration?.value
                        ? 'border-primary' :'border-muted-foreground'
                    }`}>
                      {formData?.workoutDuration === duration?.value && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                    <span className="text-sm text-foreground">{duration?.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Terms and Privacy */}
      <div className="space-y-3">
        <Checkbox
          label={
            <span className="text-sm">
              I agree to the{' '}
              <button type="button" className="text-primary hover:underline">
                Terms of Service
              </button>
            </span>
          }
          checked={formData?.agreeToTerms}
          onChange={(e) => handleInputChange('agreeToTerms', e?.target?.checked)}
          error={errors?.agreeToTerms}
          required
        />

        <Checkbox
          label={
            <span className="text-sm">
              I agree to the{' '}
              <button type="button" className="text-primary hover:underline">
                Privacy Policy
              </button>
            </span>
          }
          checked={formData?.agreeToPrivacy}
          onChange={(e) => handleInputChange('agreeToPrivacy', e?.target?.checked)}
          error={errors?.agreeToPrivacy}
          required
        />
      </div>
      {/* Submit Error */}
      {errors?.submit && (
        <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
          <p className="text-sm text-error">{errors?.submit}</p>
        </div>
      )}
      
      {/* CAPTCHA Widget */}
      <div id="clerk-captcha" data-cl-theme="auto" data-cl-size="normal"></div>
      
      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
        className="h-12"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
      {/* Social Registration */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialRegister('Google')}
          iconName="Chrome"
          iconPosition="left"
          className="h-11 w-full max-w-xs"
        >
          Google
        </Button>
      </div>
      {/* Login Link */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login-screen')}
            className="text-primary hover:underline font-medium"
          >
            Sign In
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegistrationForm;