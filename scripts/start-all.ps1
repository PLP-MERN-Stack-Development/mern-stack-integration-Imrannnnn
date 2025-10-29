# Start both server and client dev servers in separate PowerShell windows on Windows
# Usage: From repository root run: .\scripts\start-all.ps1

# Resolve paths relative to this script
$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
$serverPath = Join-Path $root "..\server" | Resolve-Path -Relative
$clientPath = Join-Path $root "..\client" | Resolve-Path -Relative

Write-Host "Starting server in new PowerShell window (path: $serverPath)"
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$serverPath'; npm run dev" -WorkingDirectory $serverPath

Write-Host "Starting client in new PowerShell window (path: $clientPath)"
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$clientPath'; npm run dev" -WorkingDirectory $clientPath

Write-Host "Launched server and client. Check the new windows for logs."
