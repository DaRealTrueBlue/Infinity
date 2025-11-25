# Build Infinity Browser Installer
Write-Host "Building Infinity Browser..." -ForegroundColor Cyan

# Step 1: Package with electron-packager
Write-Host "`nStep 1: Packaging application..." -ForegroundColor Yellow
npx @electron/packager . "Infinity Browser" --platform=win32 --arch=x64 --out=dist --overwrite --icon=logo.ico

# Rename the folder to just "Infinity"
if (Test-Path "dist\Infinity Browser-win32-x64") {
    if (Test-Path "dist\Infinity") {
        Remove-Item "dist\Infinity" -Recurse -Force
    }
    Rename-Item "dist\Infinity Browser-win32-x64" "Infinity"
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "Packaging failed!" -ForegroundColor Red
    exit 1
}

# Step 2: Create a self-extracting archive with 7-Zip
$packagePath = "dist\Infinity"
$installerPath = "dist\InfinityBrowserSetup.exe"

Write-Host "`nStep 2: Creating self-extracting installer..." -ForegroundColor Yellow

# Check if 7-Zip is installed
$7zipPath = "C:\Program Files\7-Zip\7z.exe"
if (-not (Test-Path $7zipPath)) {
    Write-Host "7-Zip not found. Creating a simple zip instead..." -ForegroundColor Yellow
    Compress-Archive -Path "$packagePath\*" -DestinationPath "dist\InfinityBrowser.zip" -Force
    Write-Host "`nBuild complete!" -ForegroundColor Green
    Write-Host "Installer available at: dist\InfinityBrowser.zip" -ForegroundColor Cyan
    Write-Host "`nTo create an installer .exe, install 7-Zip and run this script again." -ForegroundColor Yellow
} else {
    # Create self-extracting archive from within the directory
    Push-Location $packagePath
    & $7zipPath a -t7z "..\..\dist\InfinityBrowser.7z" "*" -mx=9
    Pop-Location
    
    # Get the 7-Zip installation directory for the SFX module
    $7zipDir = Split-Path $7zipPath
    $sfxModule = Join-Path $7zipDir "7z.sfx"
    
    if (Test-Path $sfxModule) {
        # Copy SFX module and apply icon to it first
        Write-Host "`nStep 3: Applying custom icon..." -ForegroundColor Yellow
        $tempSfx = "dist\temp_sfx.exe"
        Copy-Item $sfxModule $tempSfx -Force
        & ".\node_modules\rcedit\bin\rcedit.exe" "$tempSfx" --set-icon "logo.ico"
        
        # Combine config + modified SFX module + archive
        $configBytes = [System.IO.File]::ReadAllBytes("sfx-config.txt")
        $archiveBytes = [System.IO.File]::ReadAllBytes("dist\InfinityBrowser.7z")
        $sfxBytes = [System.IO.File]::ReadAllBytes($tempSfx)
        $combined = $sfxBytes + $configBytes + $archiveBytes
        [System.IO.File]::WriteAllBytes($installerPath, $combined)
        
        # Cleanup
        Remove-Item "dist\InfinityBrowser.7z" -Force
        Remove-Item $tempSfx -Force
        
        Write-Host "`nBuild complete!" -ForegroundColor Green
        Write-Host "Installer available at: $installerPath" -ForegroundColor Cyan
        Write-Host "File size: $([math]::Round((Get-Item $installerPath).Length / 1MB, 2)) MB" -ForegroundColor Cyan
    } else {
        Write-Host "SFX module not found, keeping as .7z archive" -ForegroundColor Yellow
        Write-Host "`nBuild complete!" -ForegroundColor Green
        Write-Host "Archive available at: dist\InfinityBrowser.7z" -ForegroundColor Cyan
    }
}

Write-Host "`nYou can now upload the installer to your website!" -ForegroundColor Green
