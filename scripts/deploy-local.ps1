# PowerShell script for local deployment

Write-Host "🚀 Deploying ATOSfit to Local DFX..." -ForegroundColor Cyan
Write-Host ""

# Check if WSL is available
$wslAvailable = Get-Command wsl -ErrorAction SilentlyContinue

if ($wslAvailable) {
    Write-Host "📍 Using WSL Ubuntu-24.04 for deployment" -ForegroundColor Yellow
    
    # Start dfx in WSL
    wsl -d Ubuntu-24.04 bash -c @"
        cd /mnt/d/Gait\ Scope/ATOS\ NEW/ATOSfit\ DB/ATOS-fit
        
        # Check dfx version
        echo 'Checking dfx version...'
        dfx --version
        
        # Start dfx
        echo 'Starting dfx...'
        dfx start --clean --background
        
        # Deploy backend
        echo 'Deploying backend canister...'
        dfx deploy backend
        
        # Deploy frontend
        echo 'Deploying frontend canister...'
        dfx deploy frontend
        
        echo '✅ Deployment complete!'
        echo ''
        echo 'Backend Canister ID:'
        dfx canister id backend
        echo ''
        echo 'Frontend Canister ID:'
        dfx canister id frontend
        echo ''
        echo 'Access your app at:'
        echo "http://localhost:4943?canisterId=`$(dfx canister id frontend)"
"@
} else {
    Write-Host "❌ WSL not found. Please install WSL and Ubuntu-24.04" -ForegroundColor Red
    Write-Host "Run: wsl --install -d Ubuntu-24.04" -ForegroundColor Yellow
    exit 1
}
