import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { idlFactory } from '../declarations/backend/backend.did.js';

// Get canister ID from environment or use local default
const BACKEND_CANISTER_ID = import.meta.env.VITE_BACKEND_CANISTER_ID || 
                            import.meta.env.CANISTER_ID_BACKEND || 
                            'uzt4z-lp777-77774-qaabq-cai';

// Determine host based on environment
const getHost = () => {
  if (import.meta.env.VITE_DFX_NETWORK === 'ic' || import.meta.env.MODE === 'production') {
    return 'https://ic0.app';
  }
  // Always use the DFX host for local development
  return import.meta.env.VITE_IC_HOST || 'http://localhost:8000';
};

// Create agent with identity
const createAgent = async (identity = null) => {
  const agent = new HttpAgent({
    host: getHost(),
    identity,
  });

  // For local development, fetch root key
  if (import.meta.env.VITE_DFX_NETWORK !== 'ic' && import.meta.env.MODE !== 'production') {
    try {
      await agent.fetchRootKey();
    } catch (err) {
      console.warn('Unable to fetch root key. Check that your local replica is running');
      console.error(err);
    }
  }

  return agent;
};

// Get authenticated identity from AuthClient
const getIdentity = async () => {
  try {
    const authClient = await AuthClient.create();
    const isAuthenticated = await authClient.isAuthenticated();
    
    if (isAuthenticated) {
      return authClient.getIdentity();
    }
    return null;
  } catch (error) {
    console.error('Error getting identity:', error);
    return null;
  }
};

// Get actor (authenticated if logged in, anonymous otherwise)
const getBackendActor = async () => {
  try {
    const identity = await getIdentity();
    const agent = await createAgent(identity);
    
    return Actor.createActor(idlFactory, {
      agent,
      canisterId: BACKEND_CANISTER_ID,
    });
  } catch (error) {
    console.error('Error creating actor:', error);
    // Fallback to anonymous actor
    const agent = await createAgent();
    return Actor.createActor(idlFactory, {
      agent,
      canisterId: BACKEND_CANISTER_ID,
    });
  }
};

// ============ HELPER FUNCTIONS ============

/**
 * Convert JavaScript Date to Motoko Time (nanoseconds)
 */
const dateToNano = (date) => BigInt(date.getTime() * 1000000);

/**
 * Convert Motoko Time to JavaScript Date
 */
const nanoToDate = (nano) => new Date(Number(nano) / 1000000);

/**
 * Handle optional values for Motoko
 */
const toOptional = (value) => {
  if (value === undefined || value === null || value === '') {
    return [];
  }
  // If it's already an array, return it as is (but validate it's not malformed)
  if (Array.isArray(value)) {
    return value.length > 0 ? [value[0]] : [];
  }
  // Clean the value and wrap in array
  const cleanValue = typeof value === 'string' ? value.trim() : value;
  return [cleanValue];
};

/**
 * Handle Result type responses
 */
const handleResult = (result) => {
  if ('ok' in result) {
    return { success: true, data: result.ok };
  } else {
    return { success: false, error: result.err };
  }
};

// ============ USER PROFILE API ============

export const userProfileAPI = {
  /**
   * Create a new user profile
   * @param {Object} profileData - User profile data
   * @returns {Promise<Object>} Result with success/error
   */
  create: async (profileData) => {
    try {
      // Debug logging
      console.log('Creating profile with data:', profileData);
      console.log('Email before toOptional:', profileData.email);
      console.log('Email after toOptional:', toOptional(profileData.email));
      
      const actor = await getBackendActor();
      const result = await actor.createUserProfile(
        profileData.fullName?.trim() || '',
        toOptional(profileData.email),
        profileData.age,
        profileData.height,
        profileData.weight,
        profileData.gender?.trim() || '',
        profileData.activityLevel?.trim() || '',
        profileData.primaryGoals || [],
        profileData.preferredWorkoutTime?.trim() || '',
        profileData.workoutReminders || false
      );
      return handleResult(result);
    } catch (error) {
      console.error('Error creating user profile:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get current user's profile
   * @returns {Promise<Object|null>} User profile or null
   */
  get: async () => {
    try {
      const actor = await getBackendActor();
      const profile = await actor.getUserProfile();
      if (profile.length > 0 && profile[0]) {
        return {
          ...profile[0],
          createdAt: nanoToDate(profile[0].createdAt),
          updatedAt: nanoToDate(profile[0].updatedAt)
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Result with success/error
   */
  update: async (updates) => {
    try {
      const actor = await getBackendActor();
      const result = await actor.updateUserProfile(
        toOptional(updates.fullName),
        updates.email !== undefined ? toOptional(updates.email) : undefined,
        toOptional(updates.age),
        toOptional(updates.height),
        toOptional(updates.weight),
        toOptional(updates.gender),
        toOptional(updates.activityLevel),
        toOptional(updates.primaryGoals),
        toOptional(updates.preferredWorkoutTime),
        toOptional(updates.workoutReminders)
      );
      return handleResult(result);
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: error.message };
    }
  }
};

// ============ WORKOUT API ============

export const workoutAPI = {
  /**
   * Record a completed workout
   * @param {Object} workoutData - Workout data
   * @returns {Promise<Object>} Result with success/error
   */
  record: async (workoutData) => {
    try {
      const formattedData = {
        workoutName: workoutData.workoutName,
        exercises: workoutData.exercises.map(ex => ({
          name: ex.name,
          plannedReps: ex.plannedReps,
          completedReps: ex.completedReps,
          sets: ex.sets,
          formErrors: ex.formErrors || [],
          restTime: ex.restTime || 30,
          notes: toOptional(ex.notes)
        })),
        overallFormScore: workoutData.overallFormScore || 85.0,
        completionRate: workoutData.completionRate || 100.0
      };

      const actor = await getBackendActor();
      const result = await actor.recordWorkout(
        formattedData,
        workoutData.duration,
        workoutData.caloriesBurned,
        toOptional(workoutData.averageHeartRate)
      );
      
      return handleResult(result);
    } catch (error) {
      console.error('Error recording workout:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get all user workouts
   * @returns {Promise<Array>} Array of workouts
   */
  getUserWorkouts: async () => {
    try {
      const actor = await getBackendActor();
      const workouts = await actor.getUserWorkouts();
      return workouts.map(workout => ({
        ...workout,
        createdAt: nanoToDate(workout.createdAt)
      }));
    } catch (error) {
      console.error('Error fetching workouts:', error);
      throw error;
    }
  },

  /**
   * Get workout by ID
   * @param {string} id - Workout ID
   * @returns {Promise<Object|null>} Workout or null
   */
  getById: async (id) => {
    try {
      const actor = await getBackendActor();
      const workout = await actor.getWorkoutById(id);
      if (workout.length > 0 && workout[0]) {
        return {
          ...workout[0],
          createdAt: nanoToDate(workout[0].createdAt)
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching workout:', error);
      throw error;
    }
  }
};

// ============ CHAT HISTORY API ============

export const chatAPI = {
  /**
   * Save chat conversation
   * @param {Array} messages - Array of messages
   * @param {string} context - Context type (workout, nutrition, general)
   * @returns {Promise<Object>} Result with success/error
   */
  save: async (messages, context = 'general') => {
    try {
      // Get current user context for AI
      const profile = await userProfileAPI.get();
      const recentWorkouts = await workoutAPI.getUserWorkouts();
      
      const userContext = {
        currentWeight: profile?.weight || 0,
        recentWorkouts: recentWorkouts.slice(0, 7).length,
        currentGoal: profile?.fitnessGoal || 'general fitness',
        injuryStatus: toOptional(profile?.preferences?.injuryHistory?.[0])
      };

      const conversation = {
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: dateToNano(msg.timestamp || new Date())
        })),
        summary: toOptional(messages.length > 5 ? 'Long conversation' : null),
        userContext: userContext
      };

      const actor = await getBackendActor();
      const result = await actor.saveChatHistory(conversation, context);
      return handleResult(result);
    } catch (error) {
      console.error('Error saving chat history:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get user chat history
   * @param {number} limit - Number of chats to retrieve
   * @returns {Promise<Array>} Array of chat histories
   */
  getHistory: async (limit = 10) => {
    try {
      const actor = await getBackendActor();
      const history = await actor.getUserChatHistory(limit);
      return history.map(chat => ({
        ...chat,
        createdAt: nanoToDate(chat.createdAt),
        conversation: {
          ...chat.conversation,
          messages: chat.conversation.messages.map(msg => ({
            ...msg,
            timestamp: nanoToDate(msg.timestamp)
          }))
        }
      }));
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  },

  /**
   * Get chat by ID
   * @param {string} id - Chat ID
   * @returns {Promise<Object|null>} Chat or null
   */
  getById: async (id) => {
    try {
      const actor = await getBackendActor();
      const chat = await actor.getChatById(id);
      if (chat.length > 0 && chat[0]) {
        return {
          ...chat[0],
          createdAt: nanoToDate(chat[0].createdAt)
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching chat:', error);
      throw error;
    }
  }
};

// ============ FOOD ANALYSIS API ============

export const foodAPI = {
  /**
   * Record food analysis
   * @param {Object} foodData - Food data
   * @param {string} mealType - Meal type (breakfast, lunch, dinner, snack)
   * @returns {Promise<Object>} Result with success/error
   */
  record: async (foodData, mealType) => {
    try {
      const formattedData = {
        items: foodData.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          fiber: item.fiber || 0,
          confidence: item.confidence || 0.9
        })),
        totalCalories: foodData.totalCalories,
        totalProtein: foodData.totalProtein,
        totalCarbs: foodData.totalCarbs,
        totalFat: foodData.totalFat,
        totalFiber: foodData.totalFiber || 0,
        imageUrl: toOptional(foodData.imageUrl)
      };

      const actor = await getBackendActor();
      const result = await actor.recordFoodAnalysis(formattedData, mealType);
      return handleResult(result);
    } catch (error) {
      console.error('Error recording food analysis:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get user food analyses
   * @param {number} daysBack - Number of days to look back
   * @returns {Promise<Array>} Array of food analyses
   */
  getAnalyses: async (daysBack = 7) => {
    try {
      const actor = await getBackendActor();
      const analyses = await actor.getUserFoodAnalyses(daysBack);
      return analyses.map(analysis => ({
        ...analysis,
        createdAt: nanoToDate(analysis.createdAt)
      }));
    } catch (error) {
      console.error('Error fetching food analyses:', error);
      throw error;
    }
  },

  /**
   * Get food analysis by ID
   * @param {string} id - Food analysis ID
   * @returns {Promise<Object|null>} Food analysis or null
   */
  getById: async (id) => {
    try {
      const actor = await getBackendActor();
      const analysis = await actor.getFoodAnalysisById(id);
      if (analysis.length > 0 && analysis[0]) {
        return {
          ...analysis[0],
          createdAt: nanoToDate(analysis[0].createdAt)
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching food analysis:', error);
      throw error;
    }
  }
};

// ============ ACHIEVEMENTS API ============

export const achievementsAPI = {
  /**
   * Get all system achievements
   * @returns {Promise<Array>} Array of achievements
   */
  getAll: async () => {
    try {
      const actor = await getBackendActor();
      const achievements = await actor.getAchievements();
      return achievements;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  },

  /**
   * Get user's unlocked achievements
   * @returns {Promise<Array>} Array of user achievements
   */
  getUserAchievements: async () => {
    try {
      const actor = await getBackendActor();
      const userAchievements = await actor.getUserAchievements();
      return userAchievements.map(ua => ({
        ...ua,
        unlockedAt: nanoToDate(ua.unlockedAt)
      }));
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      throw error;
    }
  },

  /**
   * Get all exercise achievements
   * @returns {Promise<Array>} Array of exercise achievements
   */
  getExerciseAchievements: async () => {
    try {
      const actor = await getBackendActor();
      const exerciseAchievements = await actor.getExerciseAchievements();
      return exerciseAchievements.map(ea => ({
        ...ea,
        createdAt: nanoToDate(ea.createdAt)
      }));
    } catch (error) {
      console.error('Error fetching exercise achievements:', error);
      throw error;
    }
  },

  /**
   * Get user's exercise progress
   * @returns {Promise<Array>} Array of user exercise progress
   */
  getUserExerciseProgress: async () => {
    try {
      const actor = await getBackendActor();
      const progress = await actor.getUserExerciseProgress();
      return progress.map(p => ({
        ...p,
        lastUpdated: nanoToDate(p.lastUpdated)
      }));
    } catch (error) {
      console.error('Error fetching user exercise progress:', error);
      throw error;
    }
  }
};

// ============ WORKOUT PLANS API ============

export const workoutPlansAPI = {
  /**
   * Create a custom workout plan
   * @param {Object} planData - Workout plan data
   * @returns {Promise<Object>} Result with success/error
   */
  create: async (planData) => {
    try {
      const actor = await getBackendActor();
      const result = await actor.createWorkoutPlan(
        planData.name,
        planData.description,
        planData.difficulty,
        planData.duration,
        planData.equipment,
        planData.exercises.map(ex => ({
          exerciseName: ex.exerciseName,
          sets: ex.sets,
          reps: ex.reps,
          duration: toOptional(ex.duration),
          restTime: ex.restTime,
          instructions: ex.instructions,
          targetMuscles: ex.targetMuscles
        })),
        planData.tags
      );
      return handleResult(result);
    } catch (error) {
      console.error('Error creating workout plan:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get all workout plans
   * @returns {Promise<Array>} Array of workout plans
   */
  getAll: async () => {
    try {
      const actor = await getBackendActor();
      const plans = await actor.getWorkoutPlans();
      return plans.map(plan => ({
        ...plan,
        createdAt: nanoToDate(plan.createdAt)
      }));
    } catch (error) {
      console.error('Error fetching workout plans:', error);
      throw error;
    }
  },

  /**
   * Get user's workout plans (system + user-created)
   * @returns {Promise<Array>} Array of workout plans
   */
  getUserPlans: async () => {
    try {
      const actor = await getBackendActor();
      const plans = await actor.getUserWorkoutPlans();
      return plans.map(plan => ({
        ...plan,
        createdAt: nanoToDate(plan.createdAt)
      }));
    } catch (error) {
      console.error('Error fetching user workout plans:', error);
      throw error;
    }
  },

  /**
   * Get workout plan by ID
   * @param {string} id - Plan ID
   * @returns {Promise<Object|null>} Workout plan or null
   */
  getById: async (id) => {
    try {
      const actor = await getBackendActor();
      const plan = await actor.getWorkoutPlanById(id);
      if (plan.length > 0 && plan[0]) {
        return {
          ...plan[0],
          createdAt: nanoToDate(plan[0].createdAt)
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching workout plan:', error);
      throw error;
    }
  }
};

// ============ STATISTICS API ============

export const statisticsAPI = {
  /**
   * Get user statistics
   * @returns {Promise<Object>} User statistics
   */
  getUserStats: async () => {
    try {
      const actor = await getBackendActor();
      const stats = await actor.getUserStatistics();
      return {
        ...stats,
        lastWorkoutDate: stats.lastWorkoutDate.length > 0 
          ? nanoToDate(stats.lastWorkoutDate[0]) 
          : null
      };
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      throw error;
    }
  }
};

// ============ DATA MANAGEMENT API ============

export const dataManagementAPI = {
  /**
   * Delete all user data (GDPR compliance)
   * @returns {Promise<Object>} Result with success/error
   */
  deleteAllUserData: async () => {
    try {
      const actor = await getBackendActor();
      const result = await actor.deleteAllUserData();
      return handleResult(result);
    } catch (error) {
      console.error('Error deleting user data:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Clear test data (admin only)
   * @param {string} adminSecret - Admin secret key
   * @returns {Promise<Object>} Result with success/error
   */
  clearTestData: async (adminSecret) => {
    try {
      const actor = await getBackendActor();
      const result = await actor.clearTestData(adminSecret);
      return handleResult(result);
    } catch (error) {
      console.error('Error clearing test data:', error);
      return { success: false, error: error.message };
    }
  }
};

// ============ HYBRID HTTP-STYLE API ============

/**
 * HTTP-style wrapper for Candid calls
 * Provides REST-like interface while maintaining IC security
 */
export const httpStyleAPI = {
  /**
   * GET /api/health
   */
  health: async () => {
    try {
      const actor = await getBackendActor();
      const totalUsers = await actor.getTotalUsers();
      
      return {
        status: 200,
        data: {
          status: 'healthy',
          totalUsers: Number(totalUsers),
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        status: 500,
        error: error.message
      };
    }
  },

  /**
   * GET /api/users/total
   */
  getTotalUsers: async () => {
    try {
      const actor = await getBackendActor();
      const total = await actor.getTotalUsers();
      
      return {
        status: 200,
        data: { total_users: Number(total) }
      };
    } catch (error) {
      return {
        status: 500,
        error: error.message
      };
    }
  },

  /**
   * POST /api/users/profile
   */
  createProfile: async (profileData) => {
    try {
      const result = await userProfileAPI.create(profileData);
      
      if (result.success) {
        return {
          status: 201,
          data: result.data,
          message: 'Profile created successfully'
        };
      } else {
        return {
          status: 400,
          error: result.error
        };
      }
    } catch (error) {
      return {
        status: 500,
        error: error.message
      };
    }
  },

  /**
   * GET /api/users/profile
   */
  getProfile: async () => {
    try {
      const profile = await userProfileAPI.get();
      
      if (profile) {
        return {
          status: 200,
          data: { profile }
        };
      } else {
        return {
          status: 404,
          error: 'Profile not found'
        };
      }
    } catch (error) {
      return {
        status: 500,
        error: error.message
      };
    }
  }
};

// Export the actor getter for direct access if needed
export { getBackendActor, httpStyleAPI };
export default getBackendActor;
