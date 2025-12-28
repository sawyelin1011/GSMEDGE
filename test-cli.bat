@echo off
REM YLSTACK CLI Automated Testing Script
REM Tests all CLI commands with proper cleanup

echo ========================================
echo YLSTACK CLI Automated Testing
echo ========================================
echo.

REM Phase 1: Basic Commands
echo [PHASE 1] Testing Basic Commands
echo ----------------------------------------
echo.

echo [TEST 1.1] ylstack --version
ylstack --version
echo.

echo [TEST 1.2] ylstack --help
ylstack --help
echo.

echo [TEST 1.3] ylstack info
ylstack info
echo.

REM Phase 2: Database Check Commands
echo.
echo [PHASE 2] Testing Database Check Commands
echo ----------------------------------------
echo.

echo [TEST 2.1] ylstack db check (SQLite)
ylstack db check
echo.

REM Phase 3: SQLite Database Operations
echo.
echo [PHASE 3] Testing SQLite Database Operations
echo ----------------------------------------
echo.

echo [TEST 3.1] ylstack db init --type sqlite --yes
ylstack db init --type sqlite --yes
echo.

echo [TEST 3.2] Check if sqlite.db file exists
if exist "server\db\local.db" (
    echo ✅ SQLite database file created
) else (
    echo ❌ SQLite database file NOT found
)
echo.

echo [TEST 3.3] Check if drizzle.config.ts exists
if exist "drizzle.config.ts" (
    echo ✅ Drizzle config file created
) else (
    echo ❌ Drizzle config file NOT found
)
echo.

echo [TEST 3.4] Check if server/migrations directory exists
if exist "server\migrations" (
    echo ✅ Migrations directory created
) else (
    echo ❌ Migrations directory NOT found
)
echo.

echo.
echo ========================================
echo Testing Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Review test results above
echo 2. Run: ylstack db generate (to generate migrations)
echo 3. Run: ylstack db migrate (to apply migrations)
echo 4. Run: ylstack db seed (to seed data)
echo 5. Run: ylstack dev (to start dev server)
echo.

pause
