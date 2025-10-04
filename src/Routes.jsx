import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/landing';
import PricingPage from './pages/pricing';
import PrivacyPage from './pages/privacy';
import AboutPage from './pages/about';
import AIAssistantFoodScanner from './pages/ai-assistant-food-scanner';
import LoginScreen from './pages/login-screen';
import Dashboard from './pages/dashboard';
import ExerciseWorkoutScreen from './pages/exercise-workout-screen';
import RegisterScreen from './pages/register-screen';
import UserProfile from './pages/user-profile';
import OnboardingScreen from './pages/onboarding';
import ProtectedRoute from './components/ui/ProtectedRoute';
import SchedulePage from './pages/schedule';
import Exercises from './pages/exercise-library';
import AchievementsPage from './pages/achievements';

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            {/* Define your route here */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/ai-assistant-food-scanner" element={<AIAssistantFoodScanner />} />
            <Route path="/login-screen" element={<LoginScreen />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/exercise-workout-screen" element={<ExerciseWorkoutScreen />} />
            <Route path="/register-screen" element={<RegisterScreen />} />
            <Route path="/onboarding" element={<ProtectedRoute><OnboardingScreen /></ProtectedRoute>} />
            <Route path="/user-profile" element={<UserProfile />} />
            
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/exercise-library" element={<Exercises />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
