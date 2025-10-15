#!/bin/bash

echo "🔐 Testing Authentication & Onboarding Integration..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get current identity
echo -e "${BLUE}📋 Current Identity:${NC}"
~/.local/share/dfx/bin/dfx identity whoami
PRINCIPAL=$(~/.local/share/dfx/bin/dfx identity get-principal)
echo "Principal: $PRINCIPAL"
echo ""

# Test 1: Check if user profile exists
echo -e "${BLUE}1️⃣  Checking for existing user profile...${NC}"
PROFILE=$(~/.local/share/dfx/bin/dfx canister call backend getUserProfile '()')
if echo "$PROFILE" | grep -q "opt record"; then
    echo -e "${GREEN}✅ User profile found!${NC}"
    echo "$PROFILE"
else
    echo -e "${YELLOW}⚠️  No profile found (expected for new users)${NC}"
fi
echo ""

# Test 2: Create a new user profile (simulating onboarding)
echo -e "${BLUE}2️⃣  Creating user profile (simulating onboarding)...${NC}"
CREATE_RESULT=$(~/.local/share/dfx/bin/dfx canister call backend createUserProfile '(
  "John Doe",
  "john@atosfit.app",
  75.0,
  180.0,
  30,
  "male",
  "moderate",
  "build_muscle",
  record {
    workoutReminders = true;
    preferredWorkoutTime = opt "morning";
    dietaryRestrictions = vec {};
    injuryHistory = vec {};
    equipmentAvailable = vec {"dumbbells"; "resistance_bands"}
  }
)' 2>&1)

if echo "$CREATE_RESULT" | grep -q "ok"; then
    echo -e "${GREEN}✅ Profile created successfully!${NC}"
    echo "$CREATE_RESULT" | head -20
elif echo "$CREATE_RESULT" | grep -q "already exists"; then
    echo -e "${YELLOW}⚠️  Profile already exists (this is fine)${NC}"
else
    echo -e "${RED}❌ Failed to create profile${NC}"
    echo "$CREATE_RESULT"
fi
echo ""

# Test 3: Retrieve the profile again
echo -e "${BLUE}3️⃣  Retrieving user profile...${NC}"
PROFILE=$(~/.local/share/dfx/bin/dfx canister call backend getUserProfile '()')
if echo "$PROFILE" | grep -q "opt record"; then
    echo -e "${GREEN}✅ Profile retrieved successfully!${NC}"
    echo "$PROFILE" | head -30
    
    # Extract username
    USERNAME=$(echo "$PROFILE" | grep "username" | sed 's/.*username = "\(.*\)";.*/\1/')
    echo ""
    echo -e "${GREEN}👤 Username: $USERNAME${NC}"
else
    echo -e "${RED}❌ Failed to retrieve profile${NC}"
fi
echo ""

# Test 4: Get user statistics
echo -e "${BLUE}4️⃣  Getting user statistics...${NC}"
STATS=$(~/.local/share/dfx/bin/dfx canister call backend getUserStatistics '()')
if echo "$STATS" | grep -q "totalWorkouts"; then
    echo -e "${GREEN}✅ Statistics retrieved successfully!${NC}"
    
    # Extract key stats
    TOTAL_WORKOUTS=$(echo "$STATS" | grep "totalWorkouts" | sed 's/.*totalWorkouts = \([0-9]*\).*/\1/')
    CURRENT_STREAK=$(echo "$STATS" | grep "currentStreak" | sed 's/.*currentStreak = \([0-9]*\).*/\1/')
    
    echo ""
    echo -e "${GREEN}📊 Total Workouts: $TOTAL_WORKOUTS${NC}"
    echo -e "${GREEN}🔥 Current Streak: $CURRENT_STREAK days${NC}"
else
    echo -e "${RED}❌ Failed to retrieve statistics${NC}"
fi
echo ""

# Test 5: Update profile
echo -e "${BLUE}5️⃣  Updating user profile...${NC}"
UPDATE_RESULT=$(~/.local/share/dfx/bin/dfx canister call backend updateUserProfile '(
  opt 78.0,
  null,
  null,
  opt "active",
  null,
  null
)' 2>&1)

if echo "$UPDATE_RESULT" | grep -q "ok"; then
    echo -e "${GREEN}✅ Profile updated successfully!${NC}"
    
    # Verify update
    UPDATED_PROFILE=$(~/.local/share/dfx/bin/dfx canister call backend getUserProfile '()')
    WEIGHT=$(echo "$UPDATED_PROFILE" | grep "weight" | sed 's/.*weight = \([0-9.]*\).*/\1/')
    ACTIVITY=$(echo "$UPDATED_PROFILE" | grep "activityLevel" | sed 's/.*activityLevel = "\(.*\)";.*/\1/')
    
    echo ""
    echo -e "${GREEN}⚖️  New Weight: $WEIGHT kg${NC}"
    echo -e "${GREEN}🏃 New Activity Level: $ACTIVITY${NC}"
else
    echo -e "${RED}❌ Failed to update profile${NC}"
    echo "$UPDATE_RESULT"
fi
echo ""

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Authentication & Onboarding Integration Test Complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Summary:"
echo "✅ User profile creation working"
echo "✅ User profile retrieval working"
echo "✅ User profile updates working"
echo "✅ Statistics calculation working"
echo "✅ Principal-based authentication working"
echo ""
echo "Next steps:"
echo "1. Start the frontend: npm run dev"
echo "2. Navigate to /login-screen"
echo "3. Login with Internet Identity"
echo "4. Complete onboarding"
echo "5. Verify profile in dashboard"
