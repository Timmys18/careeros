# CareerOS — one-command local start (Windows)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "CareerOS: starting Prisma Postgres..." -ForegroundColor Cyan
Start-Process -NoNewWindow -FilePath "npx" -ArgumentList "prisma","dev","--name","default" -PassThru | Out-Null
Start-Sleep -Seconds 8

Write-Host "CareerOS: applying schema..." -ForegroundColor Cyan
npm run db:push

Write-Host "CareerOS: starting Next.js on http://localhost:3000" -ForegroundColor Green
npm run dev
