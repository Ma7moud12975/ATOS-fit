import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Option "mo:base/Option";
import Types "./Types";

actor ATOSfitDB {
  // ============ STABLE STORAGE ============
  private stable var userProfileEntries : [(Types.UserId, Types.UserProfile)] = [];
  private stable var workoutRecordEntries : [(Text, Types.WorkoutRecord)] = [];
  private stable var chatHistoryEntries : [(Text, Types.ChatHistory)] = [];
  private stable var foodAnalysisEntries : [(Text, Types.FoodAnalysis)] = [];
  private stable var achievementEntries : [(Text, Types.Achievement)] = [];
  private stable var userAchievementEntries : [(Text, Types.UserAchievement)] = [];
  private stable var workoutPlanEntries : [(Text, Types.WorkoutPlan)] = [];
  private stable var exerciseAchievementEntries : [(Text, Types.ExerciseAchievement)] = [];
  private stable var userExerciseProgressEntries : [(Text, Types.UserExerciseProgress)] = [];
  
  // ID counters for simple ID generation
  private stable var nextWorkoutId : Nat = 1;
  private stable var nextChatId : Nat = 1;
  private stable var nextFoodId : Nat = 1;
  private stable var nextUserAchievementId : Nat = 1;
  private stable var nextPlanId : Nat = 1;
  private stable var _nextExerciseAchievementId : Nat = 1;
  private stable var _nextUserExerciseProgressId : Nat = 1;

  // ============ HASHMAPS ============
  private var userProfiles = HashMap.HashMap<Types.UserId, Types.UserProfile>(10, Principal.equal, Principal.hash);
  private var workoutRecords = HashMap.HashMap<Text, Types.WorkoutRecord>(10, Text.equal, Text.hash);
  private var chatHistories = HashMap.HashMap<Text, Types.ChatHistory>(10, Text.equal, Text.hash);
  private var foodAnalyses = HashMap.HashMap<Text, Types.FoodAnalysis>(10, Text.equal, Text.hash);
  private var achievements = HashMap.HashMap<Text, Types.Achievement>(10, Text.equal, Text.hash);
  private var userAchievements = HashMap.HashMap<Text, Types.UserAchievement>(10, Text.equal, Text.hash);
  private var workoutPlans = HashMap.HashMap<Text, Types.WorkoutPlan>(10, Text.equal, Text.hash);
  private var exerciseAchievements = HashMap.HashMap<Text, Types.ExerciseAchievement>(10, Text.equal, Text.hash);
  private var userExerciseProgress = HashMap.HashMap<Text, Types.UserExerciseProgress>(10, Text.equal, Text.hash);

  // ============ HELPER FUNCTIONS ============
  private func generateId(prefix: Text, counter: Nat) : Text {
    prefix # "_" # Nat.toText(counter)
  };

  // ============ UPGRADE FUNCTIONS ============
  system func preupgrade() {
    userProfileEntries := Iter.toArray(userProfiles.entries());
    workoutRecordEntries := Iter.toArray(workoutRecords.entries());
    chatHistoryEntries := Iter.toArray(chatHistories.entries());
    foodAnalysisEntries := Iter.toArray(foodAnalyses.entries());
    achievementEntries := Iter.toArray(achievements.entries());
    userAchievementEntries := Iter.toArray(userAchievements.entries());
    workoutPlanEntries := Iter.toArray(workoutPlans.entries());
    exerciseAchievementEntries := Iter.toArray(exerciseAchievements.entries());
    userExerciseProgressEntries := Iter.toArray(userExerciseProgress.entries());
  };

  system func postupgrade() {
    userProfiles := HashMap.fromIter<Types.UserId, Types.UserProfile>(userProfileEntries.vals(), 10, Principal.equal, Principal.hash);
    workoutRecords := HashMap.fromIter<Text, Types.WorkoutRecord>(workoutRecordEntries.vals(), 10, Text.equal, Text.hash);
    chatHistories := HashMap.fromIter<Text, Types.ChatHistory>(chatHistoryEntries.vals(), 10, Text.equal, Text.hash);
    foodAnalyses := HashMap.fromIter<Text, Types.FoodAnalysis>(foodAnalysisEntries.vals(), 10, Text.equal, Text.hash);
    achievements := HashMap.fromIter<Text, Types.Achievement>(achievementEntries.vals(), 10, Text.equal, Text.hash);
    userAchievements := HashMap.fromIter<Text, Types.UserAchievement>(userAchievementEntries.vals(), 10, Text.equal, Text.hash);
    workoutPlans := HashMap.fromIter<Text, Types.WorkoutPlan>(workoutPlanEntries.vals(), 10, Text.equal, Text.hash);
    exerciseAchievements := HashMap.fromIter<Text, Types.ExerciseAchievement>(exerciseAchievementEntries.vals(), 10, Text.equal, Text.hash);
    userExerciseProgress := HashMap.fromIter<Text, Types.UserExerciseProgress>(userExerciseProgressEntries.vals(), 10, Text.equal, Text.hash);
    
    // Initialize default achievements and plans if empty
    if (achievements.size() == 0) {
      initializeDefaultAchievements();
    };
    if (workoutPlans.size() == 0) {
      initializeDefaultWorkoutPlans();
    };
    if (exerciseAchievements.size() == 0) {
      initializeExerciseAchievements();
    };
  };

  // ============ USER PROFILE OPERATIONS ============
  public shared(msg) func createUserProfile(
    fullName: Text,
    email: ?Text,
    age: Nat,
    height: Float,
    weight: Float,
    gender: Text,
    activityLevel: Text,
    primaryGoals: [Text],
    preferredWorkoutTime: Text,
    workoutReminders: Bool
  ) : async Result.Result<Types.UserProfile, Text> {
    let userId = msg.caller;
    
    switch(userProfiles.get(userId)) {
      case (?_existing) {
        #err("User profile already exists")
      };
      case null {
        let profile : Types.UserProfile = {
          id = userId;
          fullName = fullName;
          email = email;
          age = age;
          height = height;
          weight = weight;
          gender = gender;
          activityLevel = activityLevel;
          primaryGoals = primaryGoals;
          preferredWorkoutTime = preferredWorkoutTime;
          workoutReminders = workoutReminders;
          createdAt = Time.now();
          updatedAt = Time.now();
        };
        userProfiles.put(userId, profile);
        #ok(profile)
      };
    };
  };

  public shared(msg) func getUserProfile() : async ?Types.UserProfile {
    userProfiles.get(msg.caller)
  };

  public shared(msg) func updateUserProfile(
    fullName: ?Text,
    email: ??Text,
    age: ?Nat,
    height: ?Float,
    weight: ?Float,
    gender: ?Text,
    activityLevel: ?Text,
    primaryGoals: ?[Text],
    preferredWorkoutTime: ?Text,
    workoutReminders: ?Bool
  ) : async Result.Result<Types.UserProfile, Text> {
    switch(userProfiles.get(msg.caller)) {
      case null { #err("User profile not found") };
      case (?profile) {
        let updated : Types.UserProfile = {
          id = profile.id;
          fullName = Option.get(fullName, profile.fullName);
          email = Option.get(email, profile.email);
          age = Option.get(age, profile.age);
          height = Option.get(height, profile.height);
          weight = Option.get(weight, profile.weight);
          gender = Option.get(gender, profile.gender);
          activityLevel = Option.get(activityLevel, profile.activityLevel);
          primaryGoals = Option.get(primaryGoals, profile.primaryGoals);
          preferredWorkoutTime = Option.get(preferredWorkoutTime, profile.preferredWorkoutTime);
          workoutReminders = Option.get(workoutReminders, profile.workoutReminders);
          createdAt = profile.createdAt;
          updatedAt = Time.now();
        };
        userProfiles.put(msg.caller, updated);
        #ok(updated)
      };
    };
  };

  // ============ WORKOUT RECORD OPERATIONS ============
  public shared(msg) func recordWorkout(
    workoutData: Types.WorkoutJSON,
    duration: Nat,
    caloriesBurned: Float,
    averageHeartRate: ?Nat
  ) : async Result.Result<Types.WorkoutRecord, Text> {
    let id = generateId("workout", nextWorkoutId);
    nextWorkoutId += 1;
    
    let record : Types.WorkoutRecord = {
      id = id;
      userId = msg.caller;
      workoutData = workoutData;
      duration = duration;
      caloriesBurned = caloriesBurned;
      averageHeartRate = averageHeartRate;
      createdAt = Time.now();
    };
    
    workoutRecords.put(id, record);
    
    // Update exercise progress for each exercise
    for (exercise in workoutData.exercises.vals()) {
      await updateExerciseProgress(msg.caller, exercise.name, exercise.completedReps);
    };
    
    // Check for achievement unlocks
    await checkWorkoutAchievements(msg.caller);
    
    #ok(record)
  };

  public shared(msg) func getUserWorkouts() : async [Types.WorkoutRecord] {
    let userWorkouts = Array.filter<Types.WorkoutRecord>(
      Iter.toArray(workoutRecords.vals()),
      func(record) = record.userId == msg.caller
    );
    
    // Sort by date (newest first)
    Array.sort(userWorkouts, func(a: Types.WorkoutRecord, b: Types.WorkoutRecord) : {#less; #equal; #greater} {
      if (a.createdAt > b.createdAt) { #less }
      else if (a.createdAt < b.createdAt) { #greater }
      else { #equal }
    })
  };

  public query func getWorkoutById(id: Text) : async ?Types.WorkoutRecord {
    workoutRecords.get(id)
  };

  // ============ AI CHAT HISTORY OPERATIONS ============
  public shared(msg) func saveChatHistory(
    conversation: Types.ConversationJSON,
    context: Text
  ) : async Result.Result<Types.ChatHistory, Text> {
    let id = generateId("chat", nextChatId);
    nextChatId += 1;
    
    let history : Types.ChatHistory = {
      id = id;
      userId = msg.caller;
      conversation = conversation;
      createdAt = Time.now();
      context = context;
    };
    
    chatHistories.put(id, history);
    #ok(history)
  };

  public shared(msg) func getUserChatHistory(limit: Nat) : async [Types.ChatHistory] {
    let userChats = Array.filter<Types.ChatHistory>(
      Iter.toArray(chatHistories.vals()),
      func(chat) = chat.userId == msg.caller
    );
    
    // Sort by date (newest first) and limit
    let sorted = Array.sort(userChats, func(a: Types.ChatHistory, b: Types.ChatHistory) : {#less; #equal; #greater} {
      if (a.createdAt > b.createdAt) { #less }
      else if (a.createdAt < b.createdAt) { #greater }
      else { #equal }
    });
    
    let endIndex = Nat.min(limit, sorted.size());
    Array.tabulate(endIndex, func(i: Nat) : Types.ChatHistory { sorted[i] })
  };

  public query func getChatById(id: Text) : async ?Types.ChatHistory {
    chatHistories.get(id)
  };

  // ============ FOOD ANALYSIS OPERATIONS ============
  public shared(msg) func recordFoodAnalysis(
    foodData: Types.FoodJSON,
    mealType: Text
  ) : async Result.Result<Types.FoodAnalysis, Text> {
    let id = generateId("food", nextFoodId);
    nextFoodId += 1;
    
    let analysis : Types.FoodAnalysis = {
      id = id;
      userId = msg.caller;
      foodData = foodData;
      mealType = mealType;
      createdAt = Time.now();
    };
    
    foodAnalyses.put(id, analysis);
    
    // Check for nutrition achievements
    await checkNutritionAchievements(msg.caller);
    
    #ok(analysis)
  };

  public shared(msg) func getUserFoodAnalyses(daysBack: Nat) : async [Types.FoodAnalysis] {
    let cutoffTime = Time.now() - (daysBack * 24 * 60 * 60 * 1000000000);
    let userAnalyses = Array.filter<Types.FoodAnalysis>(
      Iter.toArray(foodAnalyses.vals()),
      func(analysis) = analysis.userId == msg.caller and analysis.createdAt >= cutoffTime
    );
    
    Array.sort(userAnalyses, func(a: Types.FoodAnalysis, b: Types.FoodAnalysis) : {#less; #equal; #greater} {
      if (a.createdAt > b.createdAt) { #less }
      else if (a.createdAt < b.createdAt) { #greater }
      else { #equal }
    })
  };

  public query func getFoodAnalysisById(id: Text) : async ?Types.FoodAnalysis {
    foodAnalyses.get(id)
  };

  // ============ ACHIEVEMENT OPERATIONS ============
  private func initializeDefaultAchievements() {
    let defaultAchievements = [
      {
        id = "first_workout";
        name = "First Steps";
        description = "Complete your first workout";
        category = "milestone";
        icon = "🎯";
        points = 10;
        requirement = {
          type_ = "count";
          target = 1;
          metric = "workouts";
        };
      },
      {
        id = "week_warrior";
        name = "Week Warrior";
        description = "Complete 7 workouts in a week";
        category = "consistency";
        icon = "💪";
        points = 50;
        requirement = {
          type_ = "count";
          target = 7;
          metric = "workouts_week";
        };
      },
      {
        id = "calorie_crusher";
        name = "Calorie Crusher";
        description = "Burn 1000 calories in a single week";
        category = "workout";
        icon = "🔥";
        points = 30;
        requirement = {
          type_ = "total";
          target = 1000;
          metric = "calories_week";
        };
      },
      {
        id = "nutrition_tracker";
        name = "Nutrition Tracker";
        description = "Log 7 consecutive days of meals";
        category = "nutrition";
        icon = "🥗";
        points = 25;
        requirement = {
          type_ = "streak";
          target = 7;
          metric = "nutrition_days";
        };
      }
    ];
    
    for (achievement in defaultAchievements.vals()) {
      achievements.put(achievement.id, achievement);
    };
  };

  public query func getAchievements() : async [Types.Achievement] {
    Iter.toArray(achievements.vals())
  };

  public shared(msg) func getUserAchievements() : async [Types.UserAchievement] {
    Array.filter<Types.UserAchievement>(
      Iter.toArray(userAchievements.vals()),
      func(ua) = ua.userId == msg.caller
    )
  };

  private func checkWorkoutAchievements(userId: Types.UserId) : async () {
    let workouts = await getUserWorkoutsInternal(userId);
    
    // Check "first_workout" achievement
    if (workouts.size() == 1) {
      await unlockAchievement(userId, "first_workout");
    };
    
    // Check weekly achievements
    let weekAgo = Time.now() - (7 * 24 * 60 * 60 * 1000000000);
    let weekWorkouts = Array.filter<Types.WorkoutRecord>(
      workouts,
      func(w) = w.createdAt >= weekAgo
    );
    
    if (weekWorkouts.size() >= 7) {
      await unlockAchievement(userId, "week_warrior");
    };
    
    // Check calorie achievements
    var weekCalories = 0.0;
    for (workout in weekWorkouts.vals()) {
      weekCalories += workout.caloriesBurned;
    };
    
    if (weekCalories >= 1000.0) {
      await unlockAchievement(userId, "calorie_crusher");
    };
  };

  private func checkNutritionAchievements(userId: Types.UserId) : async () {
    let analyses = await getUserFoodAnalysesInternal(userId, 7);
    
    // Check for consecutive days
    if (analyses.size() >= 7) {
      await unlockAchievement(userId, "nutrition_tracker");
    };
  };

  private func unlockAchievement(userId: Types.UserId, achievementId: Text) : async () {
    let id = generateId("user_achievement", nextUserAchievementId);
    
    // Check if already unlocked
    let existing = Array.find<Types.UserAchievement>(
      Iter.toArray(userAchievements.vals()),
      func(ua) = ua.userId == userId and ua.achievementId == achievementId
    );
    
    switch(existing) {
      case (?_) { /* Already unlocked */ };
      case null {
        nextUserAchievementId += 1;
        let userAchievement : Types.UserAchievement = {
          id = id;
          userId = userId;
          achievementId = achievementId;
          unlockedAt = Time.now();
          progress = 100.0;
        };
        userAchievements.put(id, userAchievement);
      };
    };
  };

  // ============ EXERCISE ACHIEVEMENT OPERATIONS ============
  private func initializeExerciseAchievements() {
    let exerciseAchievementsList = [
      // Push-Up Challenges
      {
        id = "pushup_achievement";
        exerciseName = "Push-ups";
        category = "Push-Up Challenges";
        levels = [
          { level = 1; name = "Level 1"; description = "Complete 50 push-ups in one week"; target = 50; timeframe = "week"; points = 10; icon = "💪" },
          { level = 2; name = "Level 2"; description = "Complete 100 push-ups in one week"; target = 100; timeframe = "week"; points = 20; icon = "💪" },
          { level = 3; name = "Level 3"; description = "Complete 250 push-ups in one week"; target = 250; timeframe = "week"; points = 50; icon = "💪" },
          { level = 4; name = "Level 4"; description = "Complete 500 push-ups in one week"; target = 500; timeframe = "week"; points = 100; icon = "💪" },
          { level = 5; name = "Level 5"; description = "Complete 1000 push-ups in one week"; target = 1000; timeframe = "week"; points = 200; icon = "💪" }
        ];
        createdAt = Time.now();
      },
      {
        id = "wide_pushup_achievement";
        exerciseName = "Wide Push-ups";
        category = "Push-Up Challenges";
        levels = [
          { level = 1; name = "Level 1"; description = "Complete 50 wide push-ups in one week"; target = 50; timeframe = "week"; points = 10; icon = "💪" },
          { level = 2; name = "Level 2"; description = "Complete 100 wide push-ups in one week"; target = 100; timeframe = "week"; points = 20; icon = "💪" },
          { level = 3; name = "Level 3"; description = "Complete 250 wide push-ups in one week"; target = 250; timeframe = "week"; points = 50; icon = "💪" },
          { level = 4; name = "Level 4"; description = "Complete 500 wide push-ups in one week"; target = 500; timeframe = "week"; points = 100; icon = "💪" },
          { level = 5; name = "Level 5"; description = "Complete 1000 wide push-ups in one week"; target = 1000; timeframe = "week"; points = 200; icon = "💪" }
        ];
        createdAt = Time.now();
      },
      // Cardio Challenges
      {
        id = "jumping_jacks_achievement";
        exerciseName = "Jumping Jacks";
        category = "Cardio Challenges";
        levels = [
          { level = 1; name = "Level 1"; description = "Complete 100 jumping jacks in one week"; target = 100; timeframe = "week"; points = 10; icon = "🏃" },
          { level = 2; name = "Level 2"; description = "Complete 250 jumping jacks in one week"; target = 250; timeframe = "week"; points = 20; icon = "🏃" },
          { level = 3; name = "Level 3"; description = "Complete 500 jumping jacks in one week"; target = 500; timeframe = "week"; points = 50; icon = "🏃" },
          { level = 4; name = "Level 4"; description = "Complete 1000 jumping jacks in one week"; target = 1000; timeframe = "week"; points = 100; icon = "🏃" },
          { level = 5; name = "Level 5"; description = "Complete 2000 jumping jacks in one week"; target = 2000; timeframe = "week"; points = 200; icon = "🏃" }
        ];
        createdAt = Time.now();
      },
      // Lower Body Challenges
      {
        id = "squats_achievement";
        exerciseName = "Squats";
        category = "Lower Body Challenges";
        levels = [
          { level = 1; name = "Level 1"; description = "Complete 100 squats in one week"; target = 100; timeframe = "week"; points = 10; icon = "🦵" },
          { level = 2; name = "Level 2"; description = "Complete 250 squats in one week"; target = 250; timeframe = "week"; points = 20; icon = "🦵" },
          { level = 3; name = "Level 3"; description = "Complete 500 squats in one week"; target = 500; timeframe = "week"; points = 50; icon = "🦵" },
          { level = 4; name = "Level 4"; description = "Complete 1000 squats in one week"; target = 1000; timeframe = "week"; points = 100; icon = "🦵" },
          { level = 5; name = "Level 5"; description = "Complete 2000 squats in one week"; target = 2000; timeframe = "week"; points = 200; icon = "🦵" }
        ];
        createdAt = Time.now();
      },
      // Plank & Core Challenges
      {
        id = "plank_achievement";
        exerciseName = "Plank";
        category = "Plank & Core Challenges";
        levels = [
          { level = 1; name = "Level 1"; description = "Hold plank for 300 seconds total in one week"; target = 300; timeframe = "week"; points = 10; icon = "🧘" },
          { level = 2; name = "Level 2"; description = "Hold plank for 600 seconds total in one week"; target = 600; timeframe = "week"; points = 20; icon = "🧘" },
          { level = 3; name = "Level 3"; description = "Hold plank for 1200 seconds total in one week"; target = 1200; timeframe = "week"; points = 50; icon = "🧘" },
          { level = 4; name = "Level 4"; description = "Hold plank for 2400 seconds total in one week"; target = 2400; timeframe = "week"; points = 100; icon = "🧘" },
          { level = 5; name = "Level 5"; description = "Hold plank for 3600 seconds total in one week"; target = 3600; timeframe = "week"; points = 200; icon = "🧘" }
        ];
        createdAt = Time.now();
      }
    ];
    
    for (achievement in exerciseAchievementsList.vals()) {
      exerciseAchievements.put(achievement.id, achievement);
    };
  };

  public query func getExerciseAchievements() : async [Types.ExerciseAchievement] {
    Iter.toArray(exerciseAchievements.vals())
  };

  public shared(msg) func getUserExerciseProgress() : async [Types.UserExerciseProgress] {
    Array.filter<Types.UserExerciseProgress>(
      Iter.toArray(userExerciseProgress.vals()),
      func(progress) = progress.userId == msg.caller
    )
  };

  private func updateExerciseProgress(userId: Types.UserId, exerciseName: Text, reps: Nat) : async () {
    let progressId = Principal.toText(userId) # "_" # exerciseName;
    
    switch(userExerciseProgress.get(progressId)) {
      case (?existing) {
        // Update existing progress
        let oneWeekAgo = Time.now() - (7 * 24 * 60 * 60 * 1000000000);
        let oneMonthAgo = Time.now() - (30 * 24 * 60 * 60 * 1000000000);
        
        // Reset weekly/monthly counts if time has passed
        let weeklyCount = if (existing.lastUpdated >= oneWeekAgo) {
          existing.weeklyCount + reps
        } else { reps };
        
        let monthlyCount = if (existing.lastUpdated >= oneMonthAgo) {
          existing.monthlyCount + reps
        } else { reps };
        
        let updated : Types.UserExerciseProgress = {
          id = existing.id;
          userId = existing.userId;
          exerciseName = existing.exerciseName;
          currentLevel = existing.currentLevel;
          weeklyCount = weeklyCount;
          monthlyCount = monthlyCount;
          allTimeCount = existing.allTimeCount + reps;
          lastUpdated = Time.now();
          unlockedLevels = existing.unlockedLevels;
        };
        
        userExerciseProgress.put(progressId, updated);
        
        // Check for level unlocks
        await checkExerciseAchievements(userId, exerciseName, updated);
      };
      case null {
        // Create new progress
        let newProgress : Types.UserExerciseProgress = {
          id = progressId;
          userId = userId;
          exerciseName = exerciseName;
          currentLevel = 0;
          weeklyCount = reps;
          monthlyCount = reps;
          allTimeCount = reps;
          lastUpdated = Time.now();
          unlockedLevels = [];
        };
        
        userExerciseProgress.put(progressId, newProgress);
        await checkExerciseAchievements(userId, exerciseName, newProgress);
      };
    };
  };

  private func checkExerciseAchievements(userId: Types.UserId, exerciseName: Text, progress: Types.UserExerciseProgress) : async () {
    // Find matching exercise achievement
    let matchingAchievement = Array.find<Types.ExerciseAchievement>(
      Iter.toArray(exerciseAchievements.vals()),
      func(achievement) = achievement.exerciseName == exerciseName
    );
    
    switch(matchingAchievement) {
      case (?achievement) {
        // Check each level
        for (level in achievement.levels.vals()) {
          let alreadyUnlocked = Array.find<Nat>(
            progress.unlockedLevels,
            func(unlockedLevel) = unlockedLevel == level.level
          );
          
          if (Option.isNull(alreadyUnlocked)) {
            let targetMet = switch(level.timeframe) {
              case ("week") { progress.weeklyCount >= level.target };
              case ("month") { progress.monthlyCount >= level.target };
              case ("all_time") { progress.allTimeCount >= level.target };
              case (_) { false };
            };
            
            if (targetMet) {
              // Unlock this level
              let updatedProgress : Types.UserExerciseProgress = {
                id = progress.id;
                userId = progress.userId;
                exerciseName = progress.exerciseName;
                currentLevel = level.level;
                weeklyCount = progress.weeklyCount;
                monthlyCount = progress.monthlyCount;
                allTimeCount = progress.allTimeCount;
                lastUpdated = progress.lastUpdated;
                unlockedLevels = Array.append(progress.unlockedLevels, [level.level]);
              };
              
              userExerciseProgress.put(progress.id, updatedProgress);
              
              // Create user achievement record
              let achievementId = generateId("exercise_achievement", nextUserAchievementId);
              nextUserAchievementId += 1;
              
              let userAchievement : Types.UserAchievement = {
                id = achievementId;
                userId = userId;
                achievementId = achievement.id # "_level_" # Nat.toText(level.level);
                unlockedAt = Time.now();
                progress = 100.0;
              };
              
              userAchievements.put(achievementId, userAchievement);
            };
          };
        };
      };
      case null {};
    };
  };

  // ============ WORKOUT PLAN OPERATIONS ============
  private func initializeDefaultWorkoutPlans() {
    let defaultPlans = [
      {
        id = "beginner_fullbody";
        userId = null;
        name = "Beginner Full Body";
        description = "Perfect for fitness newcomers";
        difficulty = "beginner";
        duration = 30;
        equipment = ["none"];
        exercises = [
          {
            exerciseName = "Jumping Jacks";
            sets = 3;
            reps = 15;
            duration = null;
            restTime = 30;
            instructions = "Keep core engaged";
            targetMuscles = ["cardio", "full_body"];
          },
          {
            exerciseName = "Push-ups";
            sets = 3;
            reps = 10;
            duration = null;
            restTime = 45;
            instructions = "Modify on knees if needed";
            targetMuscles = ["chest", "arms"];
          },
          {
            exerciseName = "Squats";
            sets = 3;
            reps = 12;
            duration = null;
            restTime = 45;
            instructions = "Keep knees behind toes";
            targetMuscles = ["legs", "glutes"];
          }
        ];
        isSystem = true;
        tags = ["beginner", "no_equipment", "full_body"];
        createdAt = Time.now();
      },
      {
        id = "hiit_cardio";
        userId = null;
        name = "HIIT Cardio Blast";
        description = "High-intensity interval training for maximum calorie burn";
        difficulty = "intermediate";
        duration = 20;
        equipment = ["none"];
        exercises = [
          {
            exerciseName = "Burpees";
            sets = 4;
            reps = 10;
            duration = null;
            restTime = 20;
            instructions = "Full range of motion";
            targetMuscles = ["full_body", "cardio"];
          },
          {
            exerciseName = "Mountain Climbers";
            sets = 4;
            reps = 20;
            duration = null;
            restTime = 20;
            instructions = "Keep hips low";
            targetMuscles = ["core", "cardio"];
          }
        ];
        isSystem = true;
        tags = ["hiit", "cardio", "fat_burn"];
        createdAt = Time.now();
      }
    ];
    
    for (plan in defaultPlans.vals()) {
      workoutPlans.put(plan.id, plan);
    };
  };

  public shared(msg) func createWorkoutPlan(
    name: Text,
    description: Text,
    difficulty: Text,
    duration: Nat,
    equipment: [Text],
    exercises: [Types.PlannedExercise],
    tags: [Text]
  ) : async Result.Result<Types.WorkoutPlan, Text> {
    let id = generateId("plan", nextPlanId);
    nextPlanId += 1;
    
    let plan : Types.WorkoutPlan = {
      id = id;
      userId = ?msg.caller;
      name = name;
      description = description;
      difficulty = difficulty;
      duration = duration;
      equipment = equipment;
      exercises = exercises;
      isSystem = false;
      tags = tags;
      createdAt = Time.now();
    };
    
    workoutPlans.put(id, plan);
    #ok(plan)
  };

  public query func getWorkoutPlans() : async [Types.WorkoutPlan] {
    Iter.toArray(workoutPlans.vals())
  };

  public shared(msg) func getUserWorkoutPlans() : async [Types.WorkoutPlan] {
    Array.filter<Types.WorkoutPlan>(
      Iter.toArray(workoutPlans.vals()),
      func(plan) = plan.isSystem or (plan.userId == ?msg.caller)
    )
  };

  public query func getWorkoutPlanById(id: Text) : async ?Types.WorkoutPlan {
    workoutPlans.get(id)
  };

  // ============ STATISTICS OPERATIONS ============
  public shared(msg) func getUserStatistics() : async Types.UserStatistics {
    let workouts = await getUserWorkoutsInternal(msg.caller);
    
    var totalDuration = 0;
    var totalCalories = 0.0;
    var lastWorkoutDate : ?Time.Time = null;
    var exerciseCounts = HashMap.HashMap<Text, Nat>(10, Text.equal, Text.hash);
    
    // Time boundaries
    let now = Time.now();
    let oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000000000);
    let oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000000000);
    let fourWeeksAgo = now - (28 * 24 * 60 * 60 * 1000000000);
    
    var thisWeekWorkouts = 0;
    var thisMonthWorkouts = 0;
    var weeklyCaloriesBurned = 0.0;
    var monthlyCaloriesBurned = 0.0;
    
    // Calculate metrics
    for (workout in workouts.vals()) {
      totalDuration += workout.duration;
      totalCalories += workout.caloriesBurned;
      
      // Weekly/Monthly counts
      if (workout.createdAt >= oneWeekAgo) {
        thisWeekWorkouts += 1;
        weeklyCaloriesBurned += workout.caloriesBurned;
      };
      if (workout.createdAt >= oneMonthAgo) {
        thisMonthWorkouts += 1;
        monthlyCaloriesBurned += workout.caloriesBurned;
      };
      
      // Track exercise frequency
      for (exercise in workout.workoutData.exercises.vals()) {
        let count = Option.get(exerciseCounts.get(exercise.name), 0);
        exerciseCounts.put(exercise.name, count + 1);
      };
      
      // Update last workout date
      switch(lastWorkoutDate) {
        case null { lastWorkoutDate := ?workout.createdAt };
        case (?date) {
          if (workout.createdAt > date) {
            lastWorkoutDate := ?workout.createdAt;
          };
        };
      };
    };
    
    // Find favorite exercise
    var favoriteExercise : ?Text = null;
    var maxCount = 0;
    for ((name, count) in exerciseCounts.entries()) {
      if (count > maxCount) {
        maxCount := count;
        favoriteExercise := ?name;
      };
    };
    
    let avgDuration = if (workouts.size() > 0) {
      Float.fromInt(totalDuration) / Float.fromInt(workouts.size()) / 60.0
    } else { 0.0 };
    
    // Calculate weekly average
    let recentWorkouts = Array.filter<Types.WorkoutRecord>(
      workouts,
      func(w) = w.createdAt >= fourWeeksAgo
    );
    let weeklyAvg = Float.fromInt(recentWorkouts.size()) / 4.0;
    
    // Calculate streak
    let currentStreak = calculateStreak(workouts);
    
    {
      userId = msg.caller;
      totalWorkouts = workouts.size();
      totalDuration = totalDuration;
      totalCaloriesBurned = totalCalories;
      currentStreak = currentStreak;
      longestStreak = currentStreak; // TODO: Track longest streak separately
      favoriteExercise = favoriteExercise;
      averageWorkoutDuration = avgDuration;
      weeklyAverage = weeklyAvg;
      lastWorkoutDate = lastWorkoutDate;
      thisWeekWorkouts = thisWeekWorkouts;
      thisMonthWorkouts = thisMonthWorkouts;
      weeklyCaloriesBurned = weeklyCaloriesBurned;
      monthlyCaloriesBurned = monthlyCaloriesBurned;
      weeklyWorkoutGoal = 5; // Default goal
      weeklyCalorieGoal = 2000.0; // Default goal
    }
  };

  private func calculateStreak(workouts: [Types.WorkoutRecord]) : Nat {
    if (workouts.size() == 0) { return 0 };
    
    // Sort workouts by date (newest first)
    let sorted = Array.sort(workouts, func(a: Types.WorkoutRecord, b: Types.WorkoutRecord) : {#less; #equal; #greater} {
      if (a.createdAt > b.createdAt) { #less }
      else if (a.createdAt < b.createdAt) { #greater }
      else { #equal }
    });
    
    var streak = 0;
    let oneDayNanos = 24 * 60 * 60 * 1000000000;
    let now = Time.now();
    
    // Check if there's a workout today or yesterday
    if (sorted.size() > 0) {
      let lastWorkout = sorted[0].createdAt;
      let daysSinceLastWorkout = (now - lastWorkout) / oneDayNanos;
      
      if (daysSinceLastWorkout <= 1) {
        streak := 1;
        
        // Count consecutive days
        var i = 1;
        while (i < sorted.size()) {
          let daysDiff = (sorted[i-1].createdAt - sorted[i].createdAt) / oneDayNanos;
          if (daysDiff <= 1) {
            streak += 1;
            i += 1;
          } else {
            i := sorted.size(); // Break loop
          };
        };
      };
    };
    
    streak
  };

  // ============ DATA CLEANUP OPERATIONS ============
  public shared(msg) func deleteAllUserData() : async Result.Result<Text, Text> {
    let userId = msg.caller;
    
    // Delete user profile
    userProfiles.delete(userId);
    
    // Delete workout records
    for ((id, record) in workoutRecords.entries()) {
      if (record.userId == userId) {
        workoutRecords.delete(id);
      };
    };
    
    // Delete chat histories
    for ((id, chat) in chatHistories.entries()) {
      if (chat.userId == userId) {
        chatHistories.delete(id);
      };
    };
    
    // Delete food analyses
    for ((id, analysis) in foodAnalyses.entries()) {
      if (analysis.userId == userId) {
        foodAnalyses.delete(id);
      };
    };
    
    // Delete user achievements
    for ((id, achievement) in userAchievements.entries()) {
      if (achievement.userId == userId) {
        userAchievements.delete(id);
      };
    };
    
    // Delete user exercise progress
    for ((id, progress) in userExerciseProgress.entries()) {
      if (progress.userId == userId) {
        userExerciseProgress.delete(id);
      };
    };
    
    // Delete user-created workout plans
    for ((id, plan) in workoutPlans.entries()) {
      switch(plan.userId) {
        case (?uid) {
          if (uid == userId) {
            workoutPlans.delete(id);
          };
        };
        case null {};
      };
    };
    
    #ok("All user data deleted successfully")
  };

  // ============ ADMIN OPERATIONS (for testing) ============
  public shared(msg) func clearTestData(adminSecret: Text) : async Result.Result<Text, Text> {
    // Simple admin check - in production, use proper authentication
    if (adminSecret != "admin_secret_key_2024") {
      return #err("Unauthorized");
    };
    
    // Clear all non-system data
    userProfiles := HashMap.HashMap<Types.UserId, Types.UserProfile>(10, Principal.equal, Principal.hash);
    workoutRecords := HashMap.HashMap<Text, Types.WorkoutRecord>(10, Text.equal, Text.hash);
    chatHistories := HashMap.HashMap<Text, Types.ChatHistory>(10, Text.equal, Text.hash);
    foodAnalyses := HashMap.HashMap<Text, Types.FoodAnalysis>(10, Text.equal, Text.hash);
    userAchievements := HashMap.HashMap<Text, Types.UserAchievement>(10, Text.equal, Text.hash);
    userExerciseProgress := HashMap.HashMap<Text, Types.UserExerciseProgress>(10, Text.equal, Text.hash);
    
    // Keep system workout plans and achievements
    let systemPlans = HashMap.HashMap<Text, Types.WorkoutPlan>(10, Text.equal, Text.hash);
    for ((id, plan) in workoutPlans.entries()) {
      if (plan.isSystem) {
        systemPlans.put(id, plan);
      };
    };
    workoutPlans := systemPlans;
    
    #ok("Test data cleared successfully")
  };

  // ============ INTERNAL HELPER FUNCTIONS ============
  private func getUserWorkoutsInternal(userId: Types.UserId) : async [Types.WorkoutRecord] {
    Array.filter<Types.WorkoutRecord>(
      Iter.toArray(workoutRecords.vals()),
      func(record) = record.userId == userId
    )
  };

  private func getUserFoodAnalysesInternal(userId: Types.UserId, daysBack: Nat) : async [Types.FoodAnalysis] {
    let cutoffTime = Time.now() - (daysBack * 24 * 60 * 60 * 1000000000);
    Array.filter<Types.FoodAnalysis>(
      Iter.toArray(foodAnalyses.vals()),
      func(analysis) = analysis.userId == userId and analysis.createdAt >= cutoffTime
    )
  };

  // ============ UTILITY OPERATIONS ============
  // Get total number of users (for dashboard display)
  public query func getTotalUsers() : async Nat {
    userProfiles.size()
  };

  // ============ HTTP REQUEST HANDLERS ============
  
  public type HttpRequest = {
    method : Text;
    url : Text;
    headers : [(Text, Text)];
    body : Blob;
  };

  public type HttpResponse = {
    status_code : Nat16;
    headers : [(Text, Text)];
    body : Blob;
  };

  // HTTP request handler for direct API access
  public query func http_request(request : HttpRequest) : async HttpResponse {
    let path = extractPath(request.url);
    
    switch (request.method, path) {
      case ("GET", "/api/users/total") {
        let count = userProfiles.size();
        let response = "{\"total_users\": " # Nat.toText(count) # "}";
        {
          status_code = 200;
          headers = [("Content-Type", "application/json"), ("Access-Control-Allow-Origin", "*")];
          body = Text.encodeUtf8(response);
        }
      };
      
      case ("GET", "/api/health") {
        let response = "{\"status\": \"healthy\", \"timestamp\": " # Int.toText(Time.now()) # "}";
        {
          status_code = 200;
          headers = [("Content-Type", "application/json"), ("Access-Control-Allow-Origin", "*")];
          body = Text.encodeUtf8(response);
        }
      };
      
      case ("OPTIONS", _) {
        // Handle CORS preflight
        {
          status_code = 200;
          headers = [
            ("Access-Control-Allow-Origin", "*"),
            ("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"),
            ("Access-Control-Allow-Headers", "Content-Type, Authorization")
          ];
          body = Text.encodeUtf8("");
        }
      };
      
      case (_, _) {
        let response = "{\"error\": \"Not found\"}";
        {
          status_code = 404;
          headers = [("Content-Type", "application/json"), ("Access-Control-Allow-Origin", "*")];
          body = Text.encodeUtf8(response);
        }
      };
    }
  };

  // HTTP update handler for POST/PUT requests
  public func http_request_update(request : HttpRequest) : async HttpResponse {
    let path = extractPath(request.url);
    
    switch (request.method, path) {
      case ("POST", "/api/users/profile") {
        // Handle profile creation via HTTP
        await handleCreateProfileHTTP(request)
      };
      
      case ("GET", "/api/users/profile") {
        // Handle profile retrieval via HTTP
        await handleGetProfileHTTP(request)
      };
      
      case (_, _) {
        let response = "{\"error\": \"Method not allowed\"}";
        {
          status_code = 405;
          headers = [("Content-Type", "application/json"), ("Access-Control-Allow-Origin", "*")];
          body = Text.encodeUtf8(response);
        }
      };
    }
  };

  // Helper function to extract path from URL
  private func extractPath(url : Text) : Text {
    // Simple path extraction - in production, use a proper URL parser
    let parts = Text.split(url, #char '?');
    switch (parts.next()) {
      case (?path) { path };
      case null { "/" };
    }
  };

  // Handle profile creation via HTTP
  private func handleCreateProfileHTTP(request : HttpRequest) : async HttpResponse {
    try {
      // Parse JSON body (simplified - in production use proper JSON parser)
      let bodyText = switch (Text.decodeUtf8(request.body)) {
        case (?text) { text };
        case null { 
          let response = "{\"error\": \"Invalid request body\"}";
          return {
            status_code = 400;
            headers = [("Content-Type", "application/json"), ("Access-Control-Allow-Origin", "*")];
            body = Text.encodeUtf8(response);
          };
        };
      };

      // For demo purposes, create a simple profile
      // In production, properly parse JSON and validate data
      let caller = Principal.fromText("2vxsx-fae"); // Use authenticated principal
      
      let profile : Types.UserProfile = {
        id = caller;
        fullName = "HTTP User";
        email = ?"http@example.com";
        age = 25;
        height = 175.0;
        weight = 70.0;
        gender = "other";
        activityLevel = "moderate";
        primaryGoals = ["fitness"];
        preferredWorkoutTime = "morning";
        workoutReminders = false;
        createdAt = Time.now();
        updatedAt = Time.now();
      };

      userProfiles.put(caller, profile);

      let response = "{\"success\": true, \"message\": \"Profile created via HTTP\"}";
      {
        status_code = 201;
        headers = [("Content-Type", "application/json"), ("Access-Control-Allow-Origin", "*")];
        body = Text.encodeUtf8(response);
      }
    } catch (e) {
      let response = "{\"error\": \"Internal server error\"}";
      {
        status_code = 500;
        headers = [("Content-Type", "application/json"), ("Access-Control-Allow-Origin", "*")];
        body = Text.encodeUtf8(response);
      }
    }
  };

  // Handle profile retrieval via HTTP
  private func handleGetProfileHTTP(request : HttpRequest) : async HttpResponse {
    let caller = Principal.fromText("2vxsx-fae"); // Use authenticated principal
    
    switch (userProfiles.get(caller)) {
      case (?profile) {
        let response = "{\"success\": true, \"profile\": {\"fullName\": \"" # profile.fullName # "\", \"age\": " # Nat.toText(profile.age) # "}}";
        {
          status_code = 200;
          headers = [("Content-Type", "application/json"), ("Access-Control-Allow-Origin", "*")];
          body = Text.encodeUtf8(response);
        }
      };
      case null {
        let response = "{\"error\": \"Profile not found\"}";
        {
          status_code = 404;
          headers = [("Content-Type", "application/json"), ("Access-Control-Allow-Origin", "*")];
          body = Text.encodeUtf8(response);
        }
      };
    }
  };
}
