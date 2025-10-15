#!/bin/bash

echo "🚀 Deploying ATOSfit to Local DFX..."
echo ""

# Check if running in WSL
if grep -qi microsoft /proc/version; then
    echo "📍 Detected WSL environment"
    echo "Starting dfx in Ubuntu-24.04..."
    wsl -d Ubuntu-24.04 << 'EOF'
        cd /mnt/d/Gait\ Scope/ATOS\ NEW/ATOSfit\ DB/ATOS-fit
        
        # Check dfx version
        echo "Checking dfx version..."
        dfx --version
        
        # Start dfx
        echo "Starting dfx..."
        dfx start --clean --background
        
        # Deploy backend
        echo "Deploying backend canister..."
        dfx deploy backend
        
        # Deploy frontend
        echo "Deploying frontend canister..."
        dfx deploy frontend
        
        echo "✅ Deployment complete!"
        echo ""
        echo "Backend Canister ID:"
        dfx canister id backend
        echo ""
        echo "Frontend Canister ID:"
        dfx canister id frontend
        echo ""
        echo "Access your app at:"
        echo "http://localhost:4943?canisterId=$(dfx canister id frontend)"
EOF
else
    # Check dfx version
    echo "Checking dfx version..."
    dfx --version
    
    # Start dfx
    echo "Starting dfx..."
    dfx start --clean --background
    
    # Deploy backend
    echo "Deploying backend canister..."
    dfx deploy backend
    
    # Deploy frontend
    echo "Deploying frontend canister..."
    dfx deploy frontend
    
    echo "✅ Deployment complete!"
    echo ""
    echo "Backend Canister ID:"
    dfx canister id backend
    echo ""
    echo "Frontend Canister ID:"
    dfx canister id frontend
    echo ""
    echo "Access your app at:"
    echo "http://localhost:4943?canisterId=$(dfx canister id frontend)"
fi
