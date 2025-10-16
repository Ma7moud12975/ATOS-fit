/**
 * Exercise Progress Card Component
 * Shows user's progress towards exercise achievements with visual indicators
 */
import React from 'react';
import { useExerciseAchievements } from '../hooks/useExerciseAchievements';
import Icon from './AppIcon';

const ExerciseProgressCard = ({ exerciseName, className = '' }) => {
  const { 
    getExerciseProgress, 
    getExerciseAchievement, 
    getNextLevelProgress,
    loading 
  } = useExerciseAchievements();

  if (loading) {
    return (
      <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-2 bg-muted rounded w-full mb-2"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const progress = getExerciseProgress(exerciseName);
  const achievement = getExerciseAchievement(exerciseName);
  const nextLevel = getNextLevelProgress(exerciseName);

  if (!achievement) {
    return (
      <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
        <p className="text-sm text-muted-foreground">No achievements available for {exerciseName}</p>
      </div>
    );
  }

  const getIconForCategory = (category) => {
    switch (category) {
      case 'Push-Up Challenges': return '💪';
      case 'Cardio Challenges': return '🏃';
      case 'Lower Body Challenges': return '🦵';
      case 'Plank & Core Challenges': return '🧘';
      default: return '🏆';
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getIconForCategory(achievement.category)}</span>
          <h3 className="font-semibold text-foreground">{exerciseName}</h3>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-xs text-muted-foreground">Level</span>
          <span className="text-sm font-bold text-primary">{progress.currentLevel}</span>
        </div>
      </div>

      {/* Progress Bar */}
      {nextLevel.nextLevel && (
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-muted-foreground">
              Next: {nextLevel.nextLevel.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {nextLevel.currentCount}/{nextLevel.nextLevel.target}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${nextLevel.percentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {nextLevel.nextLevel.description}
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-muted/50 rounded p-2">
          <div className="text-sm font-semibold text-foreground">{progress.weeklyCount}</div>
          <div className="text-xs text-muted-foreground">This Week</div>
        </div>
        <div className="bg-muted/50 rounded p-2">
          <div className="text-sm font-semibold text-foreground">{progress.monthlyCount}</div>
          <div className="text-xs text-muted-foreground">This Month</div>
        </div>
        <div className="bg-muted/50 rounded p-2">
          <div className="text-sm font-semibold text-foreground">{progress.allTimeCount}</div>
          <div className="text-xs text-muted-foreground">All Time</div>
        </div>
      </div>

      {/* Unlocked Levels */}
      {progress.unlockedLevels.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center space-x-1 mb-2">
            <Icon name="Trophy" size={14} className="text-yellow-500" />
            <span className="text-xs font-medium text-foreground">Unlocked Levels</span>
          </div>
          <div className="flex space-x-1">
            {progress.unlockedLevels.map(level => {
              const levelData = achievement.levels.find(l => l.level === level);
              return (
                <div 
                  key={level}
                  className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded text-xs font-medium"
                  title={levelData?.description}
                >
                  L{level}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completion Status */}
      {nextLevel.percentage === 100 && !nextLevel.nextLevel && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
            <Icon name="CheckCircle" size={16} />
            <span className="text-sm font-medium">All levels completed!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseProgressCard;