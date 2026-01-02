# Fix PowerShell Execution Policy Issue

## Problem
PowerShell is blocking npm scripts with error:
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled
```

## Solution 1: Use npm.cmd (Recommended - No Admin Required)

Instead of `npm`, use `npm.cmd` which bypasses PowerShell script restrictions:

```powershell
# Install dependencies
npm.cmd install

# Run dev server
npm.cmd run dev

# Other commands
npm.cmd run build
npm.cmd run start
```

## Solution 2: Change Execution Policy (Requires Admin)

If you want to use `npm` directly, change the execution policy:

### Option A: For Current User Only (Safer)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Option B: For Current Session Only (Temporary)
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

### Option C: System-Wide (Requires Admin PowerShell)
1. Open PowerShell as Administrator
2. Run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
```

## Solution 3: Use Command Prompt Instead

Open **Command Prompt** (cmd.exe) instead of PowerShell:
- Press `Win + R`
- Type `cmd` and press Enter
- Navigate to your project and use `npm` normally

## Quick Fix Commands

```powershell
# Navigate to project (adjust path as needed)
cd "C:\Users\Raphae Balogun\football-analytics-game"

# Install dependencies using .cmd
npm.cmd install

# Start dev server
npm.cmd run dev
```

## Verify It Works

After using `npm.cmd install`, check:
```powershell
Test-Path node_modules
# Should return: True
```

## Why This Happens

Windows PowerShell has execution policies to prevent malicious scripts. npm.ps1 is a PowerShell script, so it's blocked by default on some systems.

Using `npm.cmd` calls the Windows batch file version instead, which doesn't have this restriction.

