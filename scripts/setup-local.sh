#!/bin/bash

echo "🚀 Setting up ATOS-fit local development environment..."

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ dfx is not installed. Please install dfx first:"
    echo "   sh -ci \"\$(curl -fsSL https://internetcomputer.org/install.sh)\""
    exit 1
fi

# Check if we're in WSL and need to use the specific path
if grep -q Microsoft /proc/version 2>/dev/null; then
    echo "🐧 Detected WSL environment"
    DFX_PATH="~/.local/share/dfx/bin/dfx"
else
    DFX_PATH="dfx"
fi

echo "🧹 Cleaning up previous deployment..."
$DFX_PATH stop 2>/dev/null || true

echo "🔄 Starting local Internet Computer replica..."
$DFX_PATH start --clean --background

# Wait for replica to start
echo "⏳ Waiting for replica to start..."
sleep 5

echo "🆔 Deploying Internet Identity canister..."
$DFX_PATH deploy internet_identity

echo "🗄️ Deploying backend canister..."
$DFX_PATH deploy backend

echo "🎨 Building frontend..."
npm run build

echo "🌐 Deploying frontend canister..."
$DFX_PATH deploy frontend

# Get canister IDs
BACKEND_CANISTER_ID=$($DFX_PATH canister id backend)
FRONTEND_CANISTER_ID=$($DFX_PATH canister id frontend)
II_CANISTER_ID=$($DFX_PATH canister id internet_identity)

echo "📝 Creating .env.local file..."
cat > .env.local <<EOF
VITE_DFX_NETWORK=local
VITE_IC_HOST=http://localhost:8000
VITE_BACKEND_CANISTER_ID=$BACKEND_CANISTER_ID
VITE_FRONTEND_CANISTER_ID=$FRONTEND_CANISTER_ID
VITE_INTERNET_IDENTITY_CANISTER_ID=$II_CANISTER_ID
EOF

echo "🔧 Generating Candid declarations..."
$DFX_PATH generate backend

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Canister Information:"
echo "   Backend:           $BACKEND_CANISTER_ID"
echo "   Frontend:          $FRONTEND_CANISTER_ID"
echo "   Internet Identity: $II_CANISTER_ID"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend:          http://localhost:8000/?canisterId=$FRONTEND_CANISTER_ID"
echo "   Internet Identity: http://localhost:8000/?canisterId=$II_CANISTER_ID"
echo "   Candid UI:         http://localhost:8000/_/candid?canisterId=$BACKEND_CANISTER_ID"
echo ""
echo "🚀 Start development server:"
echo "   npm run dev"
echo ""
echo "🛑 To stop the replica:"
echo "   $DFX_PATH stop"