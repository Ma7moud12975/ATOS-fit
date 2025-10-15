#!/bin/bash

echo "🌐 Deploying ATOSfit to IC Mainnet..."
echo ""
echo "⚠️  WARNING: This will deploy to production!"
echo "Make sure you have:"
echo "  - Sufficient ICP cycles"
echo "  - Tested thoroughly on local network"
echo "  - Backed up your data"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Deployment cancelled."
    exit 0
fi

# Check dfx identity
echo "Current identity:"
dfx identity whoami
echo ""
read -p "Is this the correct identity? (yes/no): " identity_confirm

if [ "$identity_confirm" != "yes" ]; then
    echo "Please switch to the correct identity using: dfx identity use <name>"
    exit 0
fi

# Create canisters on mainnet
echo "Creating backend canister on mainnet..."
dfx canister --network ic create backend

echo "Creating frontend canister on mainnet..."
dfx canister --network ic create frontend

# Build backend
echo "Building backend..."
dfx build --network ic backend

# Deploy backend
echo "Deploying backend to mainnet..."
dfx canister --network ic install backend

# Build frontend
echo "Building frontend..."
npm run build

# Deploy frontend
echo "Deploying frontend to mainnet..."
dfx canister --network ic install frontend

echo ""
echo "✅ Deployment to mainnet complete!"
echo ""
echo "Backend Canister ID:"
dfx canister --network ic id backend
echo ""
echo "Frontend Canister ID:"
dfx canister --network ic id frontend
echo ""
echo "Your app is live at:"
echo "https://$(dfx canister --network ic id frontend).ic0.app"
echo ""
echo "⚠️  IMPORTANT: Update your environment variables:"
echo "REACT_APP_BACKEND_CANISTER_ID=$(dfx canister --network ic id backend)"
echo "REACT_APP_IC_HOST=https://ic0.app"
