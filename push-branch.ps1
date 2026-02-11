# Get the name of the current branch
$currentBranch = git rev-parse --abbrev-ref HEAD

Write-Host "📡 Detected current branch: $currentBranch" -ForegroundColor Cyan

# 1. Push to Client (MigrationGFA)
Write-Host "Pushing $currentBranch to MigrationGFA (origin)..." -ForegroundColor Green
git push origin $currentBranch

# 2. Push to Company (DEV-TNK)
Write-Host "Pushing $currentBranch to DEV-TNK (devtnk)..." -ForegroundColor Green
git push devtnk $currentBranch --force

Write-Host "✅ Done! You can now open Pull Requests on both GitHub accounts." -ForegroundColor Cyan