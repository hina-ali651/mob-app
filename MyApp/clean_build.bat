@echo off
echo ==============================================
echo [1/6] Creating Space-Free Symlink for Android NDK...
echo ==============================================
:: Clean up old link if it exists
if exist "D:\AndroidNDK" (
    rmdir "D:\AndroidNDK" 2>nul
)
:: Create the directory junction to bypass Windows space in path bug
mklink /J "D:\AndroidNDK" "C:\Users\Saroosh Ahmed\AppData\Local\Android\Sdk\ndk"
if errorlevel 1 (
    echo [WARNING] Failed to create junction at D:\AndroidNDK.
    echo Trying alternative C:\AndroidNDK...
    if exist "C:\AndroidNDK" rmdir "C:\AndroidNDK" 2>nul
    mklink /J "C:\AndroidNDK" "C:\Users\Saroosh Ahmed\AppData\Local\Android\Sdk\ndk"
    set "NDK_MOUNT=C:/AndroidNDK"
) else (
    set "NDK_MOUNT=D:/AndroidNDK"
)

echo.
echo ==============================================
echo [2/6] Generating local.properties with Space-Free NDK path...
echo ==============================================
(
echo sdk.dir=C:/Users/Saroosh Ahmed/AppData/Local/Android/Sdk
echo ndk.dir=%NDK_MOUNT%/27.1.12297006
) > android\local.properties
echo Created android\local.properties pointing to %NDK_MOUNT%/27.1.12297006.

echo.
echo ==============================================
echo [3/6] Force-stopping background Java/Gradle/Node processes...
echo ==============================================
taskkill /f /im java.exe 2>nul
taskkill /f /im node.exe 2>nul

echo.
echo ==============================================
echo [4/6] Deleting C++ compilation cache (.cxx)...
echo ==============================================
if exist "android\app\.cxx" (
    rmdir /s /q "android\app\.cxx"
    echo Deleted android\app\.cxx successfully.
) else (
    echo No cached .cxx folder found.
)

echo.
echo ==============================================
echo [5/6] Deleting old build folders...
echo ==============================================
if exist "android\build" (
    rmdir /s /q "android\build"
    echo Deleted android\build
)
if exist "android\app\build" (
    rmdir /s /q "android\app\build"
    echo Deleted android\app\build
)

echo.
echo ==============================================
echo [6/6] Running Gradle clean and Launching build...
echo ==============================================
cd android
call gradlew.bat clean
cd ..

npm run android
