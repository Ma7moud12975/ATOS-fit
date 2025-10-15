# PowerShell version of test-database script for Windows

Write-Host "🧪 Testing ATOSfit Database Operations..." -ForegroundColor Cyan
Write-Host ""

# Test user profile creation
Write-Host "📝 Creating test user profile..." -ForegroundColor Blue
dfx canister call backend createUserProfile '(
  "testuser",
  "test@atosfit.com",
  75.5,
  180.0,
  25,
  "male",
  "moderate",
  "build_muscle",
  record {
    workoutReminders = true;
    preferredWorkoutTime = opt "morning";
    dietaryRestrictions = vec {"vegetarian"};
    injuryHistory = vec {};
    equipmentAvailable = vec {"dumbbells"; "resistance_bands"}
  }
)'
Write-Host ""

# Test workout recording
Write-Host "💪 Recording test workout..." -ForegroundColor Blue
dfx canister call backend recordWorkout '(
  record {
    workoutName = "Morning Strength";
    exercises = vec {
      record {
        name = "Push-ups";
        plannedReps = 15;
        completedReps = 15;
        sets = 3;
        formErrors = vec {};
        restTime = 30;
        notes = opt "Good form"
      };
      record {
        name = "Squats";
        plannedReps = 20;
        completedReps = 18;
        sets = 3;
        formErrors = vec {"knee_valgus"};
        restTime = 45;
        notes = opt "Watch knee alignment"
      }
    };
    overallFormScore = 92.5;
    completionRate = 100.0
  },
  1800,
  250.5,
  opt 145
)'
Write-Host ""

# Test food analysis
Write-Host "🍎 Recording food analysis..." -ForegroundColor Blue
dfx canister call backend recordFoodAnalysis '(
  record {
    items = vec {
      record {
        name = "Apple";
        quantity = 1.0;
        unit = "medium";
        calories = 95.0;
        protein = 0.5;
        carbs = 25.0;
        fat = 0.3;
        fiber = 4.4;
        confidence = 0.95
      };
      record {
        name = "Banana";
        quantity = 1.0;
        unit = "medium";
        calories = 105.0;
        protein = 1.3;
        carbs = 27.0;
        fat = 0.4;
        fiber = 3.1;
        confidence = 0.98
      }
    };
    totalCalories = 200.0;
    totalProtein = 1.8;
    totalCarbs = 52.0;
    totalFat = 0.7;
    totalFiber = 7.5;
    imageUrl = null
  },
  "snack"
)'
Write-Host ""

# Test chat history
Write-Host "💬 Saving chat history..." -ForegroundColor Blue
dfx canister call backend saveChatHistory '(
  record {
    messages = vec {
      record {
        role = "user";
        content = "What exercises should I do for chest?";
        timestamp = 1234567890
      };
      record {
        role = "assistant";
        content = "For chest development, I recommend push-ups, bench press, and chest flys.";
        timestamp = 1234567891
      }
    }
  },
  "workout_advice"
)'
Write-Host ""

# Get user profile
Write-Host "👤 Fetching user profile..." -ForegroundColor Blue
dfx canister call backend getUserProfile '()'
Write-Host ""

# Get statistics
Write-Host "📊 Fetching user statistics..." -ForegroundColor Blue
dfx canister call backend getUserStatistics '()'
Write-Host ""

# Get achievements
Write-Host "🏆 Checking achievements..." -ForegroundColor Blue
dfx canister call backend getUserAchievements '()'
Write-Host ""

# Get all achievements
Write-Host "🎯 Fetching all available achievements..." -ForegroundColor Blue
dfx canister call backend getAchievements '()'
Write-Host ""

# Get workout plans
Write-Host "📋 Fetching workout plans..." -ForegroundColor Blue
dfx canister call backend getUserWorkoutPlans '()'
Write-Host ""

# Get workouts
Write-Host "💪 Fetching user workouts..." -ForegroundColor Blue
dfx canister call backend getUserWorkouts '()'
Write-Host ""

# Get food analyses
Write-Host "🍽️ Fetching food analyses (last 7 days)..." -ForegroundColor Blue
dfx canister call backend getUserFoodAnalyses '(7)'
Write-Host ""

# Get chat history
Write-Host "💬 Fetching chat history (last 10)..." -ForegroundColor Blue
dfx canister call backend getUserChatHistory '(10)'
Write-Host ""

Write-Host "✅ Database testing complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:"
Write-Host "- User profile created and retrieved"
Write-Host "- Workout recorded and listed"
Write-Host "- Food analysis saved"
Write-Host "- Chat history stored"
Write-Host "- Statistics calculated"
Write-Host "- Achievements checked"
Write-Host "- Workout plans available"
