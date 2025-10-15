#!/usr/bin/env pwsh

Write-Host "🚀 Setting up ATOS-fit local development environment..." -ForegroundColor Green

# Check if dfx is available in WSL
$wslAvailable = $false
try {
    $wslCheck = wsl -l -q 2>$null
    if ($LASTEXITCODE -eq 0) {
        $wslAvailable = $true
        Write-Host "🐧 WSL detected, using WSL environment for dfx" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ WSL not available, checking for local dfx installation..." -ForegroundColor Yellow
}

# Function to run dfx commands
function Invoke-DfxCommand {
    param([string]$Command)
    
    if ($wslAvailable) {
        $wslCommand = 'cd "/mnt/d/Gait Scope/ATOS NEW/ATOSfit DB/ATOS-fit" && ~/.local/share/dfx/bin/dfx ' + $Command
        wsl -d Ubuntu-24.04 bash -c $wslCommand
    } else {
        # Try local dfx
        & dfx $Command.Split(' ')
    }
}

Write-Host "🧹 Cleaning up previous deployment..." -ForegroundColor Blue
try {
    Invoke-DfxCommand "stop"
} catch {
    # Ignore errors when stopping
}

Write-Host "🔄 Starting local Internet Computer replica..." -ForegroundColor Blue
Invoke-DfxCommand "start --clean --background"

# Wait for replica to start
Write-Host "⏳ Waiting for replica to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "🆔 Deploying Internet Identity canister..." -ForegroundColor Blue
Invoke-DfxCommand "deploy internet_identity"

Write-Host "🗄️ Deploying backend canister..." -ForegroundColor Blue
Invoke-DfxCommand "deploy backend"

Write-Host "🎨 Building frontend..." -ForegroundColor Blue
npm run build

Write-Host "🌐 Deploying frontend canister..." -ForegroundColor Blue
Invoke-DfxCommand "deploy frontend"

# Get canister IDs
Write-Host "📋 Getting canister IDs..." -ForegroundColor Blue
$backendId = if ($wslAvailable) {
    wsl -d Ubuntu-24.04 bash -c 'cd "/mnt/d/Gait Scope/ATOS NEW/ATOSfit DB/ATOS-fit" && ~/.local/share/dfx/bin/dfx canister id backend'
} else {
    & dfx canister id backend
}

$frontendId = if ($wslAvailable) {
    wsl -d Ubuntu-24.04 bash -c 'cd "/mnt/d/Gait Scope/ATOS NEW/ATOSfit DB/ATOS-fit" && ~/.local/share/dfx/bin/dfx canister id frontend'
} else {
    & dfx canister id frontend
}

$iiId = if ($wslAvailable) {
    wsl -d Ubuntu-24.04 bash -c 'cd "/mnt/d/Gait Scope/ATOS NEW/ATOSfit DB/ATOS-fit" && ~/.local/share/dfx/bin/dfx canister id internet_identity'
} else {
    & dfx canister id internet_identity
}

Write-Host "📝 Creating .env.local file..." -ForegroundColor Blue
$envContent = @"
VITE_DFX_NETWORK=local
VITE_IC_HOST=http://localhost:8000
VITE_BACKEND_CANISTER_ID=$backendId
VITE_FRONTEND_CANISTER_ID=$frontendId
VITE_INTERNET_IDENTITY_CANISTER_ID=$iiId
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host "🔧 Generating Candid declarations..." -ForegroundColor Blue
Invoke-DfxCommand "generate backend"

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Canister Information:" -ForegroundColor Cyan
Write-Host "   Backend:           $backendId" -ForegroundColor White
Write-Host "   Frontend:          $frontendId" -ForegroundColor White
Write-Host "   Internet Identity: $iiId" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Access URLs:" -ForegroundColor Cyan
Write-Host "   Frontend:          http://localhost:8000/?canisterId=$frontendId" -ForegroundColor White
Write-Host "   Internet Identity: http://localhost:8000/?canisterId=$iiId" -ForegroundColor White
Write-Host "   Candid UI:         http://localhost:8000/_/candid?canisterId=$backendId" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Start development server:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "🛑 To stop the replica:" -ForegroundColor Cyan
if ($wslAvailable) {
    Write-Host '   wsl -d Ubuntu-24.04 bash -c "cd \"/mnt/d/Gait Scope/ATOS NEW/ATOSfit DB/ATOS-fit\" && ~/.local/share/dfx/bin/dfx stop"' -ForegroundColor White
} else {
    Write-Host "   dfx stop" -ForegroundColor White
}