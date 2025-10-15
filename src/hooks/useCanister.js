import { useState, useEffect, useCallback } from 'react';
import {
  userProfileAPI,
  workoutAPI,
  chatAPI,
  foodAPI,
  achievementsAPI,
  workoutPlansAPI,
  statisticsAPI,
  dataManagementAPI
} from '../services/canisterAPI';

// ============ USER PROFILE HOOKS ============

/**
 * Hook to manage user profile
 */
export const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userProfileAPI.get();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await userProfileAPI.create(profileData);
      if (result.success) {
        setProfile(result.data);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    try {
      setLoading(true);
      setError(null);
      const result = await userProfileAPI.update(updates);
      if (result.success) {
        setProfile(result.data);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    createProfile,
    updateProfile,
    refetch: fetchProfile
  };
};

// ============ WORKOUT HOOKS ============

/**
 * Hook to manage workouts
 */
export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workoutAPI.getUserWorkouts();
      setWorkouts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const recordWorkout = useCallback(async (workoutData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await workoutAPI.record(workoutData);
      if (result.success) {
        await fetchWorkouts(); // Refresh list
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchWorkouts]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  return {
    workouts,
    loading,
    error,
    recordWorkout,
    refetch: fetchWorkouts
  };
};

// ============ CHAT HISTORY HOOKS ============

/**
 * Hook to manage chat history
 */
export const useChatHistory = (limit = 10) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await chatAPI.getHistory(limit);
      setChats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const saveChat = useCallback(async (messages, context = 'general') => {
    try {
      setLoading(true);
      setError(null);
      const result = await chatAPI.save(messages, context);
      if (result.success) {
        await fetchChats(); // Refresh list
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchChats]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return {
    chats,
    loading,
    error,
    saveChat,
    refetch: fetchChats
  };
};

// ============ FOOD ANALYSIS HOOKS ============

/**
 * Hook to manage food analyses
 */
export const useFoodAnalyses = (daysBack = 7) => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalyses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await foodAPI.getAnalyses(daysBack);
      setAnalyses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [daysBack]);

  const recordFood = useCallback(async (foodData, mealType) => {
    try {
      setLoading(true);
      setError(null);
      const result = await foodAPI.record(foodData, mealType);
      if (result.success) {
        await fetchAnalyses(); // Refresh list
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchAnalyses]);

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  return {
    analyses,
    loading,
    error,
    recordFood,
    refetch: fetchAnalyses
  };
};

// ============ ACHIEVEMENTS HOOKS ============

/**
 * Hook to manage achievements
 */
export const useAchievements = () => {
  const [allAchievements, setAllAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [all, user] = await Promise.all([
        achievementsAPI.getAll(),
        achievementsAPI.getUserAchievements()
      ]);
      setAllAchievements(all);
      setUserAchievements(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  // Helper to check if achievement is unlocked
  const isUnlocked = useCallback((achievementId) => {
    return userAchievements.some(ua => ua.achievementId === achievementId);
  }, [userAchievements]);

  return {
    allAchievements,
    userAchievements,
    loading,
    error,
    isUnlocked,
    refetch: fetchAchievements
  };
};

// ============ WORKOUT PLANS HOOKS ============

/**
 * Hook to manage workout plans
 */
export const useWorkoutPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workoutPlansAPI.getUserPlans();
      setPlans(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPlan = useCallback(async (planData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await workoutPlansAPI.create(planData);
      if (result.success) {
        await fetchPlans(); // Refresh list
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchPlans]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return {
    plans,
    loading,
    error,
    createPlan,
    refetch: fetchPlans
  };
};

// ============ STATISTICS HOOKS ============

/**
 * Hook to get user statistics
 */
export const useStatistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await statisticsAPI.getUserStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

// ============ DATA MANAGEMENT HOOKS ============

/**
 * Hook for data management operations
 */
export const useDataManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteAllData = useCallback(async () => {
    // Confirmation dialog for destructive operation
    if (!window.confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
      return { success: false, cancelled: true };
    }

    try {
      setLoading(true);
      setError(null);
      const result = await dataManagementAPI.deleteAllUserData();
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearTestData = useCallback(async (adminSecret) => {
    try {
      setLoading(true);
      setError(null);
      const result = await dataManagementAPI.clearTestData(adminSecret);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    deleteAllData,
    clearTestData
  };
};
