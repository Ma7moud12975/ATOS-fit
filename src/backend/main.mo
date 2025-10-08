import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
  // Types for our fitness app
  type UserId = Text;
  type ExerciseName = Text;
  
  type User = {
    id: UserId;
    email: Text;
    name: Text;
    createdAt: Int;
    fitnessLevel: Text;
    goals: [Text];
    profilePicture: ?Text;
  };
  
  type ExerciseItem = {
    name: ExerciseName;
    reps: ?Nat;
    sets: ?Nat;
    durationSec: ?Nat;
    completed: Bool;
  };
  
  type WorkoutSession = {
    id: Text;
    userId: UserId;
    dateISO: Text;
    items: [ExerciseItem];
  };
  
  type Stats = {
    id: Text;
    userId: UserId;
    totalRepsByExercise: [(ExerciseName, Nat)];
    totalDurationSecByExercise: [(ExerciseName, Nat)];
    completedDays: [Text];
    completedWeeks: [Text];
    completedMonths: [Text];
    lastUpdated: Int;
  };
  
  type Achievement = {
    id: Text;
    userId: UserId;
    code: Text;
    title: Text;
    level: Nat;
    earnedAt: Int;
    progress: Nat;
    target: Nat;
  };
  
  // Storage
  private stable var nextUserId : Nat = 1;
  private stable var nextSessionId : Nat = 1;
  private stable var nextStatsId : Nat = 1;
  private stable var nextAchievementId : Nat = 1;
  
  private stable var usersEntries : [(UserId, User)] = [];
  private stable var sessionsEntries : [(Text, WorkoutSession)] = [];
  private stable var statsEntries : [(Text, Stats)] = [];
  private stable var achievementsEntries : [(Text, Achievement)] = [];
  
  private let users = HashMap.fromIter<UserId, User>(Iter.fromArray(usersEntries), 10, Text.equal, Text.hash);
  private let sessions = HashMap.fromIter<Text, WorkoutSession>(Iter.fromArray(sessionsEntries), 10, Text.equal, Text.hash);
  private let stats = HashMap.fromIter<Text, Stats>(Iter.fromArray(statsEntries), 10, Text.equal, Text.hash);
  private let achievements = HashMap.fromIter<Text, Achievement>(Iter.fromArray(achievementsEntries), 10, Text.equal, Text.hash);
  
  // User Management
  public shared(msg) func createUser(email: Text, name: Text, fitnessLevel: Text, goals: [Text], profilePicture: ?Text) : async UserId {
    let caller = Principal.toText(msg.caller);
    let userId = Nat.toText(nextUserId);
    nextUserId += 1;
    
    let user : User = {
      id = userId;
      email = email;
      name = name;
      createdAt = Time.now();
      fitnessLevel = fitnessLevel;
      goals = goals;
      profilePicture = profilePicture;
    };
    
    users.put(userId, user);
    return userId;
  };
  
  public query func getUser(userId: UserId) : async ?User {
    users.get(userId)
  };
  
  public shared(msg) func updateUser(userId: UserId, name: ?Text, fitnessLevel: ?Text, goals: ?[Text], profilePicture: ?Text) : async Bool {
    let userOpt = users.get(userId);
    
    switch (userOpt) {
      case (null) { return false; };
      case (?user) {
        let updatedUser : User = {
          id = user.id;
          email = user.email;
          name = Option.get(name, user.name);
          createdAt = user.createdAt;
          fitnessLevel = Option.get(fitnessLevel, user.fitnessLevel);
          goals = Option.get(goals, user.goals);
          profilePicture = Option.get(profilePicture, user.profilePicture);
        };
        
        users.put(userId, updatedUser);
        return true;
      };
    };
  };
  
  // Workout Sessions
  public shared(msg) func recordWorkoutSession(userId: UserId, dateISO: Text, items: [ExerciseItem]) : async Text {
    let sessionId = Nat.toText(nextSessionId);
    nextSessionId += 1;
    
    let session : WorkoutSession = {
      id = sessionId;
      userId = userId;
      dateISO = dateISO;
      items = items;
    };
    
    sessions.put(sessionId, session);
    
    // Update stats
    await updateStats(userId, items);
    
    return sessionId;
  };
  
  public query func getWorkoutSessions(userId: UserId) : async [WorkoutSession] {
    let userSessions = Iter.toArray(
      Iter.filter<(Text, WorkoutSession)>(
        sessions.entries(),
        func((_, session)) { session.userId == userId }
      )
    );
    
    Array.map<(Text, WorkoutSession), WorkoutSession>(
      userSessions,
      func((_, session)) { session }
    )
  };
  
  // Stats Management
  private func updateStats(userId: UserId, items: [ExerciseItem]) : async () {
    var userStats : Stats = switch (getUserStats(userId)) {
      case (null) {
        {
          id = Nat.toText(nextStatsId);
          userId = userId;
          totalRepsByExercise = [];
          totalDurationSecByExercise = [];
          completedDays = [];
          completedWeeks = [];
          completedMonths = [];
          lastUpdated = Time.now();
        }
      };
      case (?existingStats) { existingStats };
    };
    
    // Update exercise stats
    for (item in items.vals()) {
      if (item.completed) {
        // Update reps
        switch (item.reps) {
          case (null) {};
          case (?reps) {
            userStats := updateExerciseReps(userStats, item.name, reps);
          };
        };
        
        // Update duration
        switch (item.durationSec) {
          case (null) {};
          case (?duration) {
            userStats := updateExerciseDuration(userStats, item.name, duration);
          };
        };
      };
    };
    
    // Save updated stats
    stats.put(userStats.id, userStats);
  };
  
  private func updateExerciseReps(userStats: Stats, exerciseName: ExerciseName, reps: Nat) : Stats {
    let existingIndex = Array.findIndex<(ExerciseName, Nat)>(
      userStats.totalRepsByExercise, 
      func((name, _)) { name == exerciseName }
    );
    
    let updatedReps = switch (existingIndex) {
      case (null) {
        Array.append(userStats.totalRepsByExercise, [(exerciseName, reps)]);
      };
      case (?index) {
        let (_, currentReps) = userStats.totalRepsByExercise[index];
        Array.tabulate<(ExerciseName, Nat)>(
          userStats.totalRepsByExercise.size(),
          func (i) {
            if (i == index) { (exerciseName, currentReps + reps) }
            else { userStats.totalRepsByExercise[i] }
          }
        );
      };
    };
    
    {
      id = userStats.id;
      userId = userStats.userId;
      totalRepsByExercise = updatedReps;
      totalDurationSecByExercise = userStats.totalDurationSecByExercise;
      completedDays = userStats.completedDays;
      completedWeeks = userStats.completedWeeks;
      completedMonths = userStats.completedMonths;
      lastUpdated = Time.now();
    }
  };
  
  private func updateExerciseDuration(userStats: Stats, exerciseName: ExerciseName, duration: Nat) : Stats {
    let existingIndex = Array.findIndex<(ExerciseName, Nat)>(
      userStats.totalDurationSecByExercise, 
      func((name, _)) { name == exerciseName }
    );
    
    let updatedDuration = switch (existingIndex) {
      case (null) {
        Array.append(userStats.totalDurationSecByExercise, [(exerciseName, duration)]);
      };
      case (?index) {
        let (_, currentDuration) = userStats.totalDurationSecByExercise[index];
        Array.tabulate<(ExerciseName, Nat)>(
          userStats.totalDurationSecByExercise.size(),
          func (i) {
            if (i == index) { (exerciseName, currentDuration + duration) }
            else { userStats.totalDurationSecByExercise[i] }
          }
        );
      };
    };
    
    {
      id = userStats.id;
      userId = userStats.userId;
      totalRepsByExercise = userStats.totalRepsByExercise;
      totalDurationSecByExercise = updatedDuration;
      completedDays = userStats.completedDays;
      completedWeeks = userStats.completedWeeks;
      completedMonths = userStats.completedMonths;
      lastUpdated = Time.now();
    }
  };
  
  public query func getUserStats(userId: UserId) : async ?Stats {
    let userStats = Iter.toArray(
      Iter.filter<(Text, Stats)>(
        stats.entries(),
        func((_, s)) { s.userId == userId }
      )
    );
    
    if (userStats.size() > 0) {
      ?userStats[0].1
    } else {
      null
    }
  };
  
  // Achievements
  public shared(msg) func recordAchievement(userId: UserId, code: Text, title: Text, level: Nat, progress: Nat, target: Nat) : async Text {
    let achievementId = Nat.toText(nextAchievementId);
    nextAchievementId += 1;
    
    let achievement : Achievement = {
      id = achievementId;
      userId = userId;
      code = code;
      title = title;
      level = level;
      earnedAt = Time.now();
      progress = progress;
      target = target;
    };
    
    achievements.put(achievementId, achievement);
    return achievementId;
  };
  
  public query func getUserAchievements(userId: UserId) : async [Achievement] {
    let userAchievements = Iter.toArray(
      Iter.filter<(Text, Achievement)>(
        achievements.entries(),
        func((_, a)) { a.userId == userId }
      )
    );
    
    Array.map<(Text, Achievement), Achievement>(
      userAchievements,
      func((_, achievement)) { achievement }
    )
  };
  
  // System upgrade hooks
  system func preupgrade() {
    usersEntries := Iter.toArray(users.entries());
    sessionsEntries := Iter.toArray(sessions.entries());
    statsEntries := Iter.toArray(stats.entries());
    achievementsEntries := Iter.toArray(achievements.entries());
  };
  
  system func postupgrade() {
    usersEntries := [];
    sessionsEntries := [];
    statsEntries := [];
    achievementsEntries := [];
  };
}