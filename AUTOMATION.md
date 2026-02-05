# Development Automation Guide

## 🚀 Quick Start

### Auto-Launch Everything (Recommended)

**Option 1: Double-click the batch file**
```
start-dev.bat
```
Just double-click `start-dev.bat` in the project root folder.

**Option 2: Use npm script**
```bash
npm run dev:auto
```

**Option 3: Run PowerShell script directly**
```powershell
.\start-dev.ps1
```

This will automatically:
- ✅ Start the backend server (port 5000)
- ✅ Start the frontend server (port 5173)
- ✅ Open Chrome with both URLs

---

## 🔐 Git Authentication

### Windows Credential Manager (Already Configured)

Your Git is already configured to use Windows Credential Manager. This means:

1. **First time**: When you `git push`, Git will ask for your username and password
2. **After that**: Credentials are saved securely and used automatically

### Verify Configuration

```bash
git config credential.helper
# Should return: manager
```

### Manual Setup (if needed)

If credential helper is not set:
```bash
git config --global credential.helper manager
```

---

## 📝 Manual Server Start (Alternative)

If you prefer to start servers manually:

### Backend
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

### Frontend
```bash
npm run dev
```
Frontend runs on: http://localhost:5173

---

## 🛠️ Troubleshooting

### Port Already in Use

If you see "Port already in use" warnings:
- Check if servers are already running
- Close them with `Ctrl+C` in their terminal windows
- Or find and kill the process:
  ```powershell
  # Find process using port 5000
  netstat -ano | findstr :5000
  # Kill process by PID
  taskkill /PID <PID> /F
  ```

### Chrome Doesn't Open

The script will show URLs you can open manually:
- Frontend: http://localhost:5173
- Backend Health: http://localhost:5000/api/health

### PowerShell Execution Policy Error

If you get an execution policy error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 🎯 What Gets Opened

When you run the auto-start script, Chrome opens with:

1. **Frontend** (http://localhost:5173)
   - Your main React application
   - Hot reload enabled for instant updates

2. **Backend Health Check** (http://localhost:5000/api/health)
   - Confirms backend is running
   - Shows database connection status

---

## 🔄 Stopping Servers

Press `Ctrl+C` in each server terminal window to stop them gracefully.
