import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile, useWorkoutTracking, useUserStatistics } from '../../hooks/useICPDatabase';
import AppHeader from '../../components/ui/AppHeader';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import WelcomeSection from './components/WelcomeSection';
import TodayWorkoutCard from './components/TodayWorkoutCard';
import DailyTipsCard from './components/DailyTipsCard';
import ProgressWidget from './components/ProgressWidget';
import DashboardCharts from './components/DashboardCharts';
import WaterMonitoringCard from './components/WaterMonitoringCard';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import SubscriptionStatusCard from './components/SubscriptionStatusCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import UserTable from '../../components/UserTable';
import DatabaseTest from '../../components/DatabaseTest';
import paymentService from '../../utils/paymentService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, principal } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { workouts } = useWorkoutTracking();
  const { stats } = useUserStatistics();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark'); // Default to dark mode
  const [subscription, setSubscription] = useState(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);

  // User data from ICP profile or localStorage fallback
  const [user, setUser] = useState({ name: 'New User', email: '', profilePicture: '', fitnessLevel: 'Beginner', goals: [] });
  
  // Allow skipping onboarding/login redirects in development
  const skipLoginFlag = (typeof window !== 'undefined' && window.localStorage?.getItem('SKIP_LOGIN') === '1') || import.meta.env.VITE_SKIP_LOGIN === 'true' || import.meta.env.VITE_SKIP_LOGIN === '1';
  
  // Update user state from ICP profile
  useEffect(() => {
    if (profile) {
      console.log('Loading user from ICP profile:', profile);
      setUser({
        name: profile.username || 'New User',
        email: profile.email || '',
        profilePicture: '',
        fitnessLevel: (profile.activityLevel || 'beginner')?.replace(/\b\w/g, c => c.toUpperCase()),
        goals: [profile.fitnessGoal] || []
      });
      
      // Also update localStorage for backward compatibility
      const userData = {
        id: principal?.toString(),
        name: profile.username,
        email: profile.email,
        fitnessLevel: profile.activityLevel,
        goals: [profile.fitnessGoal]
      };
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      // Fallback to localStorage if profile not loaded yet
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser({
            name: parsedUser?.name || 'New User',
            email: parsedUser?.email || '',
            profilePicture: parsedUser?.profilePicture || '',
            fitnessLevel: (parsedUser?.fitnessLevel || 'beginner')?.replace(/\b\w/g, c => c.toUpperCase()),
            goals: parsedUser?.goals || []
          });
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, [profile, principal]);

  // Check if user needs to complete onboarding
  useEffect(() => {
    if (skipLoginFlag) {
      // Developer override: do not redirect to onboarding/login
      return;
    }

    // Wait for profile to load
    if (!profileLoading) {
      if (!profile) {
        // No profile in ICP database, redirect to onboarding
        console.log('No profile found, redirecting to onboarding');
        navigate('/onboarding', { replace: true });
      }
    }
  }, [profile, profileLoading, navigate, skipLoginFlag]);



  // Progress data from ICP statistics
  const progressData = {
    weeklyGoal: 5,
    completedWorkouts: stats?.totalWorkouts || 0,
    currentStreak: stats?.currentStreak || 0,
    totalWorkouts: stats?.totalWorkouts || 0,
    caloriesBurned: stats?.totalCaloriesBurned || 0,
    weeklyCalorieGoal: 2000,
    achievements: []
  };

  // Show loading while profile loads
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  useEffect(() => {
    // Load theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setCurrentTheme(savedTheme);
    // Use class instead of data attribute for Tailwind dark mode
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleThemeToggle = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Use class instead of data attribute for Tailwind dark mode
    if (newTheme === 'dark') {
      document.documentElement?.classList?.add('dark');
    } else {
      document.documentElement?.classList?.remove('dark');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('user');
      localStorage.removeItem('theme');
      navigate('/login-screen');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still navigate to login even if logout fails
      navigate('/login-screen');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AppHeader
        onSidebarToggle={handleSidebarToggle}
        isSidebarOpen={isSidebarOpen}
        onThemeToggle={handleThemeToggle}
        currentTheme={currentTheme}
        user={user}
        onLogout={handleLogout}
      />
      {/* Sidebar */}
      <SidebarNavigation
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      {/* Main Content */}
      <main className="pt-16 lg:pl-72 min-h-screen">
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Welcome Section */}
          <WelcomeSection user={user} />

          {/* Today's Workout */}
          <TodayWorkoutCard workoutData={{
            name: "Full Body Strength",
            scheduledTime: "6:00 PM",
            exercises: [
              { name: "Push-ups", sets: 3, reps: 15, completed: true },
              { name: "Wide Push Ups", sets: 3, reps: 12, completed: false },
              { name: "Squats", sets: 3, reps: 20, completed: true },
              { name: "Plank", sets: 3, duration: "30s", completed: false },
              { name: "Lunges", sets: 3, reps: 12, completed: false },
              { name: "Mountain Climbers", sets: 3, reps: 15, completed: false }
            ],
            estimatedDuration: 30,
            difficulty: "Intermediate"
          }} />

          {/* Progress & Tips Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <ProgressWidget progressData={progressData} />
            </div>
            <div>
              <DailyTipsCard />
            </div>
          </div>

          {/* Subscription Status & Water Monitoring */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <SubscriptionStatusCard 
                subscription={subscription} 
                isLoading={isLoadingSubscription} 
              />
            </div>
            <div>
              <WaterMonitoringCard />
            </div>
          </div>

          {/* Database Connection Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <UserTable />
            </div>
            <div>
              <DatabaseTest />
            </div>
          </div>

          {/* Analytics */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div>
              <AdvancedAnalytics />
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <DashboardCharts />
            </div>
          </div>



          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="text-center text-sm text-muted-foreground">
              <p>© {new Date()?.getFullYear()} FitCoach AI. All rights reserved.</p>
              <p className="mt-2">Your AI-powered fitness companion for a healthier lifestyle.</p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;