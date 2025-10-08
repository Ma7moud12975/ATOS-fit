import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const AdvancedAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    weeklyWorkouts: 0,
    monthlyWorkouts: 0,
    averageWorkoutDuration: 0,
    caloriesThisWeek: 0,
    caloriesThisMonth: 0,
    streakDays: 0,
    bestStreak: 0,
    favoriteExercise: 'Push-ups',
    weeklyGoalProgress: 0,
    monthlyGoalProgress: 0
  });

  useEffect(() => {
    // Load analytics from localStorage and calculate stats
    const loadAnalytics = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user?.id) {
          const { db } = await import('../../../utils/db');
          const sessions = await db.sessions.where({ userId: user.id }).toArray();
          
          // Calculate weekly stats
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          const weeklySessions = sessions.filter(s => new Date(s.date) >= oneWeekAgo);
          
          // Calculate monthly stats
          const oneMonthAgo = new Date();
          oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
          const monthlySessions = sessions.filter(s => new Date(s.date) >= oneMonthAgo);
          
          // Calculate average duration
          const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
          const avgDuration = sessions.length > 0 ? Math.round(totalDuration / sessions.length) : 0;
          
          // Calculate calories
          const weeklyCalories = weeklySessions.reduce((sum, s) => sum + (s.caloriesBurned || 0), 0);
          const monthlyCalories = monthlySessions.reduce((sum, s) => sum + (s.caloriesBurned || 0), 0);
          
          // Calculate streaks
          const sortedSessions = sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
          let currentStreak = 0;
          let bestStreak = 0;
          let tempStreak = 0;
          
          const today = new Date().toDateString();
          let lastDate = null;
          
          for (const session of sortedSessions) {
            const sessionDate = new Date(session.date).toDateString();
            if (sessionDate !== lastDate) {
              if (tempStreak > bestStreak) bestStreak = tempStreak;
              tempStreak = 1;
              lastDate = sessionDate;
            } else {
              tempStreak++;
            }
          }
          
          if (tempStreak > bestStreak) bestStreak = tempStreak;
          
          // Calculate current streak
          const todayStr = new Date().toDateString();
          let streakCount = 0;
          let checkDate = new Date();
          
          for (let i = 0; i < 30; i++) {
            const dateStr = checkDate.toDateString();
            const hasWorkout = sessions.some(s => new Date(s.date).toDateString() === dateStr);
            if (hasWorkout) {
              streakCount++;
              checkDate.setDate(checkDate.getDate() - 1);
            } else {
              break;
            }
          }
          
          // Find favorite exercise
          const exerciseCounts = {};
          sessions.forEach(s => {
            if (s.exercises) {
              s.exercises.forEach(ex => {
                exerciseCounts[ex.name] = (exerciseCounts[ex.name] || 0) + 1;
              });
            }
          });
          const favoriteExercise = Object.keys(exerciseCounts).reduce((a, b) => 
            exerciseCounts[a] > exerciseCounts[b] ? a : b, 'Push-ups'
          );
          
          setAnalytics({
            weeklyWorkouts: weeklySessions.length,
            monthlyWorkouts: monthlySessions.length,
            averageWorkoutDuration: avgDuration,
            caloriesThisWeek: Math.round(weeklyCalories),
            caloriesThisMonth: Math.round(monthlyCalories),
            streakDays: streakCount,
            bestStreak,
            favoriteExercise,
            weeklyGoalProgress: Math.min(100, (weeklySessions.length / 5) * 100), // Assuming 5 workouts per week goal
            monthlyGoalProgress: Math.min(100, (monthlySessions.length / 20) * 100) // Assuming 20 workouts per month goal
          });
        }
      } catch (error) {
        console.error('Error loading analytics:', error);
      }
    };

    loadAnalytics();
  }, []);

  const StatCard = ({ title, value, subtitle, icon, color = 'text-primary' }) => (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <Icon name={icon} size={18} className={color} />
        <span className="text-xs text-muted-foreground">{title}</span>
      </div>
      <div className="text-2xl font-bold text-card-foreground mb-1">{value}</div>
      {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
    </div>
  );

  const ProgressBar = ({ label, percentage, color = 'bg-primary' }) => (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-card-foreground font-medium">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className={`${color} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
          <Icon name="TrendingUp" size={20} className="mr-2 text-primary" />
          Performance Overview
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="This Week"
            value={analytics.weeklyWorkouts}
            subtitle="workouts"
            icon="Calendar"
            color="text-blue-500"
          />
          <StatCard
            title="This Month"
            value={analytics.monthlyWorkouts}
            subtitle="workouts"
            icon="Calendar"
            color="text-green-500"
          />
          <StatCard
            title="Avg Duration"
            value={`${Math.floor(analytics.averageWorkoutDuration / 60)}m ${analytics.averageWorkoutDuration % 60}s`}
            subtitle="per workout"
            icon="Clock"
            color="text-orange-500"
          />
          <StatCard
            title="Current Streak"
            value={analytics.streakDays}
            subtitle="days"
            icon="Flame"
            color="text-red-500"
          />
        </div>
      </div>

      {/* Calories & Goals */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
          <Icon name="Zap" size={20} className="mr-2 text-yellow-500" />
          Calories & Goals
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-card-foreground">Weekly Calories</span>
              <span className="text-lg font-bold text-yellow-500">{analytics.caloriesThisWeek}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-card-foreground">Monthly Calories</span>
              <span className="text-lg font-bold text-yellow-500">{analytics.caloriesThisMonth}</span>
            </div>
          </div>
          <div>
            <ProgressBar 
              label="Weekly Goal Progress" 
              percentage={analytics.weeklyGoalProgress} 
              color="bg-blue-500"
            />
            <ProgressBar 
              label="Monthly Goal Progress" 
              percentage={analytics.monthlyGoalProgress} 
              color="bg-green-500"
            />
          </div>
        </div>
      </div>

      {/* Achievements & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
            <Icon name="Trophy" size={20} className="mr-2 text-yellow-500" />
            Achievements
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Best Streak</span>
              <span className="font-semibold text-card-foreground">{analytics.bestStreak} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Favorite Exercise</span>
              <span className="font-semibold text-card-foreground">{analytics.favoriteExercise}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Streak</span>
              <span className="font-semibold text-card-foreground">{analytics.streakDays} days</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
            <Icon name="Target" size={20} className="mr-2 text-primary" />
            Quick Insights
          </h3>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              {analytics.weeklyWorkouts >= 5 ? 
                "🎉 You're crushing your weekly goal!" : 
                `You need ${5 - analytics.weeklyWorkouts} more workouts this week to reach your goal.`
              }
            </div>
            <div className="text-sm text-muted-foreground">
              {analytics.streakDays >= 7 ? 
                "🔥 Amazing consistency! Keep the streak going!" : 
                "💪 Build your streak by working out daily."
              }
            </div>
            <div className="text-sm text-muted-foreground">
              Your favorite exercise is {analytics.favoriteExercise}. Try mixing it up for better results!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
