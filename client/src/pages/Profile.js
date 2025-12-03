import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import OnboardingTutorial from '../components/OnboardingTutorial';
import AchievementsModal from '../components/AchievementsModal';
import './Profile.css';

const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

function Profile({ setAuth }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    pushUps: 0,
    pullUps: 0,
    squats: 0,
    core: 0,
    stretching: 0,
    tasksCompleted: 0,
    totalTasks: 0,
    totalReps: 0
  });
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchUserStats();
      } catch (error) {
        console.error('Profile: Error parsing user data:', error);
        setLoading(false);
      }
    } else {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const decodedUser = {
            id: payload.id,
            username: payload.username,
            email: payload.email
          };
          setUser(decodedUser);
          localStorage.setItem('user', JSON.stringify(decodedUser));
          fetchUserStats();
        } catch (error) {
          console.error('Profile: Error decoding token:', error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
  }, []);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const tasks = response.data;
      const completedTasks = tasks.filter(t => t.status === 'completed');
      
      const pushUps = completedTasks.filter(t => t.category === 'push-ups').length;
      const pullUps = completedTasks.filter(t => t.category === 'pull-ups').length;
      const squats = completedTasks.filter(t => t.category === 'squats').length;
      const core = completedTasks.filter(t => t.category === 'core').length;
      const stretching = completedTasks.filter(t => t.category === 'stretching').length;
      
      setStats({
        pushUps,
        pullUps,
        squats,
        core,
        stretching,
        tasksCompleted: completedTasks.length,
        totalTasks: tasks.length,
        totalReps: (pushUps + pullUps + squats + core) * 10
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: '#FFD700',
        fontSize: '1.5rem',
        background: '#000'
      }}>
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: '#FFD700',
        fontSize: '1.5rem',
        flexDirection: 'column',
        gap: '20px',
        background: '#000'
      }}>
        <p>No user data found</p>
        <button 
          onClick={() => window.location.href = '/login'}
          style={{
            padding: '12px 24px',
            background: '#FFD700',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar setAuth={setAuth} />
      
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.profile_picture ? (
                <img src={user.profile_picture} alt={user.username} />
              ) : (
                <div className="avatar-placeholder">
                  {user.username ? user.username.charAt(0).toUpperCase() : '💪'}
                </div>
              )}
            </div>
            <h1>💪 {user.username || 'Athlete'}</h1>
            <p>📧 {user.email || 'No email'}</p>
          </div>

          <div className="profile-info">
            <h2>📋 Account Information</h2>
            
            <div className="info-row">
              <span className="info-label">👤 Username</span>
              <span className="info-value">{user.username || 'N/A'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">📧 Email</span>
              <span className="info-value">{user.email || 'N/A'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">🔐 Account Type</span>
              <span className="info-value">
                {user.google_id ? '🔵 Google Account' : '🟢 Local Account'}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">🆔 User ID</span>
              <span className="info-value">#{user.id || 'N/A'}</span>
            </div>
          </div>

          <div className="profile-stats">
            <h2>💪 Calisthenics Stats</h2>
            <p>Track your bodyweight training progress and achievements</p>
            <div className="stats-grid-profile">
              <div className="stat-item highlight clickable" onClick={() => setShowAchievements(true)} title="Click to view achievements">
                <span className="stat-icon">🔥</span>
                <span className="stat-number">{stats.totalReps}</span>
                <span className="stat-label">Total Reps</span>
                <span className="stat-badge">🏆</span>
              </div>
              <div className="stat-item highlight clickable" onClick={() => setShowAchievements(true)} title="Click to view achievements">
                <span className="stat-icon">💪</span>
                <span className="stat-number">{stats.pushUps}</span>
                <span className="stat-label">Push-up Sessions</span>
                <span className="stat-badge">🏆</span>
              </div>
              <div className="stat-item highlight clickable" onClick={() => setShowAchievements(true)} title="Click to view achievements">
                <span className="stat-icon">🏋️</span>
                <span className="stat-number">{stats.pullUps}</span>
                <span className="stat-label">Pull-up Sessions</span>
                <span className="stat-badge">🏆</span>
              </div>
              <div className="stat-item clickable" onClick={() => setShowAchievements(true)} title="Click to view achievements">
                <span className="stat-icon">🦵</span>
                <span className="stat-number">{stats.squats}</span>
                <span className="stat-label">Squat Sessions</span>
                <span className="stat-badge">🏆</span>
              </div>
              <div className="stat-item clickable" onClick={() => setShowAchievements(true)} title="Click to view achievements">
                <span className="stat-icon">🎯</span>
                <span className="stat-number">{stats.core}</span>
                <span className="stat-label">Core Workouts</span>
                <span className="stat-badge">🏆</span>
              </div>
              <div className="stat-item clickable" onClick={() => setShowAchievements(true)} title="Click to view achievements">
                <span className="stat-icon">🧘</span>
                <span className="stat-number">{stats.stretching}</span>
                <span className="stat-label">Stretching</span>
                <span className="stat-badge">🏆</span>
              </div>
              <div className="stat-item clickable" onClick={() => setShowAchievements(true)} title="Click to view achievements">
                <span className="stat-icon">✅</span>
                <span className="stat-number">{stats.tasksCompleted}</span>
                <span className="stat-label">Workouts Done</span>
                <span className="stat-badge">🏆</span>
              </div>
              <div className="stat-item clickable" onClick={() => setShowAchievements(true)} title="Click to view achievements">
                <span className="stat-icon">📋</span>
                <span className="stat-number">{stats.totalTasks}</span>
                <span className="stat-label">Total Workouts</span>
                <span className="stat-badge">🏆</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button 
              className="btn-tutorial" 
              onClick={() => {
                localStorage.removeItem('hasSeenTutorial');
                setShowOnboarding(true);
              }}
            >
              📚 Restart Tutorial
            </button>
          </div>
        </div>
      </div>

      {showOnboarding && <OnboardingTutorial onComplete={() => setShowOnboarding(false)} />}
      {showAchievements && <AchievementsModal isOpen={showAchievements} onClose={() => setShowAchievements(false)} stats={stats} />}
    </div>
  );
}

export default Profile;
