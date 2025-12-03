# 🚂 Railway Database Setup & Update Guide

## 📊 Baseball Stats System

Your dashboard now tracks:
- 🏋️ **Training Sessions** - Completed training tasks
- ⚾ **Games Played** - Completed game tasks
- ✅ **Tasks Completed** - All completed tasks
- 🧤 **Equipment Checks** - Completed equipment tasks
- 👥 **Team Meetings** - Completed team meeting tasks
- ⏳ **Pending Tasks** - Tasks not yet completed

---

## 🎯 How It Works

### Dynamic Statistics Calculation

The stats are calculated **automatically** from your existing tasks table:

```javascript
// Training Sessions = Completed tasks with category 'training'
trainingSessions = tasks.filter(t => 
  t.status === 'completed' && t.category === 'training'
).length;

// Games Played = Completed tasks with category 'game'
gamesPlayed = tasks.filter(t => 
  t.status === 'completed' && t.category === 'game'
).length;

// Tasks Completed = All completed tasks
tasksCompleted = tasks.filter(t => 
  t.status === 'completed'
).length;
```

**No database changes needed!** The stats are calculated from existing data.

---

## 🗄️ Current Database Schema

Your existing `tasks` table already has everything needed:

```sql
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('training', 'game', 'equipment', 'team_meeting', 'other'),
    priority ENUM('low', 'medium', 'high'),
    status ENUM('pending', 'in_progress', 'completed'),
    due_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🚂 Railway Database Setup

### Step 1: Create Railway Account

1. Go to https://railway.app/
2. Click "Start a New Project"
3. Sign up with GitHub (recommended)

### Step 2: Create MySQL Database

1. Click "New Project"
2. Select "Provision MySQL"
3. Wait for database to be created
4. Click on the MySQL service

### Step 3: Get Database Credentials

In Railway MySQL dashboard, you'll see:

```
MYSQLHOST=containers-us-west-xxx.railway.app
MYSQLPORT=6379
MYSQLDATABASE=railway
MYSQLUSER=root
MYSQLPASSWORD=xxxxxxxxxxxxx
MYSQL_URL=mysql://root:xxxxx@containers-us-west-xxx.railway.app:6379/railway
```

### Step 4: Connect to Railway Database

**Option A: Using Railway CLI**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Connect to database
railway connect mysql
```

**Option B: Using MySQL Workbench**

1. Download MySQL Workbench
2. Create new connection:
   - Hostname: `containers-us-west-xxx.railway.app`
   - Port: `6379`
   - Username: `root`
   - Password: `[your password]`
3. Click "Test Connection"
4. Click "OK"

**Option C: Using phpMyAdmin Alternative**

Railway doesn't have phpMyAdmin, but you can use:
- **Adminer** (lightweight phpMyAdmin alternative)
- **DBeaver** (free database tool)
- **TablePlus** (modern database GUI)

### Step 5: Import Database Schema

**Using Railway CLI:**

```bash
# Connect to Railway MySQL
railway connect mysql

# Once connected, paste your SQL:
```

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    profile_picture VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_google_id (google_id)
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('training', 'game', 'equipment', 'team_meeting', 'other') DEFAULT 'other',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    due_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_due_date (due_date)
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
);
```

**Using MySQL Workbench:**

1. Open MySQL Workbench
2. Connect to Railway database
3. Click "File" → "Run SQL Script"
4. Select `server/database/database.sql`
5. Click "Run"

---

## 🔄 Update Production .env

Update your production `.env` with Railway credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Railway MySQL Database
DB_HOST=containers-us-west-xxx.railway.app
DB_USER=root
DB_PASSWORD=your_railway_password_here
DB_NAME=railway
DB_PORT=6379

# JWT Secret
JWT_SECRET=your_secure_jwt_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-app.onrender.com/auth/google/callback

# Frontend URL
CLIENT_URL=https://your-app.onrender.com

# Session Secret
SESSION_SECRET=your_secure_session_secret_here
```

---

## 📊 Testing Baseball Stats

### Step 1: Create Test Data

Create tasks with different categories:

```sql
-- Insert test user (if not exists)
INSERT INTO users (username, email, password) 
VALUES ('test_player', 'test@baseball.com', '$2b$10$hashedpassword');

-- Get user ID
SET @user_id = LAST_INSERT_ID();

-- Insert training sessions (completed)
INSERT INTO tasks (user_id, title, description, category, priority, status, due_date) VALUES
(@user_id, 'Batting Practice', 'Work on swing mechanics', 'training', 'high', 'completed', NOW()),
(@user_id, 'Pitching Drills', 'Fastball accuracy training', 'training', 'high', 'completed', NOW()),
(@user_id, 'Fielding Practice', 'Ground ball drills', 'training', 'medium', 'completed', NOW());

-- Insert games (completed)
INSERT INTO tasks (user_id, title, description, category, priority, status, due_date) VALUES
(@user_id, 'Game vs Yankees', 'Home game at 7 PM', 'game', 'high', 'completed', NOW()),
(@user_id, 'Game vs Red Sox', 'Away game', 'game', 'high', 'completed', NOW());

-- Insert equipment checks (completed)
INSERT INTO tasks (user_id, title, description, category, priority, status, due_date) VALUES
(@user_id, 'Check Baseball Glove', 'Oil and condition leather', 'equipment', 'medium', 'completed', NOW());

-- Insert team meetings (completed)
INSERT INTO tasks (user_id, title, description, category, priority, status, due_date) VALUES
(@user_id, 'Strategy Meeting', 'Discuss playoff tactics', 'team_meeting', 'medium', 'completed', NOW());

-- Insert pending tasks
INSERT INTO tasks (user_id, title, description, category, priority, status, due_date) VALUES
(@user_id, 'Upcoming Training', 'Next practice session', 'training', 'high', 'pending', DATE_ADD(NOW(), INTERVAL 1 DAY)),
(@user_id, 'Next Game', 'Championship game', 'game', 'high', 'pending', DATE_ADD(NOW(), INTERVAL 3 DAY));
```

### Step 2: Expected Dashboard Stats

After creating test data, your dashboard should show:

```
🏋️ Training Sessions: 3
⚾ Games Played: 2
✅ Tasks Completed: 7
🧤 Equipment Checks: 1
👥 Team Meetings: 1
⏳ Pending Tasks: 2
```

---

## 🔍 Verify Stats with SQL Queries

### Check Training Sessions
```sql
SELECT COUNT(*) as training_sessions 
FROM tasks 
WHERE user_id = YOUR_USER_ID 
  AND category = 'training' 
  AND status = 'completed';
```

### Check Games Played
```sql
SELECT COUNT(*) as games_played 
FROM tasks 
WHERE user_id = YOUR_USER_ID 
  AND category = 'game' 
  AND status = 'completed';
```

### Check All Completed Tasks
```sql
SELECT COUNT(*) as tasks_completed 
FROM tasks 
WHERE user_id = YOUR_USER_ID 
  AND status = 'completed';
```

### View All Stats at Once
```sql
SELECT 
  COUNT(CASE WHEN category = 'training' AND status = 'completed' THEN 1 END) as training_sessions,
  COUNT(CASE WHEN category = 'game' AND status = 'completed' THEN 1 END) as games_played,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as tasks_completed,
  COUNT(CASE WHEN category = 'equipment' AND status = 'completed' THEN 1 END) as equipment_checks,
  COUNT(CASE WHEN category = 'team_meeting' AND status = 'completed' THEN 1 END) as team_meetings,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_tasks
FROM tasks 
WHERE user_id = YOUR_USER_ID;
```

---

## 🚀 Deploy to Production

### Step 1: Update Environment Variables

In Render/Vercel/Netlify, add Railway database credentials:

```
DB_HOST=containers-us-west-xxx.railway.app
DB_USER=root
DB_PASSWORD=your_railway_password
DB_NAME=railway
DB_PORT=6379
```

### Step 2: Deploy Application

```bash
# Commit changes
git add .
git commit -m "Added baseball stats dashboard"
git push origin main

# Deploy automatically triggers
```

### Step 3: Test Production

1. Visit your production URL
2. Login or register
3. Create some tasks
4. Mark tasks as completed
5. Check dashboard for updated stats

---

## 📱 How Users See Stats Update

### Real-time Updates:

1. **User creates a task:**
   - Category: Training
   - Status: Pending
   - Dashboard shows: Pending Tasks +1

2. **User completes the task:**
   - Status changes to: Completed
   - Dashboard shows: 
     - Training Sessions +1
     - Tasks Completed +1
     - Pending Tasks -1

3. **User creates a game task:**
   - Category: Game
   - Status: Completed
   - Dashboard shows:
     - Games Played +1
     - Tasks Completed +1

---

## 🎯 Stats Calculation Logic

```javascript
// From Dashboard.js
const completedTasks = tasksData.filter(t => t.status === 'completed');

const stats = {
  trainingSessions: completedTasks.filter(t => t.category === 'training').length,
  gamesPlayed: completedTasks.filter(t => t.category === 'game').length,
  tasksCompleted: completedTasks.length,
  equipmentChecks: completedTasks.filter(t => t.category === 'equipment').length,
  teamMeetings: completedTasks.filter(t => t.category === 'team_meeting').length,
  pending: tasksData.filter(t => t.status === 'pending').length
};
```

---

## 🐛 Troubleshooting

### Stats Not Updating?

1. **Check browser console** (F12) for errors
2. **Verify tasks exist** in database
3. **Check task status** is 'completed'
4. **Refresh page** to reload data
5. **Clear browser cache**

### Database Connection Issues?

```bash
# Test Railway connection
railway connect mysql

# If fails, check:
# 1. Railway database is running
# 2. Credentials are correct
# 3. Firewall allows connection
```

### Stats Show Zero?

```sql
-- Check if tasks exist
SELECT * FROM tasks WHERE user_id = YOUR_USER_ID;

-- Check completed tasks
SELECT * FROM tasks WHERE user_id = YOUR_USER_ID AND status = 'completed';

-- Check categories
SELECT category, status, COUNT(*) as count 
FROM tasks 
WHERE user_id = YOUR_USER_ID 
GROUP BY category, status;
```

---

## 📊 Sample Data for Testing

Run this to populate your database with sample data:

```sql
-- Replace YOUR_USER_ID with your actual user ID
SET @user_id = YOUR_USER_ID;

-- Training sessions
INSERT INTO tasks (user_id, title, category, status) VALUES
(@user_id, 'Morning Batting Practice', 'training', 'completed'),
(@user_id, 'Afternoon Pitching Drills', 'training', 'completed'),
(@user_id, 'Evening Fielding Practice', 'training', 'completed'),
(@user_id, 'Speed Training', 'training', 'completed'),
(@user_id, 'Strength Training', 'training', 'completed');

-- Games
INSERT INTO tasks (user_id, title, category, status) VALUES
(@user_id, 'Championship Game', 'game', 'completed'),
(@user_id, 'Practice Match', 'game', 'completed'),
(@user_id, 'Tournament Final', 'game', 'completed');

-- Equipment
INSERT INTO tasks (user_id, title, category, status) VALUES
(@user_id, 'Glove Maintenance', 'equipment', 'completed'),
(@user_id, 'Bat Inspection', 'equipment', 'completed');

-- Team Meetings
INSERT INTO tasks (user_id, title, category, status) VALUES
(@user_id, 'Strategy Session', 'team_meeting', 'completed');
```

Expected result:
- 🏋️ Training Sessions: 5
- ⚾ Games Played: 3
- ✅ Tasks Completed: 11
- 🧤 Equipment Checks: 2
- 👥 Team Meetings: 1

---

## 🎉 Summary

✅ **No database schema changes needed**
✅ **Stats calculated automatically from existing data**
✅ **Works with current tasks table**
✅ **Real-time updates when tasks change**
✅ **Railway database setup guide included**
✅ **Sample data for testing provided**

**Your baseball stats are now live and dynamic!** 🏋️⚾✅

---

## 📞 Need Help?

- **Railway Docs:** https://docs.railway.app/
- **MySQL Docs:** https://dev.mysql.com/doc/
- **Check server logs** for database connection errors
- **Test locally first** before deploying to production

Enjoy your dynamic baseball statistics dashboard! ⚾📊🎉
