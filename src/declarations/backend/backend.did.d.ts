import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Achievement {
  'id' : string,
  'icon' : string,
  'name' : string,
  'description' : string,
  'requirement' : AchievementRequirement,
  'category' : string,
  'points' : bigint,
}
export interface AchievementLevel {
  'timeframe' : string,
  'icon' : string,
  'name' : string,
  'description' : string,
  'level' : bigint,
  'target' : bigint,
  'points' : bigint,
}
export interface AchievementRequirement {
  'metric' : string,
  'type' : string,
  'target' : bigint,
}
export interface ChatHistory {
  'id' : string,
  'context' : string,
  'userId' : UserId,
  'createdAt' : Time,
  'conversation' : ConversationJSON,
}
export interface ConversationJSON {
  'messages' : Array<Message>,
  'summary' : [] | [string],
  'userContext' : UserContextData,
}
export interface ExerciseAchievement {
  'id' : string,
  'createdAt' : Time,
  'levels' : Array<AchievementLevel>,
  'exerciseName' : string,
  'category' : string,
}
export interface ExerciseData {
  'plannedReps' : bigint,
  'completedReps' : bigint,
  'name' : string,
  'sets' : bigint,
  'notes' : [] | [string],
  'formErrors' : Array<FormError>,
  'restTime' : bigint,
}
export interface FoodAnalysis {
  'id' : string,
  'userId' : UserId,
  'createdAt' : Time,
  'mealType' : string,
  'foodData' : FoodJSON,
}
export interface FoodItem {
  'fat' : number,
  'fiber' : number,
  'carbs' : number,
  'calories' : number,
  'name' : string,
  'unit' : string,
  'quantity' : number,
  'confidence' : number,
  'protein' : number,
}
export interface FoodJSON {
  'totalFiber' : number,
  'totalCarbs' : number,
  'totalFat' : number,
  'totalCalories' : number,
  'imageUrl' : [] | [string],
  'totalProtein' : number,
  'items' : Array<FoodItem>,
}
export interface FormError {
  'errorType' : string,
  'correction' : string,
  'timestamp' : bigint,
  'severity' : string,
}
export interface Message {
  'content' : string,
  'role' : string,
  'timestamp' : Time,
}
export interface PlannedExercise {
  'duration' : [] | [bigint],
  'targetMuscles' : Array<string>,
  'reps' : bigint,
  'sets' : bigint,
  'instructions' : string,
  'exerciseName' : string,
  'restTime' : bigint,
}
export type Result = { 'ok' : UserProfile } |
  { 'err' : string };
export type Result_1 = { 'ok' : ChatHistory } |
  { 'err' : string };
export type Result_2 = { 'ok' : WorkoutRecord } |
  { 'err' : string };
export type Result_3 = { 'ok' : FoodAnalysis } |
  { 'err' : string };
export type Result_4 = { 'ok' : string } |
  { 'err' : string };
export type Result_5 = { 'ok' : WorkoutPlan } |
  { 'err' : string };
export type Time = bigint;
export interface UserAchievement {
  'id' : string,
  'achievementId' : string,
  'unlockedAt' : Time,
  'userId' : UserId,
  'progress' : number,
}
export interface UserContextData {
  'currentGoal' : string,
  'recentWorkouts' : bigint,
  'injuryStatus' : [] | [string],
  'currentWeight' : number,
}
export interface UserExerciseProgress {
  'id' : string,
  'allTimeCount' : bigint,
  'monthlyCount' : bigint,
  'userId' : UserId,
  'lastUpdated' : Time,
  'exerciseName' : string,
  'weeklyCount' : bigint,
  'currentLevel' : bigint,
  'unlockedLevels' : Array<bigint>,
}
export type UserId = Principal;
export interface UserProfile {
  'id' : UserId,
  'age' : bigint,
  'weight' : number,
  'height' : number,
  'activityLevel' : string,
  'preferredWorkoutTime' : string,
  'createdAt' : Time,
  'fullName' : string,
  'email' : [] | [string],
  'updatedAt' : Time,
  'primaryGoals' : Array<string>,
  'gender' : string,
  'workoutReminders' : boolean,
}
export interface UserStatistics {
  'thisWeekWorkouts' : bigint,
  'monthlyCaloriesBurned' : number,
  'userId' : UserId,
  'totalDuration' : bigint,
  'totalWorkouts' : bigint,
  'weeklyCalorieGoal' : number,
  'totalCaloriesBurned' : number,
  'thisMonthWorkouts' : bigint,
  'weeklyCaloriesBurned' : number,
  'favoriteExercise' : [] | [string],
  'averageWorkoutDuration' : number,
  'lastWorkoutDate' : [] | [Time],
  'longestStreak' : bigint,
  'weeklyAverage' : number,
  'weeklyWorkoutGoal' : bigint,
  'currentStreak' : bigint,
}
export interface WorkoutJSON {
  'completionRate' : number,
  'exercises' : Array<ExerciseData>,
  'workoutName' : string,
  'overallFormScore' : number,
}
export interface WorkoutPlan {
  'id' : string,
  'duration' : bigint,
  'equipment' : Array<string>,
  'userId' : [] | [UserId],
  'difficulty' : string,
  'name' : string,
  'createdAt' : Time,
  'isSystem' : boolean,
  'exercises' : Array<PlannedExercise>,
  'tags' : Array<string>,
  'description' : string,
}
export interface WorkoutRecord {
  'id' : string,
  'duration' : bigint,
  'userId' : UserId,
  'createdAt' : Time,
  'caloriesBurned' : number,
  'averageHeartRate' : [] | [bigint],
  'workoutData' : WorkoutJSON,
}
export interface _SERVICE {
  'clearTestData' : ActorMethod<[string], Result_4>,
  'createUserProfile' : ActorMethod<
    [
      string,
      [] | [string],
      bigint,
      number,
      number,
      string,
      string,
      Array<string>,
      string,
      boolean,
    ],
    Result
  >,
  'createWorkoutPlan' : ActorMethod<
    [
      string,
      string,
      string,
      bigint,
      Array<string>,
      Array<PlannedExercise>,
      Array<string>,
    ],
    Result_5
  >,
  'deleteAllUserData' : ActorMethod<[], Result_4>,
  'getAchievements' : ActorMethod<[], Array<Achievement>>,
  'getChatById' : ActorMethod<[string], [] | [ChatHistory]>,
  'getExerciseAchievements' : ActorMethod<[], Array<ExerciseAchievement>>,
  'getFoodAnalysisById' : ActorMethod<[string], [] | [FoodAnalysis]>,
  'getTotalUsers' : ActorMethod<[], bigint>,
  'getUserAchievements' : ActorMethod<[], Array<UserAchievement>>,
  'getUserChatHistory' : ActorMethod<[bigint], Array<ChatHistory>>,
  'getUserExerciseProgress' : ActorMethod<[], Array<UserExerciseProgress>>,
  'getUserFoodAnalyses' : ActorMethod<[bigint], Array<FoodAnalysis>>,
  'getUserProfile' : ActorMethod<[], [] | [UserProfile]>,
  'getUserStatistics' : ActorMethod<[], UserStatistics>,
  'getUserWorkoutPlans' : ActorMethod<[], Array<WorkoutPlan>>,
  'getUserWorkouts' : ActorMethod<[], Array<WorkoutRecord>>,
  'getWorkoutById' : ActorMethod<[string], [] | [WorkoutRecord]>,
  'getWorkoutPlanById' : ActorMethod<[string], [] | [WorkoutPlan]>,
  'getWorkoutPlans' : ActorMethod<[], Array<WorkoutPlan>>,
  'recordFoodAnalysis' : ActorMethod<[FoodJSON, string], Result_3>,
  'recordWorkout' : ActorMethod<
    [WorkoutJSON, bigint, number, [] | [bigint]],
    Result_2
  >,
  'saveChatHistory' : ActorMethod<[ConversationJSON, string], Result_1>,
  'updateUserProfile' : ActorMethod<
    [
      [] | [string],
      [] | [[] | [string]],
      [] | [bigint],
      [] | [number],
      [] | [number],
      [] | [string],
      [] | [string],
      [] | [Array<string>],
      [] | [string],
      [] | [boolean],
    ],
    Result
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
