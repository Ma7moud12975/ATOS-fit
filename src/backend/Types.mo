import Time "mo:base/Time";
import Principal "mo:base/Principal";

module {
  // User ID type
  public type UserId = Principal;

  // ============ USER PROFILE ============
  public type UserProfile = {
    id: UserId;
    fullName: Text;
    email: ?Text; // Optional
    age: Nat;
    height: Float; // in cm
    weight: Float; // in kg
    gender: Text; // "Male", "Female", "Other"
    activityLevel: Text; // "Sedentary", "Light", "Moderate", "Active", "Very Active"
    primaryGoals: [Text]; // ["Weight Loss", "Muscle Gain", "Build Endurance", "Increase Strength", "General Fitness"]
    preferredWorkoutTime: Text; // "Morning (6am - 12pm)", "Afternoon (12pm - 6pm)", "Evening (6pm - 12am)"
    workoutReminders: Bool;
    createdAt: Time.Time;
    updatedAt: Time.Time;
  };

  // ============ WORKOUT RECORDS ============
  public type WorkoutRecord = {
    id: Text;
    userId: UserId;
    workoutData: WorkoutJSON;
    duration: Nat; // in seconds
    caloriesBurned: Float;
    averageHeartRate: ?Nat;
    createdAt: Time.Time;
  };

  public type WorkoutJSON = {
    workoutName: Text;
    exercises: [ExerciseData];
    overallFormScore: Float; // 0-100
    completionRate: Float; // percentage of planned exercises completed
  };

  public type ExerciseData = {
    name: Text;
    plannedReps: Nat;
    completedReps: Nat;
    sets: Nat;
    formErrors: [FormError];
    restTime: Nat; // in seconds
    notes: ?Text;
  };

  public type FormError = {
    timestamp: Nat; // seconds into exercise
    errorType: Text; // posture, speed, range_of_motion
    severity: Text; // minor, moderate, severe
    correction: Text; // suggested correction
  };

  // ============ AI CHAT HISTORY ============
  public type ChatHistory = {
    id: Text;
    userId: UserId;
    conversation: ConversationJSON;
    createdAt: Time.Time;
    context: Text; // workout, nutrition, general
  };

  public type ConversationJSON = {
    messages: [Message];
    summary: ?Text;
    userContext: UserContextData; // snapshot of user data at conversation time
  };

  public type Message = {
    role: Text; // user, assistant, system
    content: Text;
    timestamp: Time.Time;
  };

  public type UserContextData = {
    currentWeight: Float;
    recentWorkouts: Nat; // count of last 7 days
    currentGoal: Text;
    injuryStatus: ?Text;
  };

  // ============ FOOD ANALYSIS ============
  public type FoodAnalysis = {
    id: Text;
    userId: UserId;
    foodData: FoodJSON;
    mealType: Text; // breakfast, lunch, dinner, snack
    createdAt: Time.Time;
  };

  public type FoodJSON = {
    items: [FoodItem];
    totalCalories: Float;
    totalProtein: Float;
    totalCarbs: Float;
    totalFat: Float;
    totalFiber: Float;
    imageUrl: ?Text;
  };

  public type FoodItem = {
    name: Text;
    quantity: Float;
    unit: Text; // grams, cups, pieces
    calories: Float;
    protein: Float;
    carbs: Float;
    fat: Float;
    fiber: Float;
    confidence: Float; // AI confidence score 0-1
  };

  // ============ ACHIEVEMENTS ============
  public type Achievement = {
    id: Text;
    name: Text;
    description: Text;
    category: Text; // workout, nutrition, consistency, milestone
    icon: Text; // emoji or icon identifier
    points: Nat;
    requirement: AchievementRequirement;
  };

  public type AchievementRequirement = {
    type_: Text; // count, streak, total, specific
    target: Nat;
    metric: Text; // workouts, calories, days, etc
  };

  public type UserAchievement = {
    id: Text;
    userId: UserId;
    achievementId: Text;
    unlockedAt: Time.Time;
    progress: Float; // 0-100 percentage
  };

  // ============ WORKOUT PLANS ============
  public type WorkoutPlan = {
    id: Text;
    userId: ?UserId; // null for pre-saved system plans
    name: Text;
    description: Text;
    difficulty: Text; // beginner, intermediate, advanced
    duration: Nat; // estimated minutes
    equipment: [Text];
    exercises: [PlannedExercise];
    isSystem: Bool; // true for pre-saved, false for user-created
    tags: [Text]; // cardio, strength, flexibility, etc
    createdAt: Time.Time;
  };

  public type PlannedExercise = {
    exerciseName: Text;
    sets: Nat;
    reps: Nat;
    duration: ?Nat; // for time-based exercises
    restTime: Nat;
    instructions: Text;
    targetMuscles: [Text];
  };

  // ============ STATISTICS ============
  public type UserStatistics = {
    userId: UserId;
    totalWorkouts: Nat;
    totalDuration: Nat; // in seconds
    totalCaloriesBurned: Float;
    currentStreak: Nat; // days
    longestStreak: Nat; // days
    favoriteExercise: ?Text;
    averageWorkoutDuration: Float; // in minutes
    weeklyAverage: Float; // workouts per week
    lastWorkoutDate: ?Time.Time;
    // Weekly/Monthly stats
    thisWeekWorkouts: Nat;
    thisMonthWorkouts: Nat;
    weeklyCaloriesBurned: Float;
    monthlyCaloriesBurned: Float;
    // Goals
    weeklyWorkoutGoal: Nat; // default 5
    weeklyCalorieGoal: Float; // default 2000
  };

  // ============ EXERCISE-SPECIFIC ACHIEVEMENTS ============
  public type ExerciseAchievement = {
    id: Text;
    exerciseName: Text; // "Push-ups", "Wide Push-ups", etc.
    category: Text; // "Push-Up Challenges", "Cardio Challenges", etc.
    levels: [AchievementLevel];
    createdAt: Time.Time;
  };

  public type AchievementLevel = {
    level: Nat; // 1, 2, 3, 4, 5
    name: Text; // "Level 1", "Level 2", etc.
    description: Text; // "Complete 50 push-ups in one week"
    target: Nat; // 50, 100, 250, 500, 1000
    timeframe: Text; // "week", "month", "all_time"
    points: Nat;
    icon: Text;
  };

  public type UserExerciseProgress = {
    id: Text;
    userId: UserId;
    exerciseName: Text;
    currentLevel: Nat; // 0 = not started, 1-5 = levels
    weeklyCount: Nat;
    monthlyCount: Nat;
    allTimeCount: Nat;
    lastUpdated: Time.Time;
    unlockedLevels: [Nat]; // [1, 2] means levels 1 and 2 are unlocked
  };

  // ============ LEGACY TYPES (for backward compatibility) ============
  public type ExerciseName = Text;
  
  public type User = {
    id: Text;
    email: Text;
    name: Text;
    createdAt: Int;
    fitnessLevel: Text;
    goals: [Text];
    profilePicture: ?Text;
  };
  
  public type ExerciseItem = {
    name: ExerciseName;
    reps: ?Nat;
    sets: ?Nat;
    durationSec: ?Nat;
    completed: Bool;
  };
  
  public type WorkoutSession = {
    id: Text;
    userId: Text;
    dateISO: Text;
    items: [ExerciseItem];
  };
  
  public type Stats = {
    id: Text;
    userId: Text;
    totalRepsByExercise: [(ExerciseName, Nat)];
    totalDurationSecByExercise: [(ExerciseName, Nat)];
    completedDays: [Text];
    completedWeeks: [Text];
    completedMonths: [Text];
    lastUpdated: Int;
  };

  // Payment Types
  public type SubscriptionPlan = {
    #Basic;
    #Premium;
    #PremiumPlus;
  };

  public type SubscriptionStatus = {
    #Active;
    #Inactive;
    #Cancelled;
    #PastDue;
  };

  public type Subscription = {
    id: Text;
    userId: Text;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    stripeSubscriptionId: ?Text;
    stripeCustomerId: ?Text;
    currentPeriodStart: Int;
    currentPeriodEnd: Int;
    createdAt: Int;
    updatedAt: Int;
  };

  public type CheckoutSession = {
    id: Text;
    userId: Text;
    plan: SubscriptionPlan;
    stripeSessionId: Text;
    status: Text;
    createdAt: Int;
    expiresAt: Int;
  };

  // HTTP Outcall Types
  public type HttpRequestArgs = {
    url : Text;
    max_response_bytes : ?Nat64;
    headers : [HttpHeader];
    body : ?[Nat8];
    method : HttpMethod;
    transform : ?TransformRawResponseFunction;
  };

  public type HttpHeader = {
    name : Text;
    value : Text;
  };

  public type HttpMethod = {
    #get;
    #post;
    #head;
  };

  public type HttpResponsePayload = {
    status : Nat;
    headers : [HttpHeader];
    body : [Nat8];
  };

  public type TransformRawResponseFunction = {
    function : shared query TransformRawResponseArgs -> async HttpResponsePayload;
    context : Blob;
  };

  public type TransformRawResponseArgs = {
    response : HttpResponsePayload;
    context : Blob;
  };
}
