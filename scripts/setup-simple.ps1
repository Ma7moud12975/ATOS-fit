#!/usr/bin/env pwsh

Write-Host "🚀 Setting up ATOS-fit local development environment..." -ForegroundColor Green

# Use the exact dfx command format from your system
$dfxCommand = 'wsl -d Ubuntu-24.04 bash -c "cd \"/mnt/d/Gait Scope/ATOS NEW/ATOSfit DB/ATOS-fit\" && ~/.local/share/dfx/bin/dfx'

Write-Host "🧹 Cleaning up previous deployment..." -ForegroundColor Blue
try {
    Invoke-Expression "$dfxCommand stop`""
} catch {
    Write-Host "   (No previous deployment to stop)" -ForegroundColor Yellow
}

Write-Host "🔄 Starting local Internet Computer replica..." -ForegroundColor Blue
Invoke-Expression "$dfxCommand start --clean --background`""

# Wait for replica to start
Write-Host "⏳ Waiting for replica to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

Write-Host "🆔 Deploying Internet Identity canister..." -ForegroundColor Blue
Invoke-Expression "$dfxCommand deploy internet_identity`""

Write-Host "🗄️ Deploying backend canister..." -ForegroundColor Blue
Invoke-Expression "$dfxCommand deploy backend`""

Write-Host "🎨 Building frontend..." -ForegroundColor Blue
npm run build

Write-Host "🌐 Deploying frontend canister..." -ForegroundColor Blue
Invoke-Expression "$dfxCommand deploy frontend`""

# Get canister IDs
Write-Host "📋 Getting canister IDs..." -ForegroundColor Blue
$backendId = Invoke-Expression "$dfxCommand canister id backend`""
$frontendId = Invoke-Expression "$dfxCommand canister id frontend`""
$iiId = Invoke-Expression "$dfxCommand canister id internet_identity`""

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
Invoke-Expression "$dfxCommand generate backend`""

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
Write-Host '   wsl -d Ubuntu-24.04 bash -c "cd \"/mnt/d/Gait Scope/ATOS NEW/ATOSfit DB/ATOS-fit\" && ~/.local/share/dfx/bin/dfx stop"' -ForegroundColor White