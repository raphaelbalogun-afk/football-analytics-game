# Vercel Deployment Script
# This script helps deploy the football analytics game to Vercel

Write-Host "=== Vercel Deployment Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if vercel is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Check if logged in
Write-Host "Checking Vercel login status..." -ForegroundColor Yellow
$loginStatus = vercel whoami 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "You need to login to Vercel first." -ForegroundColor Yellow
    Write-Host "Run: vercel login" -ForegroundColor Green
    Write-Host ""
    Write-Host "After logging in, run this script again or:" -ForegroundColor Yellow
    Write-Host "  vercel --prod" -ForegroundColor Green
    exit 1
}

Write-Host "Logged in as: $loginStatus" -ForegroundColor Green
Write-Host ""

# Build the project first
Write-Host "Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Please fix errors before deploying." -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

# Deploy to Vercel
Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
Write-Host "Note: You'll need to set environment variables in Vercel dashboard after deployment." -ForegroundColor Yellow
Write-Host ""

vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== Deployment Complete! ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "IMPORTANT: Set these environment variables in Vercel Dashboard:" -ForegroundColor Yellow
    Write-Host "  1. Go to your project settings"
    Write-Host "  2. Environment Variables section"
    Write-Host "  3. Add the following:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  NEXT_PUBLIC_SUPABASE_URL=https://msmpesahgevguiizimsi.supabase.co" -ForegroundColor Cyan
    Write-Host "  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zbXBlc2FoZ2V2Z3VpaXppbXNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNDY1ODIsImV4cCI6MjA4MjcyMjU4Mn0.e0NbT1tmMs2402-aM8UBDYeifK4-fawKnX5OPbd_MAI" -ForegroundColor Cyan
    Write-Host "  API_FOOTBALL_KEY=50fffba51340e0b4987bba113fc2d0e9" -ForegroundColor Cyan
    Write-Host "  API_FOOTBALL_BASE_URL=https://v3.football.api-sports.io" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  4. Redeploy after adding variables" -ForegroundColor Yellow
} else {
    Write-Host "Deployment failed. Check errors above." -ForegroundColor Red
}

