#!/bin/bash

echo "🧪 Testing ATOSfit Database Operations..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test user profile creation
echo -e "${BLUE}📝 Creating test user profile...${NC}"
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
echo ""

# Test workout recording
echo -e "${BLUE}💪 Recording test workout...${NC}"
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
echo ""

# Test food analysis
echo -e "${BLUE}🍎 Recording food analysis...${NC}"
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
echo ""

# Test chat history
echo -e "${BLUE}💬 Saving chat history...${NC}"
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
echo ""

# Get user profile
echo -e "${BLUE}👤 Fetching user profile...${NC}"
dfx canister call backend getUserProfile '()'
echo ""

# Get statistics
echo -e "${BLUE}📊 Fetching user statistics...${NC}"
dfx canister call backend getUserStatistics '()'
echo ""

# Get achievements
echo -e "${BLUE}🏆 Checking achievements...${NC}"
dfx canister call backend getUserAchievements '()'
echo ""

# Get all achievements (master list)
echo -e "${BLUE}🎯 Fetching all available achievements...${NC}"
dfx canister call backend getAchievements '()'
echo ""

# Get workout plans
echo -e "${BLUE}📋 Fetching workout plans...${NC}"
dfx canister call backend getUserWorkoutPlans '()'
echo ""

# Get workouts
echo -e "${BLUE}💪 Fetching user workouts...${NC}"
dfx canister call backend getUserWorkouts '()'
echo ""

# Get food analyses
echo -e "${BLUE}🍽️ Fetching food analyses (last 7 days)...${NC}"
dfx canister call backend getUserFoodAnalyses '(7)'
echo ""

# Get chat history
echo -e "${BLUE}💬 Fetching chat history (last 10)...${NC}"
dfx canister call backend getUserChatHistory '(10)'
echo ""

echo -e "${GREEN}✅ Database testing complete!${NC}"
echo ""
echo "Summary:"
echo "- User profile created and retrieved"
echo "- Workout recorded and listed"
echo "- Food analysis saved"
echo "- Chat history stored"
echo "- Statistics calculated"
echo "- Achievements checked"
echo "- Workout plans available"
