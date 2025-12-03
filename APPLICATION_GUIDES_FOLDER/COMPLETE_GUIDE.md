# ⚾ Baseball PWA - Complete Setup & Feature Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Complete Feature List](#complete-feature-list)
3. [Step-by-Step Setup](#step-by-step-setup)
4. [Testing the Application](#testing-the-application)
5. [Troubleshooting](#troubleshooting)
6. [Production Deployment](#production-deployment)

---

## Prerequisites

Before you begin, ensure you have:
- **Node.js 16+** installed
- **XAMPP** (for MySQL database)
- **npm** or **yarn** package manager
- **Chrome/Edge browser** (for PWA features)
- **Google account** (optional, for OAuth setup)

---

## ✅ Complete Feature List

### 1. ✅ User Authentication System
**Features:**
- Local authentication with email/password
- Google OAuth 2.0 social login
- JWT token-based authentication
- Secure password hashing with bcrypt
- Persistent login sessions
- Protected API routes with middleware

**Files:**
- `server/routes/auth.js` - Authentication endpoints
- `server/config/passport.js` - Google OAuth configuration
- `server/middleware/auth.js` - JWT authentication middleware
- `client/src/pages/Login.js` - Login page
- `client/src/pages/Register.js` - Registration page
- `client/src/pages/AuthCallback.js` - OAuth callback handler

**API Endpoints:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback

---

### 2. ✅ Task Management System
**Features:**
- Create, read, update, delete (CRUD) tasks
- Baseball-themed categories (Training, Game, Equipment, Team Meeting, Other)
- Priority levels (Low, Medium, High)
- Status tracking (Pending, In Progress, Completed)
- Due date management
- Task filtering by status
- Real-time task updates via Socket.IO

**Files:**
- `server/routes/tasks.js` - Task CRUD endpoints with real-time
- `client/src/pages/Tasks.js` - Task management page
- `client/src/components/TaskModal.js` - Task create/edit modal
- `client/src/components/TaskModal.css` - Modal styling

**API Endpoints:**
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

**Task Categories:**
- 🏋️ **Training** - Practice sessions
- ⚾ **Game** - Scheduled matches
- 🧤 **Equipment** - Gear maintenance
- 👥 **Team Meeting** - Strategy discussions
- 📌 **Other** - General tasks

---

### 3. ✅ Real-time Features (Socket.IO)
**Features:**
- Bidirectional real-time communication
- Live task updates across multiple browser windows
- Individual user rooms for isolated updates
- Automatic reconnection handling
- Instant notifications for task create/update/delete

**Files:**
- `server/server.js` - Socket.IO server setup
- `server/routes/tasks.js` - Real-time task notifications
- `client/src/hooks/useSocket.js` - Socket.IO client hook

**How to Use:**
```javascript
import { useSocket } from './hooks/useSocket';

const user = JSON.parse(localStorage.getItem('user'));
useSocket(
  user?.id,
  (task) => console.log('New task:', task),
  (task) => console.log('Updated task:', task),
  (id) => console.log('Deleted task:', id)
);
```

---

### 4. ✅ Dashboard & Analytics
**Features:**
- Task statistics (Total, Pending, Completed)
- Upcoming tasks view (sorted by due date)
- Quick navigation to task management
- Real-time stat updates
- Responsive card-based layout

**Files:**
- `client/src/pages/Dashboard.js` - Main dashboard
- `client/src/pages/Dashboard.css` - Dashboard styling

---

### 5. ✅ Progressive Web App (PWA)
**Features:**
- **One-click install button** in navbar (NEW!)
- Installable on desktop and mobile
- Standalone app mode
- Custom app icons (192x192, 512x512)
- Theme colors and splash screen
- Add to home screen capability
- Works like a native app
- Automatic install prompt detection

**Files:**
- `client/public/manifest.json` - PWA manifest
- `client/public/icon-192.png` - App icon (192x192)
- `client/public/icon-512.png` - App icon (512x512)
- `client/public/index.html` - Manifest link
- `client/src/components/InstallPWA.js` - Install button component (NEW!)
- `client/src/components/InstallPWA.css` - Install button styling (NEW!)

**Installation Methods:**
1. **Click "📥 Install App" button** in navbar (easiest!)
2. Click install icon in browser address bar
3. Use browser menu: "Install Baseball PWA"
4. Mobile: "Add to Home Screen"

---

### 6. ✅ Offline Support (Service Worker)
**Features:**
- Cache-first strategy for assets
- Offline fallback page
- Automatic cache versioning
- Background sync ready
- Works offline after first visit

**Files:**
- `client/public/service-worker.js` - Service worker implementation
- `client/public/index.html` - Service worker registration

**Note:** Service worker only runs in production builds to prevent caching issues during development.

---

### 7. ✅ Onboarding Tutorial
**Features:**
- Interactive 6-step tutorial for new users
- Automatic display on first visit
- Progress indicators
- Skip option
- Previous/Next navigation
- Stored in localStorage
- Can be restarted from Profile page

**Files:**
- `client/src/components/OnboardingTutorial.js` - Tutorial component
- `client/src/components/OnboardingTutorial.css` - Responsive styles

**Tutorial Steps:**
1. Welcome to Baseball PWA
2. Dashboard overview
3. Task management
4. Task categories
5. Profile section
6. Get started message

---

### 8. ✅ User Profile
**Features:**
- View user information
- Display profile picture (Google OAuth)
- Restart onboarding tutorial
- Account management

**Files:**
- `client/src/pages/Profile.js` - Profile page
- `client/src/pages/Profile.css` - Profile styling

---

### 9. ✅ Responsive Design
**Features:**
- Mobile-first design approach
- Hamburger menu for mobile
- Touch-friendly buttons
- Responsive grid layouts
- Optimized for all screen sizes

**Mobile Optimizations:**
- Navbar: Slide-in drawer, vertical menu
- Dashboard: Stacked layout, single column stats
- Tasks: Vertical filter tabs, single column grid
- Forms: Full-width inputs, large touch targets

---

### 10. ✅ Modern UI/UX
**Features:**
- Black and white aesthetic
- Glassmorphism effects
- Smooth animations and transitions
- Hover effects
- Loading states
- Error handling

**Design System:**
- Primary: Black (#000000)
- Secondary: White (#FFFFFF)
- Accents: Grays (#666, #999, #e0e0e0)
- Font weights: 500, 600, 700
- Responsive typography

---

## 🚀 Step-by-Step Setup

### 1️⃣ Database Setup (5 minutes)

1. **Start XAMPP**
   - Open XAMPP Control Panel
   - Click "Start" for Apache module
   - Click "Start" for MySQL module
   - Wait for green indicators

2. **Create Database**
   - Open browser: http://localhost/phpmyadmin
   - Click "New" in left sidebar
   - Database name: `baseball_pwa`
   - Collation: `utf8mb4_general_ci`
   - Click "Create"

3. **Import SQL Schema**
   - Select `baseball_pwa` database from left sidebar
   - Click "SQL" tab at the top
   - Open `server/database/database.sql` file in text editor
   - Copy ALL content
   - Paste into SQL query box
   - Click "Go" button
   - ✅ You should see "4 rows inserted" message

---

### 2️⃣ Backend Setup (3 minutes)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   
   Create a `.env` file in the root directory:
   ```bash
   # Windows
   copy .env.example .env
   
   # Or create manually
   ```

   Edit `.env` file with these values:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_PORT=3306
   DB_NAME=baseball_pwa
   
   # JWT Configuration
   JWT_SECRET=your_random_secret_key_here_change_this_to_something_secure
   
   # Session Configuration
   SESSION_SECRET=another_random_secret_here_make_it_unique
   
   # Client URL
   CLIENT_URL=http://localhost:3000
   
   # Google OAuth (Optional - see step 3)
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
   ```

3. **Google OAuth Setup** (Optional - can skip for now)
   
   **IMPORTANT:** If you see "OAuth client was not found" error, either:
   - Skip Google login and use local authentication, OR
   - Follow these steps carefully:

   a. **Go to Google Cloud Console**
      - Visit: https://console.cloud.google.com/
   
   b. **Create New Project**
      - Click "Select a project" dropdown
      - Click "New Project"
      - Project name: "Baseball PWA"
      - Click "Create"
      - Wait for project creation
   
   c. **Configure OAuth Consent Screen**
      - Go to "APIs & Services" → "OAuth consent screen"
      - Select "External" user type
      - Click "Create"
      - Fill in required fields:
        * App name: "Baseball PWA"
        * User support email: your email
        * Developer contact: your email
      - Click "Save and Continue"
      - Skip "Scopes" → Click "Save and Continue"
      - Add test users (your email) → Click "Save and Continue"
      - Click "Back to Dashboard"
   
   d. **Create OAuth Credentials**
      - Go to "Credentials" → "Create Credentials" → "OAuth client ID"
      - Application type: "Web application"
      - Name: "Baseball PWA Client"
      - Authorized JavaScript origins:
        * http://localhost:3000
        * http://localhost:5000
      - Authorized redirect URIs:
        * http://localhost:5000/auth/google/callback
      - Click "Create"
      - **Copy Client ID and Client Secret**
   
   e. **Update .env File**
      ```env
      GOOGLE_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
      GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
      GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
      ```
   
   f. **Restart Server**
      ```bash
      # Stop server (Ctrl+C if running)
      npm run server
      ```

---

### 3️⃣ Frontend Setup (2 minutes)

1. **Navigate to Client Folder**
   ```bash
   cd client
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Environment File**
   
   Create `.env` file in `client` folder:
   ```bash
   # Windows
   echo REACT_APP_API_URL=http://localhost:5000 > .env
   ```
   
   Or create manually with this content:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Return to Root Directory**
   ```bash
   cd ..
   ```

---

### 4️⃣ Run the Application

**Option A: Run Both Together (Recommended)**
```bash
# From root directory
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend React app on http://localhost:3000

**Option B: Run Separately**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend (open new terminal)
cd client
npm start
```

---

### 5️⃣ Access the Application

Once both servers are running:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **phpMyAdmin:** http://localhost/phpmyadmin
- **Health Check:** http://localhost:5000/health

---

## 🧪 Testing the Application

### Test 1: Local Authentication

1. Open http://localhost:3000
2. Click "Register" button
3. Fill in registration form:
   - Username: `testplayer`
   - Email: `test@baseball.com`
   - Password: `password123`
4. Click "Register"
5. ✅ You should be redirected to Dashboard
6. Check browser localStorage for JWT token

### Test 2: Task Management

1. Click "Tasks" in navigation bar
2. Click "+ New Task" button
3. Create a task:
   - Title: "Batting Practice"
   - Description: "Work on swing mechanics"
   - Category: Training
   - Priority: High
   - Status: Pending
   - Due Date: Tomorrow
4. Click "Save Task"
5. ✅ Task should appear in the list
6. Try editing the task (click "Edit")
7. Try deleting the task (click "Delete")

### Test 3: Real-time Updates

1. Open app in two browser windows/tabs
2. Login with the same account in both
3. In Window 1: Create a new task
4. ✅ Window 2 should instantly show the new task
5. In Window 1: Update the task
6. ✅ Window 2 should instantly show the update
7. In Window 1: Delete the task
8. ✅ Window 2 should instantly remove the task

### Test 4: Dashboard Statistics

1. Navigate to Dashboard
2. ✅ Check that statistics are correct:
   - Total Tasks count
   - Pending Tasks count
   - Completed Tasks count
3. Create a new task
4. ✅ Statistics should update automatically
5. Complete a task
6. ✅ Statistics should update automatically

### Test 5: PWA Installation

1. Open app in Chrome or Edge browser
2. Look for install icon in address bar (⊕ or computer icon)
3. Click the install icon
4. Click "Install" in the popup
5. ✅ App should open as standalone application
6. Check your desktop/start menu for the app icon
7. Close and reopen from desktop icon

### Test 6: Offline Mode

1. Load the app online first
2. Open Chrome DevTools (F12)
3. Go to "Application" tab
4. Click "Service Workers" in left sidebar
5. Check "Offline" checkbox
6. Refresh the page
7. ✅ App should still load and work
8. Navigate between pages
9. ✅ Navigation should work offline

**Note:** Service worker only works in production build. To test:
```bash
cd client
npm run build
cd ..
npm run server
# Visit http://localhost:5000
```

### Test 7: Onboarding Tutorial

1. Open app in incognito/private window
2. Register a new account
3. ✅ Tutorial should automatically appear
4. Click through all 6 steps
5. Click "Skip" or "Get Started"
6. Go to Profile page
7. Click "Restart Tutorial"
8. ✅ Tutorial should appear again

### Test 8: Google OAuth (if configured)

1. Click "Login with Google" button
2. Select your Google account
3. Grant permissions
4. ✅ You should be redirected to Dashboard
5. Check Profile page for Google profile picture

---

## 🐛 Troubleshooting

### Database Connection Error

**Error:** `ER_ACCESS_DENIED_ERROR` or `ECONNREFUSED`

**Solutions:**
- Check XAMPP MySQL is running (green indicator)
- Verify database name is `baseball_pwa`
- Check `.env` DB credentials match XAMPP settings
- Default XAMPP: user=`root`, password=`` (empty)
- Try restarting MySQL in XAMPP

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solutions:**
```bash
# Option 1: Change port in .env
PORT=5001

# Option 2: Kill process using port (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Option 3: Restart computer
```

### Google OAuth Not Working

**Error:** "OAuth client was not found"

**Solutions:**
- Skip Google login for now, use local authentication
- Verify redirect URI matches exactly: `http://localhost:5000/auth/google/callback`
- Check `.env` has correct `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Ensure no extra spaces in `.env` values
- Restart server after updating `.env`

### React App Won't Start

**Error:** Module not found or dependency issues

**Solutions:**
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm start
```

### Tasks Not Showing

**Solutions:**
- Check browser console for errors (F12)
- Verify JWT token exists in localStorage
- Check backend is running on port 5000
- Verify database has tasks table
- Check API URL in `client/.env`

### Real-time Updates Not Working

**Solutions:**
- Check Socket.IO connection in browser console
- Verify both frontend and backend are running
- Check CORS settings in `server/server.js`
- Try refreshing both browser windows
- Check firewall isn't blocking WebSocket connections

---

## 📱 PWA Features to Test

1. **Install App**
   - Click install button in browser
   - Launch as standalone app
   - Check app icon on desktop

2. **Offline Access**
   - Load app online first
   - Turn off internet
   - App should still work
   - Navigate between pages

3. **Add to Home Screen** (Mobile)
   - Open on mobile browser
   - Tap browser menu
   - Select "Add to Home Screen"
   - App icon appears on home screen

4. **Standalone Mode**
   - No browser UI (address bar, tabs)
   - Full-screen experience
   - Native app feel

---

## ✅ Verification Checklist

Before considering setup complete, verify:

- [ ] XAMPP MySQL is running
- [ ] Database `baseball_pwa` exists
- [ ] SQL schema imported (3 tables: users, tasks, sessions)
- [ ] Backend `.env` file configured
- [ ] Backend running on port 5000
- [ ] Frontend `.env` file configured
- [ ] Frontend running on port 3000
- [ ] Can register new user
- [ ] Can login with email/password
- [ ] Can create tasks
- [ ] Can edit tasks
- [ ] Can delete tasks
- [ ] Can filter tasks by status
- [ ] Dashboard shows correct statistics
- [ ] Real-time updates work across windows
- [ ] PWA is installable
- [ ] Onboarding tutorial appears for new users
- [ ] Profile page displays user info
- [ ] Navigation works on all pages
- [ ] Mobile responsive design works

---

## 🌐 Production Deployment

### Build for Production

1. **Build Frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Update Environment Variables**
   ```env
   NODE_ENV=production
   CLIENT_URL=https://your-domain.com
   ```

3. **Test Production Build Locally**
   ```bash
   npm run server
   # Visit http://localhost:5000
   ```

### Deployment Options

**Option 1: Render.com (Recommended)**
- Free tier available
- Automatic deployments from GitHub
- Built-in database support

**Option 2: Railway.app**
- Easy MySQL setup
- Simple deployment process
- Free tier available

**Option 3: Heroku**
- Popular platform
- Add-ons for MySQL
- Free tier (with limitations)

### Deployment Steps

1. **Setup Railway MySQL Database**
   - Create Railway account
   - Create new project
   - Add MySQL database
   - Note connection details

2. **Run Database Setup**
   ```bash
   node setup-database.js
   ```

3. **Update Google OAuth**
   - Add production URL to authorized origins
   - Add production callback URL

4. **Configure Environment Variables**
   - Set all production environment variables
   - Update database connection details
   - Set secure JWT and session secrets

5. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

6. **Deploy to Render**
   - Connect GitHub repository
   - Configure build command: `npm install && cd client && npm install && npm run build`
   - Configure start command: `npm run server`
   - Add environment variables
   - Deploy

7. **Verify Deployment**
   - Test all features in production
   - Check PWA installation
   - Verify offline mode
   - Test real-time updates

---

## 🎉 Success!

If all checks pass, your Baseball PWA is fully set up and ready to use!

## 📞 Need Help?

- Check the main `README.md` for additional documentation
- Review `FEATURES.md` for detailed feature descriptions
- Check browser console (F12) for error messages
- Verify all environment variables are set correctly

---

## 📚 Additional Resources

**Technology Documentation:**
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [PWA Guide](https://web.dev/progressive-web-apps/)

**Project Files:**
- `README.md` - Project overview
- `FEATURES.md` - Feature descriptions
- `server/database/database.sql` - Database schema
- `package.json` - Dependencies and scripts

---

**Last Updated:** November 30, 2025
**Version:** 1.0.0
**License:** MIT
