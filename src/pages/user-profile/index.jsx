import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import Icon from '../../components/AppIcon';
import { getUserById, updateUserProfile } from '../../utils/db';
import Button from '../../components/ui/Button';
import ProfileHeader from './components/ProfileHeader';
import PersonalInfoTab from './components/PersonalInfoTab';
import FitnessMetricsTab from './components/FitnessMetricsTab';
import { paymentService } from '../../utils/paymentService';
// Achievements tab removed per request

const UserProfile = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark'); // Default to dark mode
  const [activeTab, setActiveTab] = useState('personal');
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark
    setCurrentTheme(savedTheme);
    // Use class instead of data attribute for Tailwind dark mode
    if (savedTheme === 'dark') {
      document.documentElement?.classList?.add('dark');
    } else {
      document.documentElement?.classList?.remove('dark');
    }
    // Load session user from localStorage (matching onboarding key)
    (async () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const u = JSON.parse(userData);
          setUser({
            id: u?.id || u?.principalId,
            name: u?.name || 'New User',
            email: u?.email || '',
            phone: u?.phone || '',
            dateOfBirth: u?.dateOfBirth || '',
            location: u?.location || '',
            profilePicture: u?.profilePicture || '',
            joinDate: (u?.createdAt || new Date().toISOString()).slice(0,10),
            totalWorkouts: 0,
            currentStreak: 0,
            longestStreak: 0,
            achievements: 0,
            thisWeekWorkouts: 0,
            thisMonthWorkouts: 0,
            age: u?.age || '',
            height: u?.height || '',
            weight: u?.weight || '',
            fitnessLevel: u?.fitnessLevel || 'beginner',
            primaryGoal: u?.primaryGoal || '',
            goals: u?.goals || [],
            workoutFrequency: u?.workoutFrequency || '',
            preferredWorkoutTime: u?.preferredWorkoutTime || '',
            availableEquipment: u?.availableEquipment || [],
            totalCaloriesBurned: '0',
            totalWorkoutTime: '0h',
            goalsCompleted: 0
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setUser(null);
      }
    })();

    // Load subscription data
    const loadSubscription = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const u = JSON.parse(userData);
          const userId = u?.id || u?.principalId;
          
          if (userId) {
            await paymentService.initialize();
            const subscriptionData = await paymentService.getUserSubscription(userId);
            
            if (subscriptionData.success) {
              setSubscription(subscriptionData.subscription);
            }
          }
        }
      } catch (error) {
        console.error('Error loading subscription data:', error);
      } finally {
        setIsLoadingSubscription(false);
      }
    };

    loadSubscription();
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

  const handleLogout = () => {
    navigate('/login-screen');
  };

  const handleUpdateUser = async (updatedUser) => {
    setUser(updatedUser);
    
    // Update localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    try {
      const { updateUserProfile } = await import('../../utils/db');
      await updateUserProfile(updatedUser.id, updatedUser);
    } catch {}
  };

  const handleUpdateMetrics = (metrics) => {
    const updatedUser = { ...user, ...metrics };
    setUser(updatedUser);
    
    // Update localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };


  const handleProfilePictureUpdate = async (newPicture) => {
    const updatedUser = { ...user, profilePicture: newPicture };
    setUser(updatedUser);
    
    // Update localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    try {
      if (user?.id) await updateUserProfile(user.id, { profilePicture: newPicture });
    } catch {}
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: 'User' },
    { id: 'metrics', label: 'Fitness Metrics', icon: 'Activity' },
    { id: 'subscription', label: 'Subscription', icon: 'CreditCard' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfoTab user={user} onUpdateUser={handleUpdateUser} />;
      case 'metrics':
        return <FitnessMetricsTab user={user} onUpdateMetrics={handleUpdateMetrics} />;
      case 'subscription':
        return renderSubscriptionTab();
      default:
        return <PersonalInfoTab user={user} onUpdateUser={handleUpdateUser} />;
    }
  };

  const renderSubscriptionTab = () => {
    if (isLoadingSubscription) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#FF8A00] border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-400">Loading subscription...</span>
        </div>
      );
    }

    const handleUpgrade = () => {
      navigate('/pricing');
    };

    const handleCancelSubscription = async () => {
      if (!subscription?.id) return;
      
      const confirmed = window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.');
      
      if (confirmed) {
        try {
          const result = await paymentService.cancelSubscription(subscription.id);
          if (result.success) {
            alert('Subscription cancelled successfully.');
            // Reload subscription data
            const subscriptionData = await paymentService.getUserSubscription(user.id);
            if (subscriptionData.success) {
              setSubscription(subscriptionData.subscription);
            }
          } else {
            alert('Failed to cancel subscription: ' + result.error);
          }
        } catch (error) {
          console.error('Error cancelling subscription:', error);
          alert('An error occurred while cancelling your subscription.');
        }
      }
    };

    return (
      <div className="space-y-6">
        {/* Current Plan */}
        <div className="bg-gray-900 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Current Plan</h3>
          
          {subscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium text-white">{subscription.plan}</h4>
                  <p className="text-gray-400 capitalize">Status: {subscription.status}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#FF8A00]">
                    ${paymentService.getSubscriptionPlanDetails(subscription.plan)?.price || 'N/A'}/month
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Started:</span>
                  <p className="text-white">
                    {new Date(Number(subscription.createdAt) / 1000000).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Next Billing:</span>
                  <p className="text-white">
                    {subscription.status === 'Active' ? 'Monthly' : 'N/A'}
                  </p>
                </div>
              </div>

              {subscription.status === 'Active' && (
                <div className="pt-4 border-t border-gray-700">
                  <button
                    onClick={handleCancelSubscription}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Cancel Subscription
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="CreditCard" className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-white mb-2">Free Plan</h4>
              <p className="text-gray-400 mb-6">
                You're currently on the free plan. Upgrade to unlock premium features!
              </p>
              <button
                onClick={handleUpgrade}
                className="px-6 py-3 bg-[#FF8A00] hover:bg-[#E67B00] text-black font-semibold rounded-xl transition-colors"
              >
                Upgrade to Premium
              </button>
            </div>
          )}
        </div>

        {/* Plan Features */}
        <div className="bg-gray-900 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Plan Features</h3>
          
          {subscription ? (
            <div className="space-y-3">
              {paymentService.getSubscriptionPlanDetails(subscription.plan)?.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-[#FF8A00] rounded-full mr-3"></div>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#FF8A00] rounded-full mr-3"></div>
                <span className="text-gray-300">10 hours of workout tracking per month</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#FF8A00] rounded-full mr-3"></div>
                <span className="text-gray-300">100 AI chatbot messages per month</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#FF8A00] rounded-full mr-3"></div>
                <span className="text-gray-300">50 food scans per month</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#FF8A00] rounded-full mr-3"></div>
                <span className="text-gray-300">Basic workout library access</span>
              </div>
            </div>
          )}
        </div>

        {/* Upgrade Options */}
        {!subscription && (
          <div className="bg-gradient-to-r from-[#FF8A00]/10 to-[#E67B00]/10 border border-[#FF8A00]/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Available Upgrades</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Premium</h4>
                <p className="text-2xl font-bold text-[#FF8A00] mb-2">$19.99/month</p>
                <p className="text-gray-400 text-sm mb-4">Enhanced features for serious fitness enthusiasts</p>
                <button
                  onClick={handleUpgrade}
                  className="w-full py-2 bg-[#FF8A00] hover:bg-[#E67B00] text-black font-semibold rounded-lg transition-colors"
                >
                  Choose Premium
                </button>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Premium Plus</h4>
                <p className="text-2xl font-bold text-[#FF8A00] mb-2">$29.99/month</p>
                <p className="text-gray-400 text-sm mb-4">Unlimited access to all features</p>
                <button
                  onClick={handleUpgrade}
                  className="w-full py-2 bg-transparent border border-[#FF8A00] text-[#FF8A00] hover:bg-[#FF8A00] hover:text-black font-semibold rounded-lg transition-colors"
                >
                  Choose Premium Plus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const safeUser = user || {
    id: 0,
    name: 'New User',
    email: '',
    phone: '',
    dateOfBirth: '',
    location: '',
    profilePicture: '',
    joinDate: new Date().toISOString().slice(0,10),
    totalWorkouts: 0,
    currentStreak: 0,
    longestStreak: 0,
    achievements: 0,
    thisWeekWorkouts: 0,
    thisMonthWorkouts: 0,
    age: '',
    height: '',
    weight: '',
    fitnessLevel: 'beginner',
    primaryGoal: '',
    totalCaloriesBurned: '0',
    totalWorkoutTime: '0h',
    goalsCompleted: 0
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AppHeader
        onSidebarToggle={handleSidebarToggle}
        isSidebarOpen={isSidebarOpen}
        onThemeToggle={handleThemeToggle}
        currentTheme={currentTheme}
         user={user || { name: 'New User', email: '' }}
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
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <button 
              onClick={() => navigate('/dashboard')}
              className="hover:text-foreground transition-colors"
            >
              Dashboard
            </button>
            <Icon name="ChevronRight" size={16} />
            <span className="text-foreground font-medium">Profile</span>
          </nav>
          {/* Profile Header */}
          <ProfileHeader 
            user={safeUser} 
            onProfilePictureUpdate={handleProfilePictureUpdate}
          />

          {/* Tab Navigation */}
          <div className="bg-card border border-border rounded-lg mb-6">
            {/* Mobile Tab Selector */}
            <div className="lg:hidden border-b border-border">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e?.target?.value)}
                className="w-full p-4 bg-transparent text-card-foreground font-medium focus:outline-none"
              >
                {tabs?.map((tab) => (
                  <option key={tab?.id} value={tab?.id}>
                    {tab?.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop Tab Navigation */}
            <div className="hidden lg:flex border-b border-border">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {(() => {
                switch (activeTab) {
                  case 'personal':
                    return <PersonalInfoTab user={safeUser} onUpdateUser={handleUpdateUser} />;
                  case 'metrics':
                    return <FitnessMetricsTab user={safeUser} onUpdateMetrics={handleUpdateMetrics} />;
                  default:
                    return <PersonalInfoTab user={safeUser} onUpdateUser={handleUpdateUser} />;
                }
              })()}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default UserProfile;