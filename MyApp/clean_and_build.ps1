# Stop Gradle Daemons to release file locks
Write-Host "Stopping Gradle Daemons..." -ForegroundColor Cyan
if (Test-Path "android/gradlew.bat") {
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd android && gradlew.bat --stop" -NoNewWindow -Wait
}

# Define paths to clear
$cxxPath = "android/app/.cxx"
$appBuildPath = "android/app/build"
$rootBuildPath = "android/build"

# Remove the C++ compilation cache (.cxx)
if (Test-Path $cxxPath) {
    Write-Host "Deleting cached C++ compilation files (.cxx)..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $cxxPath
}

# Remove Gradle build folders
if (Test-Path $appBuildPath) {
    Write-Host "Deleting app build folder..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $appBuildPath
}
if (Test-Path $rootBuildPath) {
    Write-Host "Deleting root build folder..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $rootBuildPath
}

# Run a clean build
if (Test-Path "android/gradlew.bat") {
    Write-Host "Running clean Gradle build..." -ForegroundColor Cyan
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd android && gradlew.bat clean" -NoNewWindow -Wait
}

# Launch the app
Write-Host "Launching build on your connected device..." -ForegroundColor Green
npm run android
