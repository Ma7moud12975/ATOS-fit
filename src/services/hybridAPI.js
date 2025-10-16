/**
 * Hybrid API service for ATOS-fit
 * Uses Candid interface but formats data like REST API
 * Provides HTTP-like interface while maintaining IC security
 */

import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { idlFactory } from '../declarations/backend/backend.did.js';

// Get canister configuration
const BACKEND_CANISTER_ID = import.meta.env.VITE_BACKEND_CANISTER_ID || 'uzt4z-lp777-77774-qaabq-cai';
const IC_HOST = import.meta.env.VITE_IC_HOST || 'http://localhost:8000';

// Determine host based on environment
const getHost = () => {
  if (import.meta.env.VITE_DFX_NETWORK === 'ic' || import.meta.env.MODE === 'production') {
    return 'https://ic0.app';
  }
  return IC_HOST;
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
    throw error;
  }
};

// HTTP-style response formatter
const formatResponse = (data, status = 200, message = 'Success') => {
  return {
    status,
    message,
    data,
    timestamp: new Date().toISOString(),
    canisterId: BACKEND_CANISTER_ID
  };
};

// Error response formatter
const formatError = (error, status = 500) => {
  return {
    status,
    error: error.message || error,
    timestamp: new Date().toISOString(),
    canisterId: BACKEND_CANISTER_ID
  };
};

// ============ HYBRID API FUNCTIONS ============

export const hybridAPI = {
  /**
   * GET /api/health - Health check
   */
  health: async () => {
    try {
      const actor = await getBackendActor();
      const totalUsers = await actor.getTotalUsers();
      
      return formatResponse({
        status: 'healthy',
        totalUsers: Number(totalUsers),
        uptime: Date.now(),
        version: '1.0.0'
      }, 200, 'Service is healthy');
    } catch (error) {
      return formatError(error, 503);
    }
  },

  /**
   * GET /api/users/total - Get total users
   */
  getTotalUsers: async () => {
    try {
      const actor = await getBackendActor();
      const total = await actor.getTotalUsers();
      
      return formatResponse({
        total_users: Number(total)
      }, 200, 'Total users retrieved successfully');
    } catch (error) {
      return formatError(error);
    }
  },

  /**
   * POST /api/users/profile - Create user profile
   */
  createUserProfile: async (profileData) => {
    try {
      const actor = await getBackendActor();
      
      // Validate required fields
      const requiredFields = ['fullName', 'email', 'age', 'height', 'weight', 'gender', 'activityLevel'];
      for (const field of requiredFields) {
        if (!profileData[field]) {
          return formatError(`Missing required field: ${field}`, 400);
        }
      }

      const result = await actor.createUserProfile(
        profileData.fullName?.trim() || '',
        profileData.email ? [profileData.email.trim()] : [],
        profileData.age,
        profileData.height,
        profileData.weight,
        profileData.gender?.trim() || '',
        profileData.activityLevel?.trim() || '',
        profileData.primaryGoals || ['fitness'],
        profileData.preferredWorkoutTime?.trim() || 'morning',
        profileData.workoutReminders || false
      );

      if ('ok' in result) {
        return formatResponse({
          profile: result.ok,
          created: true
        }, 201, 'Profile created successfully');
      } else {
        return formatError(result.err, 400);
      }
    } catch (error) {
      return formatError(error);
    }
  },

  /**
   * GET /api/users/profile - Get user profile
   */
  getUserProfile: async () => {
    try {
      const actor = await getBackendActor();
      const profile = await actor.getUserProfile();
      
      if (profile.length > 0 && profile[0]) {
        return formatResponse({
          profile: profile[0],
          found: true
        }, 200, 'Profile retrieved successfully');
      } else {
        return formatError('Profile not found', 404);
      }
    } catch (error) {
      return formatError(error);
    }
  },

  /**
   * GET /api/users/stats - Get user statistics
   */
  getUserStats: async () => {
    try {
      const actor = await getBackendActor();
      const stats = await actor.getUserStatistics();
      
      return formatResponse({
        statistics: stats
      }, 200, 'Statistics retrieved successfully');
    } catch (error) {
      return formatError(error);
    }
  },

  /**
   * GET /api/workouts - Get user workouts
   */
  getUserWorkouts: async () => {
    try {
      const actor = await getBackendActor();
      const workouts = await actor.getUserWorkouts();
      
      return formatResponse({
        workouts,
        count: workouts.length
      }, 200, 'Workouts retrieved successfully');
    } catch (error) {
      return formatError(error);
    }
  },

  /**
   * POST /api/workouts - Record a workout
   */
  recordWorkout: async (workoutData) => {
    try {
      const actor = await getBackendActor();
      
      const formattedData = {
        workoutName: workoutData.workoutName || 'Unnamed Workout',
        exercises: workoutData.exercises || [],
        overallFormScore: workoutData.overallFormScore || 85.0,
        completionRate: workoutData.completionRate || 100.0
      };

      const result = await actor.recordWorkout(
        formattedData,
        workoutData.duration || 0,
        workoutData.caloriesBurned || 0,
        workoutData.averageHeartRate ? [workoutData.averageHeartRate] : []
      );

      if ('ok' in result) {
        return formatResponse({
          workout: result.ok,
          recorded: true
        }, 201, 'Workout recorded successfully');
      } else {
        return formatError(result.err, 400);
      }
    } catch (error) {
      return formatError(error);
    }
  },

  /**
   * GET /api/achievements - Get all achievements
   */
  getAchievements: async () => {
    try {
      const actor = await getBackendActor();
      const achievements = await actor.getAchievements();
      
      return formatResponse({
        achievements,
        count: achievements.length
      }, 200, 'Achievements retrieved successfully');
    } catch (error) {
      return formatError(error);
    }
  },

  /**
   * GET /api/users/achievements - Get user achievements
   */
  getUserAchievements: async () => {
    try {
      const actor = await getBackendActor();
      const userAchievements = await actor.getUserAchievements();
      
      return formatResponse({
        achievements: userAchievements,
        count: userAchievements.length
      }, 200, 'User achievements retrieved successfully');
    } catch (error) {
      return formatError(error);
    }
  },

  /**
   * Performance test - Compare with direct Candid calls
   */
  performanceTest: async () => {
    try {
      const startTime = performance.now();
      
      // Test multiple calls
      const actor = await getBackendActor();
      
      const [totalUsers, profile, stats] = await Promise.all([
        actor.getTotalUsers(),
        actor.getUserProfile(),
        actor.getUserStatistics()
      ]);

      const endTime = performance.now();
      const duration = endTime - startTime;

      return formatResponse({
        performance: {
          duration_ms: duration.toFixed(2),
          calls_made: 3,
          avg_per_call_ms: (duration / 3).toFixed(2)
        },
        results: {
          totalUsers: Number(totalUsers),
          hasProfile: profile.length > 0,
          statsAvailable: !!stats
        }
      }, 200, 'Performance test completed');
    } catch (error) {
      return formatError(error);
    }
  }
};

// ============ UTILITY FUNCTIONS ============

/**
 * Check if hybrid API is available
 */
export const isHybridAPIAvailable = async () => {
  try {
    const result = await hybridAPI.health();
    return result.status === 200;
  } catch (error) {
    return false;
  }
};

/**
 * Get API info
 */
export const getAPIInfo = () => {
  return {
    type: 'hybrid',
    description: 'HTTP-style API using Candid interface',
    canisterId: BACKEND_CANISTER_ID,
    host: getHost(),
    security: 'IC certified responses'
  };
};

export default hybridAPI;