#!/usr/bin/env pwsh

# Script para iniciar ProductStore en modo optimizado
# Uso: .\dev.ps1 [fast|turbo|full]
# - fast  : Backend sin nodemon + Frontend normal (RECOMENDADO)
# - turbo : Backend con nodemon + Frontend con Turbopack (experimental)
# - full  : Ambos con todas las características

param(
    [string]$Mode = "fast"
)

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $projectRoot "backend-marketplace"
$frontendPath = Join-Path $projectRoot "frontend-marketplace"

Write-Host "🚀 ProductStore Development Server" -ForegroundColor Cyan
Write-Host "Modo: $Mode" -ForegroundColor Yellow
Write-Host ""

# Validar que existen los directorios
if (-not (Test-Path $backendPath)) {
    Write-Host "❌ Error: No se encuentra backend-marketplace" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $frontendPath)) {
    Write-Host "❌ Error: No se encuentra frontend-marketplace" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Backend iniciando en: $backendPath" -ForegroundColor Green
Write-Host "📦 Frontend iniciando en: $frontendPath" -ForegroundColor Green
Write-Host ""

switch ($Mode) {
    "fast" {
        Write-Host "⚡ Modo FAST - Mínimo consumo de recursos" -ForegroundColor Cyan
        Write-Host "Backend: node (sin nodemon)" -ForegroundColor Yellow
        Write-Host "Frontend: next dev normal" -ForegroundColor Yellow
        Write-Host ""
        
        # Backend
        $backendJob = Start-Process -NoNewWindow -PassThru -FilePath "cmd" `
            -ArgumentList "/k cd $backendPath && npm run dev:fast"
        
        Start-Sleep -Seconds 3
        
        # Frontend
        $frontendJob = Start-Process -NoNewWindow -PassThru -FilePath "cmd" `
            -ArgumentList "/k cd $frontendPath && npm run dev"
        
        Write-Host "✅ Ambos servidores iniciados" -ForegroundColor Green
        Write-Host ""
        Write-Host "Backend:  http://localhost:3001" -ForegroundColor Cyan
        Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Presiona Ctrl+C en las ventanas cuando termines" -ForegroundColor Gray
    }
    
    "turbo" {
        Write-Host "🔥 Modo TURBO - Compilación experimental rápida" -ForegroundColor Cyan
        Write-Host "Backend: nodemon (vigila cambios)" -ForegroundColor Yellow
        Write-Host "Frontend: Turbopack (experimental)" -ForegroundColor Yellow
        Write-Host ""
        
        # Backend
        $backendJob = Start-Process -NoNewWindow -PassThru -FilePath "cmd" `
            -ArgumentList "/k cd $backendPath && npm run dev"
        
        Start-Sleep -Seconds 3
        
        # Frontend
        $frontendJob = Start-Process -NoNewWindow -PassThru -FilePath "cmd" `
            -ArgumentList "/k cd $frontendPath && npm run dev:turbo"
        
        Write-Host "✅ Ambos servidores iniciados (modo experimental)" -ForegroundColor Green
        Write-Host ""
        Write-Host "Backend:  http://localhost:3001" -ForegroundColor Cyan
        Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "⚠️  Turbopack es experimental, reporta problemas en GitHub si los hay" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Presiona Ctrl+C en las ventanas cuando termines" -ForegroundColor Gray
    }
    
    "full" {
        Write-Host "🎯 Modo FULL - Todas las características" -ForegroundColor Cyan
        Write-Host "Backend: nodemon (vigila cambios)" -ForegroundColor Yellow
        Write-Host "Frontend: next dev normal" -ForegroundColor Yellow
        Write-Host ""
        
        # Backend
        $backendJob = Start-Process -NoNewWindow -PassThru -FilePath "cmd" `
            -ArgumentList "/k cd $backendPath && npm run dev"
        
        Start-Sleep -Seconds 3
        
        # Frontend
        $frontendJob = Start-Process -NoNewWindow -PassThru -FilePath "cmd" `
            -ArgumentList "/k cd $frontendPath && npm run dev"
        
        Write-Host "✅ Ambos servidores iniciados" -ForegroundColor Green
        Write-Host ""
        Write-Host "Backend:  http://localhost:3001" -ForegroundColor Cyan
        Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Presiona Ctrl+C en las ventanas cuando termines" -ForegroundColor Gray
    }
    
    default {
        Write-Host "❌ Modo desconocido: $Mode" -ForegroundColor Red
        Write-Host ""
        Write-Host "Usos válidos:" -ForegroundColor Yellow
        Write-Host "  .\dev.ps1           # Modo fast (recomendado)" -ForegroundColor Gray
        Write-Host "  .\dev.ps1 fast      # Mínimo consumo" -ForegroundColor Gray
        Write-Host "  .\dev.ps1 turbo     # Compilación rápida experimental" -ForegroundColor Gray
        Write-Host "  .\dev.ps1 full      # Todas las características" -ForegroundColor Gray
        exit 1
    }
}
