import React, { useEffect, useState } from 'react';
import AchievementsTab from '../user-profile/components/AchievementsTab';

const AchievementsPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
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
      }
    } catch (error) {
      setUser(null);
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Achievements</h1>
      <AchievementsTab user={user} />
    </div>
  );
};

export default AchievementsPage;
