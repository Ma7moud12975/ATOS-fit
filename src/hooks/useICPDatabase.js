/**
 * ICP Database Hooks
 * 
 * This file provides React hooks for interacting with the ICP canister database.
 * It's an alias to useCanister.js for backward compatibility and naming preference.
 */

// Re-export all hooks from useCanister
export {
  useUserProfile,
  useWorkouts,
  useChatHistory,
  useFoodAnalyses,
  useAchievements,
  useWorkoutPlans,
  useStatistics,
  useDataManagement
} from './useCanister';

// Alias exports with alternative naming
export { useWorkouts as useWorkoutTracking } from './useCanister';
export { useFoodAnalyses as useFoodTracking } from './useCanister';
export { useStatistics as useUserStatistics } from './useCanister';
