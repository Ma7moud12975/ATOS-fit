/**
 * Custom hook for exercise achievements and progress tracking
 * This enhances the user experience with gamification features
 */
import { useState, useEffect, useCallback } from 'react';
import { achievementsAPI } from '../services/canisterAPI';

export const useExerciseAchievements = () => {
  const [exerciseAchievements, setExerciseAchievements] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [achievements, progress] = await Promise.all([
        achievementsAPI.getExerciseAchievements(),
        achievementsAPI.getUserExerciseProgress()
      ]);
      
      setExerciseAchievements(achievements);
      setUserProgress(progress);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Helper function to get progress for a specific exercise
  const getExerciseProgress = useCallback((exerciseName) => {
    return userProgress.find(p => p.exerciseName === exerciseName) || {
      exerciseName,
      currentLevel: 0,
      weeklyCount: 0,
      monthlyCount: 0,
      allTimeCount: 0,
      unlockedLevels: []
    };
  }, [userProgress]);

  // Helper function to get achievement for a specific exercise
  const getExerciseAchievement = useCallback((exerciseName) => {
    return exerciseAchievements.find(a => a.exerciseName === exerciseName);
  }, [exerciseAchievements]);

  // Helper function to calculate progress percentage for next level
  const getNextLevelProgress = useCallback((exerciseName) => {
    const progress = getExerciseProgress(exerciseName);
    const achievement = getExerciseAchievement(exerciseName);
    
    if (!achievement) return { percentage: 0, nextLevel: null };
    
    const nextLevel = achievement.levels.find(level => 
      !progress.unlockedLevels.includes(level.level)
    );
    
    if (!nextLevel) return { percentage: 100, nextLevel: null };
    
    const currentCount = nextLevel.timeframe === 'week' ? progress.weeklyCount :
                        nextLevel.timeframe === 'month' ? progress.monthlyCount :
                        progress.allTimeCount;
    
    const percentage = Math.min((currentCount / nextLevel.target) * 100, 100);
    
    return { percentage, nextLevel, currentCount };
  }, [getExerciseProgress, getExerciseAchievement]);

  // Group achievements by category
  const achievementsByCategory = useCallback(() => {
    const grouped = {};
    exerciseAchievements.forEach(achievement => {
      if (!grouped[achievement.category]) {
        grouped[achievement.category] = [];
      }
      grouped[achievement.category].push(achievement);
    });
    return grouped;
  }, [exerciseAchievements]);

  return {
    exerciseAchievements,
    userProgress,
    loading,
    error,
    getExerciseProgress,
    getExerciseAchievement,
    getNextLevelProgress,
    achievementsByCategory,
    refetch: fetchData
  };
};

export default useExerciseAchievements;