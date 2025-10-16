/**
 * Enhanced User Profile Component
 * Shows comprehensive user information with the new profile structure
 */
import React, { useState } from 'react';
import { useUserProfile } from '../hooks/useICPDatabase';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Icon from './AppIcon';
import LoadingSpinner from './ui/LoadingSpinner';

const EnhancedUserProfile = () => {
  const { profile, loading, updateProfile } = useUserProfile();
  const { principal } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({});

  React.useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        email: profile.email || '',
        age: profile.age || 25,
        height: profile.height || 170,
        weight: profile.weight || 70,
        gender: profile.gender || 'Other',
        activityLevel: profile.activityLevel || 'Moderate',
        primaryGoals: profile.primaryGoals || [],
        preferredWorkoutTime: profile.preferredWorkoutTime || 'Morning (6am - 12pm)',
        workoutReminders: profile.workoutReminders || false
      });
    }
  }, [profile]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoalToggle = (goal) => {
    setFormData(prev => ({
      ...prev,
      primaryGoals: prev.primaryGoals.includes(goal)
        ? prev.primaryGoals.filter(g => g !== goal)
        : [...prev.primaryGoals, goal]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        email: profile.email || '',
        age: profile.age || 25,
        height: profile.height || 170,
        weight: profile.weight || 70,
        gender: profile.gender || 'Other',
        activityLevel: profile.activityLevel || 'Moderate',
        primaryGoals: profile.primaryGoals || [],
        preferredWorkoutTime: profile.preferredWorkoutTime || 'Morning (6am - 12pm)',
        workoutReminders: profile.workoutReminders || false
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-muted-foreground">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-center py-8">
          <Icon name="User" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Profile Found</h3>
          <p className="text-muted-foreground">Please complete the onboarding process.</p>
        </div>
      </div>
    );
  }

  const goalOptions = [
    'Weight Loss',
    'Muscle Gain', 
    'Build Endurance',
    'Increase Strength',
    'General Fitness'
  ];

  const activityLevels = [
    { value: 'Sedentary', label: 'Sedentary - Little to no exercise' },
    { value: 'Light', label: 'Light - Exercise 1-3 days/week' },
    { value: 'Moderate', label: 'Moderate - Exercise 3-5 days/week' },
    { value: 'Active', label: 'Active - Exercise 6-7 days/week' },
    { value: 'Very Active', label: 'Very Active - Intense exercise daily' }
  ];

  const workoutTimes = [
    'Morning (6am - 12pm)',
    'Afternoon (12pm - 6pm)', 
    'Evening (6pm - 12am)'
  ];

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>
            <p className="text-sm text-muted-foreground">
              Principal: {principal?.toString().slice(0, 20)}...
            </p>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  loading={isSaving}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Icon name="Edit" size={16} className="mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4">Basic Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              disabled={!isEditing}
            />
            <Input
              label="Email (Optional)"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Physical Stats */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4">Physical Stats</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Age: {formData.age}
              </label>
              <input
                type="range"
                min="13"
                max="100"
                value={formData.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                disabled={!isEditing}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Height: {formData.height} cm
              </label>
              <input
                type="range"
                min="100"
                max="250"
                value={formData.height}
                onChange={(e) => handleInputChange('height', parseFloat(e.target.value))}
                disabled={!isEditing}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Weight: {formData.weight} kg
              </label>
              <input
                type="range"
                min="30"
                max="200"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                disabled={!isEditing}
                className="w-full"
              />
            </div>
          </div>
          <div className="mt-4">
            <Select
              label="Gender"
              value={formData.gender}
              onChange={(value) => handleInputChange('gender', value)}
              disabled={!isEditing}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' }
              ]}
            />
          </div>
        </div>

        {/* Fitness Information */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4">Fitness Information</h4>
          <div className="space-y-4">
            <Select
              label="Activity Level"
              value={formData.activityLevel}
              onChange={(value) => handleInputChange('activityLevel', value)}
              disabled={!isEditing}
              options={activityLevels}
            />
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Primary Goals
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {goalOptions.map(goal => (
                  <label 
                    key={goal}
                    className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.primaryGoals.includes(goal)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-muted/50'
                    } ${!isEditing ? 'cursor-not-allowed opacity-60' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.primaryGoals.includes(goal)}
                      onChange={() => isEditing && handleGoalToggle(goal)}
                      disabled={!isEditing}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    />
                    <span className="text-foreground">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            <Select
              label="Preferred Workout Time"
              value={formData.preferredWorkoutTime}
              onChange={(value) => handleInputChange('preferredWorkoutTime', value)}
              disabled={!isEditing}
              options={workoutTimes.map(time => ({ value: time, label: time }))}
            />

            <label className={`flex items-center space-x-3 p-3 border border-border rounded-lg transition-colors ${
              !isEditing ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-muted/50'
            }`}>
              <input
                type="checkbox"
                checked={formData.workoutReminders}
                onChange={(e) => isEditing && handleInputChange('workoutReminders', e.target.checked)}
                disabled={!isEditing}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <span className="text-foreground">Enable workout reminders</span>
            </label>
          </div>
        </div>

        {/* Profile Timestamps */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Created:</span>{' '}
              {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>{' '}
              {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'Unknown'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedUserProfile;