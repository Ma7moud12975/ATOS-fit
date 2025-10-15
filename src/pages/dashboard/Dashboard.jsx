import React from 'react';
import { useUserProfile, useWorkoutTracking, useUserStatistics, useAchievements, useFoodTracking } from '../../hooks/useICPDatabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Trophy, Flame, Clock, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { profile, loading: profileLoading, error: profileError } = useUserProfile();
  const { workouts, loading: workoutsLoading, error: workoutsError } = useWorkoutTracking();
  const { stats, loading: statsLoading, error: statsError } = useUserStatistics();
  const { userAchievements, loading: achievementsLoading } = useAchievements();
  const { analyses: foodAnalyses } = useFoodTracking();

  if (profileLoading || workoutsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (profileError || workoutsError || statsError) {
    return (
      <div className="p-6">
        <ErrorMessage error={profileError || workoutsError || statsError} />
      </div>
    );
  }

  // Calculate today's calories from food logs
  const todaysFoodLogs = foodAnalyses?.filter(log => {
    const logDate = new Date(log.createdAt);
    const today = new Date();
    return logDate.toDateString() === today.toDateString();
  }) || [];

  const todaysCalories = todaysFoodLogs.reduce((total, log) => 
    total + (log.foodData?.totalCalories || 0), 0
  );

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {profile?.username || 'Athlete'}!
        </h1>
        <p className="text-muted-foreground mt-2">
          {profile?.fitnessGoal 
            ? `Working towards: ${profile.fitnessGoal}` 
            : 'Ready to crush your goals today?'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalWorkouts || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.weeklyAverage?.toFixed(1) || 0} per week avg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalCaloriesBurned?.toFixed(0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Total all time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.averageWorkoutDuration?.toFixed(0) || 0} min
            </div>
            <p className="text-xs text-muted-foreground">Per workout</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.currentStreak || 0} days</div>
            <p className="text-xs text-muted-foreground">Keep it going!</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Workouts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          {!workouts || workouts.length === 0 ? (
            <p className="text-muted-foreground">
              No workouts yet. Start your fitness journey!
            </p>
          ) : (
            <div className="space-y-4">
              {workouts.slice(0, 5).map((workout) => (
                <div 
                  key={workout.id} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold">
                      {workout.workoutData?.workoutName || 'Workout'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(workout.createdAt).toLocaleDateString()} • {' '}
                      {Math.round(workout.duration / 60)} min • {' '}
                      {workout.caloriesBurned} cal
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Form Score</p>
                    <p className="text-2xl font-bold">
                      {workout.workoutData?.overallFormScore?.toFixed(0) || 0}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Nutrition */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Nutrition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Calories Consumed</p>
              <p className="text-2xl font-bold">{todaysCalories.toFixed(0)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Meals Logged</p>
              <p className="text-2xl font-bold">{todaysFoodLogs.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      {userAchievements && userAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto">
              {userAchievements.slice(0, 5).map((achievement) => (
                <div 
                  key={achievement.id} 
                  className="flex flex-col items-center min-w-[100px]"
                >
                  <div className="text-3xl mb-2">{achievement.icon || '🏆'}</div>
                  <p className="text-sm font-medium text-center">
                    {achievement.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
