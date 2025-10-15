export const idlFactory = ({ IDL }) => {
  const Result_4 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const UserPreferences = IDL.Record({
    'preferredWorkoutTime' : IDL.Opt(IDL.Text),
    'injuryHistory' : IDL.Vec(IDL.Text),
    'dietaryRestrictions' : IDL.Vec(IDL.Text),
    'equipmentAvailable' : IDL.Vec(IDL.Text),
    'workoutReminders' : IDL.Bool,
  });
  const UserId = IDL.Principal;
  const Time = IDL.Int;
  const UserProfile = IDL.Record({
    'id' : UserId,
    'age' : IDL.Nat,
    'weight' : IDL.Float64,
    'height' : IDL.Float64,
    'activityLevel' : IDL.Text,
    'username' : IDL.Text,
    'fitnessGoal' : IDL.Text,
    'createdAt' : Time,
    'email' : IDL.Text,
    'preferences' : UserPreferences,
    'updatedAt' : Time,
    'gender' : IDL.Text,
  });
  const Result = IDL.Variant({ 'ok' : UserProfile, 'err' : IDL.Text });
  const PlannedExercise = IDL.Record({
    'duration' : IDL.Opt(IDL.Nat),
    'targetMuscles' : IDL.Vec(IDL.Text),
    'reps' : IDL.Nat,
    'sets' : IDL.Nat,
    'instructions' : IDL.Text,
    'exerciseName' : IDL.Text,
    'restTime' : IDL.Nat,
  });
  const WorkoutPlan = IDL.Record({
    'id' : IDL.Text,
    'duration' : IDL.Nat,
    'equipment' : IDL.Vec(IDL.Text),
    'userId' : IDL.Opt(UserId),
    'difficulty' : IDL.Text,
    'name' : IDL.Text,
    'createdAt' : Time,
    'isSystem' : IDL.Bool,
    'exercises' : IDL.Vec(PlannedExercise),
    'tags' : IDL.Vec(IDL.Text),
    'description' : IDL.Text,
  });
  const Result_5 = IDL.Variant({ 'ok' : WorkoutPlan, 'err' : IDL.Text });
  const AchievementRequirement = IDL.Record({
    'metric' : IDL.Text,
    'type' : IDL.Text,
    'target' : IDL.Nat,
  });
  const Achievement = IDL.Record({
    'id' : IDL.Text,
    'icon' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'requirement' : AchievementRequirement,
    'category' : IDL.Text,
    'points' : IDL.Nat,
  });
  const Message = IDL.Record({
    'content' : IDL.Text,
    'role' : IDL.Text,
    'timestamp' : Time,
  });
  const UserContextData = IDL.Record({
    'currentGoal' : IDL.Text,
    'recentWorkouts' : IDL.Nat,
    'injuryStatus' : IDL.Opt(IDL.Text),
    'currentWeight' : IDL.Float64,
  });
  const ConversationJSON = IDL.Record({
    'messages' : IDL.Vec(Message),
    'summary' : IDL.Opt(IDL.Text),
    'userContext' : UserContextData,
  });
  const ChatHistory = IDL.Record({
    'id' : IDL.Text,
    'context' : IDL.Text,
    'userId' : UserId,
    'createdAt' : Time,
    'conversation' : ConversationJSON,
  });
  const FoodItem = IDL.Record({
    'fat' : IDL.Float64,
    'fiber' : IDL.Float64,
    'carbs' : IDL.Float64,
    'calories' : IDL.Float64,
    'name' : IDL.Text,
    'unit' : IDL.Text,
    'quantity' : IDL.Float64,
    'confidence' : IDL.Float64,
    'protein' : IDL.Float64,
  });
  const FoodJSON = IDL.Record({
    'totalFiber' : IDL.Float64,
    'totalCarbs' : IDL.Float64,
    'totalFat' : IDL.Float64,
    'totalCalories' : IDL.Float64,
    'imageUrl' : IDL.Opt(IDL.Text),
    'totalProtein' : IDL.Float64,
    'items' : IDL.Vec(FoodItem),
  });
  const FoodAnalysis = IDL.Record({
    'id' : IDL.Text,
    'userId' : UserId,
    'createdAt' : Time,
    'mealType' : IDL.Text,
    'foodData' : FoodJSON,
  });
  const UserAchievement = IDL.Record({
    'id' : IDL.Text,
    'achievementId' : IDL.Text,
    'unlockedAt' : Time,
    'userId' : UserId,
    'progress' : IDL.Float64,
  });
  const UserStatistics = IDL.Record({
    'userId' : UserId,
    'totalDuration' : IDL.Nat,
    'totalWorkouts' : IDL.Nat,
    'totalCaloriesBurned' : IDL.Float64,
    'favoriteExercise' : IDL.Opt(IDL.Text),
    'averageWorkoutDuration' : IDL.Float64,
    'lastWorkoutDate' : IDL.Opt(Time),
    'longestStreak' : IDL.Nat,
    'weeklyAverage' : IDL.Float64,
    'currentStreak' : IDL.Nat,
  });
  const FormError = IDL.Record({
    'errorType' : IDL.Text,
    'correction' : IDL.Text,
    'timestamp' : IDL.Nat,
    'severity' : IDL.Text,
  });
  const ExerciseData = IDL.Record({
    'plannedReps' : IDL.Nat,
    'completedReps' : IDL.Nat,
    'name' : IDL.Text,
    'sets' : IDL.Nat,
    'notes' : IDL.Opt(IDL.Text),
    'formErrors' : IDL.Vec(FormError),
    'restTime' : IDL.Nat,
  });
  const WorkoutJSON = IDL.Record({
    'completionRate' : IDL.Float64,
    'exercises' : IDL.Vec(ExerciseData),
    'workoutName' : IDL.Text,
    'overallFormScore' : IDL.Float64,
  });
  const WorkoutRecord = IDL.Record({
    'id' : IDL.Text,
    'duration' : IDL.Nat,
    'userId' : UserId,
    'createdAt' : Time,
    'caloriesBurned' : IDL.Float64,
    'averageHeartRate' : IDL.Opt(IDL.Nat),
    'workoutData' : WorkoutJSON,
  });
  const Result_3 = IDL.Variant({ 'ok' : FoodAnalysis, 'err' : IDL.Text });
  const Result_2 = IDL.Variant({ 'ok' : WorkoutRecord, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : ChatHistory, 'err' : IDL.Text });
  return IDL.Service({
    'clearTestData' : IDL.Func([IDL.Text], [Result_4], []),
    'createUserProfile' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Float64,
          IDL.Float64,
          IDL.Nat,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          UserPreferences,
        ],
        [Result],
        [],
      ),
    'createWorkoutPlan' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Nat,
          IDL.Vec(IDL.Text),
          IDL.Vec(PlannedExercise),
          IDL.Vec(IDL.Text),
        ],
        [Result_5],
        [],
      ),
    'deleteAllUserData' : IDL.Func([], [Result_4], []),
    'getAchievements' : IDL.Func([], [IDL.Vec(Achievement)], ['query']),
    'getChatById' : IDL.Func([IDL.Text], [IDL.Opt(ChatHistory)], ['query']),
    'getFoodAnalysisById' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(FoodAnalysis)],
        ['query'],
      ),
    'getTotalUsers' : IDL.Func([], [IDL.Nat], ['query']),
    'getUserAchievements' : IDL.Func([], [IDL.Vec(UserAchievement)], []),
    'getUserChatHistory' : IDL.Func([IDL.Nat], [IDL.Vec(ChatHistory)], []),
    'getUserFoodAnalyses' : IDL.Func([IDL.Nat], [IDL.Vec(FoodAnalysis)], []),
    'getUserProfile' : IDL.Func([], [IDL.Opt(UserProfile)], []),
    'getUserStatistics' : IDL.Func([], [UserStatistics], []),
    'getUserWorkoutPlans' : IDL.Func([], [IDL.Vec(WorkoutPlan)], []),
    'getUserWorkouts' : IDL.Func([], [IDL.Vec(WorkoutRecord)], []),
    'getWorkoutById' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(WorkoutRecord)],
        ['query'],
      ),
    'getWorkoutPlanById' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(WorkoutPlan)],
        ['query'],
      ),
    'getWorkoutPlans' : IDL.Func([], [IDL.Vec(WorkoutPlan)], ['query']),
    'recordFoodAnalysis' : IDL.Func([FoodJSON, IDL.Text], [Result_3], []),
    'recordWorkout' : IDL.Func(
        [WorkoutJSON, IDL.Nat, IDL.Float64, IDL.Opt(IDL.Nat)],
        [Result_2],
        [],
      ),
    'saveChatHistory' : IDL.Func([ConversationJSON, IDL.Text], [Result_1], []),
    'updateUserProfile' : IDL.Func(
        [
          IDL.Opt(IDL.Float64),
          IDL.Opt(IDL.Float64),
          IDL.Opt(IDL.Nat),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Opt(UserPreferences),
        ],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
