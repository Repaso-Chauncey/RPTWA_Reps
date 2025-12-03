# ⚾ Baseball PWA - Full-Stack Progressive Web Application

A baseball-themed task management Progressive Web App with secure authentication, offline support, and real-time updates.

## Features

- ✅ User Registration & Login (Local + Google OAuth 2.0)
- ✅ Create, Edit, Delete Tasks (Baseball-themed categories)
- ✅ PWA with Offline Support
- ✅ Installable on Desktop & Mobile
- ✅ 4+ Pages (Login, Register, Dashboard, Tasks, Profile)
- ✅ RESTful API with Express
- ✅ MySQL Database (XAMPP/phpMyAdmin)

## Tech Stack

### Frontend
- React 18
- React Router v6
- Axios
- Service Workers (PWA)
- Workbox

### Backend
- Node.js
- Express.js
- MySQL2
- JWT Authentication
- Passport.js (Google OAuth)
- bcrypt

### Database
- MySQL (via XAMPP)

## Installation

### 1. Database Setup (XAMPP)

1. Start XAMPP and run MySQL
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Create a new database or import the SQL:
   - Click "SQL" tab
   - Copy and paste the contents of `database.sql`
   - Click "Go"

### 2. Backend Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# - Set JWT_SECRET
# - Configure Google OAuth credentials
# - Verify MySQL settings

# Start server
npm run server
```

### 3. Frontend Setup

```bash
# Navigate to client folder
cd client

# Install dependencies
npm install

# Create .env file
echo REACT_APP_API_URL=http://localhost:5000 > .env

# Start React app
npm start
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/auth/google/callback`
6. Copy Client ID and Secret to `.env` file

## Running the Application

```bash
# Run both server and client concurrently
npm run dev

# Or run separately:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
cd client && npm start
```

Access the app at: http://localhost:3000

## PWA Installation

1. Open the app in Chrome/Edge
2. Click the install icon in the address bar
3. Or use browser menu: "Install Baseball PWA"
4. App will be installed and work offline!

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - OAuth callback

### Tasks (Protected)
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Task Categories

- 🏋️ Training - Practice sessions
- ⚾ Game - Scheduled matches
- 🧤 Equipment - Gear maintenance
- 👥 Team Meeting - Strategy discussions
- 📌 Other - General tasks

## Database Schema

### users
- id, username, email, password, google_id, profile_picture, created_at, updated_at

### tasks
- id, user_id, title, description, category, priority, status, due_date, created_at, updated_at

### sessions
- id, user_id, token, expires_at, created_at

## Offline Support

The app uses Service Workers to cache:
- Static assets (HTML, CSS, JS)
- API responses
- Images and icons

Works offline after first visit!

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- CORS configuration
- Session management
- SQL injection prevention

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## License

MIT

## Author

Baseball PWA Team
