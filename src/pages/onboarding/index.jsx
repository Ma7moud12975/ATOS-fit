import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../hooks/useICPDatabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const OnboardingScreen = () => {
  const navigate = useNavigate();
  const { isAuthenticated, principal } = useAuth();
  const { profile, loading: profileLoading, error: profileError, createProfile } = useUserProfile();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: 30,
    height: 175,
    weight: 70,
    gender: 'Male',
    activityLevel: 'Moderate - Exercise 3-5 days/week',
    primaryGoals: [],
    preferredWorkoutTime: 'Morning (6am - 12pm)',
    workoutReminders: true,
  });

  const totalSteps = 3;

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setCurrentTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login-screen', { replace: true });
      return;
    }

    // Check if user already has a profile in ICP database
    if (!profileLoading && profile) {
      console.log('User already has profile, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, profile, profileLoading, navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create profile in ICP database with new structure
      const result = await createProfile({
        fullName: formData.fullName,
        email: formData.email || null, // Optional field
        age: formData.age,
        height: formData.height,
        weight: formData.weight,
        gender: formData.gender,
        activityLevel: formData.activityLevel,
        primaryGoals: formData.primaryGoals,
        preferredWorkoutTime: formData.preferredWorkoutTime,
        workoutReminders: formData.workoutReminders,
      });

      if (result.success) {
        console.log('Profile created successfully in ICP database');
        
        // Also save to localStorage for backward compatibility
        const userProfile = {
          id: principal?.toString(),
          principalId: principal?.toString(),
          fullName: formData.fullName,
          email: formData.email,
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('user', JSON.stringify(userProfile));
        
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.error || 'Failed to create profile');
      }
    } catch (error) {
      console.error('Failed to save user profile:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const goalOptions = [
    { value: 'Weight Loss', label: 'Weight Loss' },
    { value: 'Muscle Gain', label: 'Muscle Gain' },
    { value: 'Build Endurance', label: 'Build Endurance' },
    { value: 'Increase Strength', label: 'Increase Strength' },
    { value: 'General Fitness', label: 'General Fitness' },
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to ATOS-fit!</h2>
              <p className="text-muted-foreground">Let's get to know you.</p>
            </div>
            <div className="space-y-4">
              <Input
                label="Full Name*"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                required
              />
              <Input
                label="Email Address (Optional)"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email (optional)"
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Your Fitness Profile</h2>
              <p className="text-muted-foreground">These details help us tailor your experience.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Age: {formData.age}</label>
                <input
                  type="range"
                  min="13"
                  max="100"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Height: {formData.height} cm</label>
                <input
                  type="range"
                  min="100"
                  max="250"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Weight: {formData.weight} kg</label>
                <input
                  type="range"
                  min="30"
                  max="200"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <Select
                label="Gender"
                value={formData.gender}
                onChange={(value) => handleInputChange('gender', value)}
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Other', label: 'Other' },
                ]}
                placeholder="Select your gender"
              />
              <Select
                label="Activity Level"
                value={formData.activityLevel}
                onChange={(value) => handleInputChange('activityLevel', value)}
                options={[
                  { value: 'Sedentary - Little to no exercise', label: 'Sedentary - Little to no exercise' },
                  { value: 'Light - Exercise 1-2 days/week', label: 'Light - Exercise 1-2 days/week' },
                  { value: 'Moderate - Exercise 3-5 days/week', label: 'Moderate - Exercise 3-5 days/week' },
                  { value: 'Active - Exercise 6-7 days/week', label: 'Active - Exercise 6-7 days/week' },
                  { value: 'Very Active - Intense exercise daily', label: 'Very Active - Intense exercise daily' },
                ]}
                placeholder="Select your activity level"
              />
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Goals & Preferences</h2>
              <p className="text-muted-foreground">Help us personalize your fitness journey.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Primary Goals (Select at least one)</label>
                <div className="space-y-2">
                  {goalOptions.map((goal) => (
                    <label key={goal.value} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.primaryGoals.includes(goal.value)}
                        onChange={(e) => handleArrayChange('primaryGoals', goal.value, e.target.checked)}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                      />
                      <span className="text-foreground">{goal.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Select
                label="Preferred Workout Time"
                value={formData.preferredWorkoutTime}
                onChange={(value) => handleInputChange('preferredWorkoutTime', value)}
                options={[
                  { value: 'morning', label: 'Morning (6am - 12pm)' },
                  { value: 'afternoon', label: 'Afternoon (12pm - 6pm)' },
                  { value: 'evening', label: 'Evening (6pm - 12am)' },
                ]}
                placeholder="When do you prefer to workout?"
              />
              <div>
                <label className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.workoutReminders}
                    onChange={(e) => handleInputChange('workoutReminders', e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="text-foreground">Enable workout reminders</span>
                </label>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim(); // Only name is required, email is optional
      case 2:
        return formData.age && formData.height && formData.weight && formData.gender && formData.activityLevel;
      case 3:
        return formData.goals.length > 0;
      default:
        return false;
    }
  };

  // Show loading while checking profile
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background flex items-center justify-center p-4 ${
      currentTheme === 'dark' ? 'dark' : ''
    }`}>
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-xl shadow-lg p-8">
          {error && <ErrorMessage error={error} className="mb-6" />}
          {renderStep()}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <Icon name="ChevronLeft" size={16} />
              <span>Previous</span>
            </Button>
            
            {currentStep === totalSteps ? (
              <Button
                onClick={handleComplete}
                disabled={!isStepValid() || isLoading}
                loading={isLoading}
                className="flex items-center space-x-2"
              >
                <Icon name="Check" size={16} />
                <span>Complete Setup</span>
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <Icon name="ChevronRight" size={16} />
              </Button>
            )}
          </div>
        </div>
        
        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              // Save minimal user data when skipping
              const minimalUserData = {
                id: principal?.toString(),
                principalId: principal?.toString(),
                name: formData.name || 'New User',
                email: formData.email || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                skippedOnboarding: true
              };
              localStorage.setItem('user', JSON.stringify(minimalUserData));
              navigate('/dashboard');
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;