import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import OnboardingTutorial from '../components/OnboardingTutorial';
import AchievementsModal from '../components/AchievementsModal';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

function Dashboard({ setAuth }) {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    
    // Check if user is new (no tasks and hasn't seen tutorial)
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setShowOnboarding(true);
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const tasksData = response.data;
      setTasks(tasksData);
      
      // Calculate baseball-specific statistics
      const completedTasks = tasksData.filter(t => t.status === 'completed');
      const trainingSessions = completedTasks.filter(t => t.category === 'training').length;
      const gamesPlayed = completedTasks.filter(t => t.category === 'game').length;
      const tasksCompleted = completedTasks.length;
      
      setStats({
        total: tasksData.length,
        pending: tasksData.filter(t => t.status === 'pending').length,
        completed: tasksCompleted,
        trainingSessions: trainingSessions,
        gamesPlayed: gamesPlayed,
        equipmentChecks: completedTasks.filter(t => t.category === 'equipment').length,
        teamMeetings: completedTasks.filter(t => t.category === 'team_meeting').length
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingTasks = tasks
    .filter(t => t.status !== 'completed')
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);

  return (
    <div className="dashboard">
      {showOnboarding && <OnboardingTutorial onComplete={() => setShowOnboarding(false)} />}
      <Navbar setAuth={setAuth} />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>⚾ Baseball Dashboard</h1>
          <p>Manage your training, games, and equipment</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card highlight clickable" onClick={() => setShowAchievements(true)} title="Click to view achievements">
            <div className="stat-icon">🏋️</div>
            <div className="stat-info">
              <h3>{stats.trainingSessions || 0}</h3>
              <p>Training Sessions</p>
            </div>
            <div className="stat-badge">🏆</div>
          </div>

          <div className="stat-card highlight clickable" onClick={() => setShowAchievements(true)} title="Click to view achievements">
            <div className="stat-icon">⚾</div>
            <div className="stat-info">
              <h3>{stats.gamesPlayed || 0}</h3>
              <p>Games Played</p>
            </div>
            <div className="stat-badge">🏆</div>
          </div>

          <div className="stat-card highlight clickable" onClick={() => setShowAchievements(true)} title="Click to view achievements">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.completed || 0}</h3>
              <p>Tasks Completed</p>
            </div>
            <div className="stat-badge">🏆</div>
          </div>

          <div className="stat-card clickable" onClick={() => setShowAchievements(true)} title="Click to view achievements">
            <div className="stat-icon">🧤</div>
            <div className="stat-info">
              <h3>{stats.equipmentChecks || 0}</h3>
              <p>Equipment Checks</p>
            </div>
            <div className="stat-badge">🏆</div>
          </div>

          <div className="stat-card clickable" onClick={() => setShowAchievements(true)} title="Click to view achievements">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.teamMeetings || 0}</h3>
              <p>Team Meetings</p>
            </div>
            <div className="stat-badge">🏆</div>
          </div>

          <div className="stat-card" onClick={() => navigate('/tasks')} title="Click to view tasks">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{stats.pending || 0}</h3>
              <p>Pending Tasks</p>
            </div>
          </div>
        </div>

        <div className="upcoming-section">
          <h2>Upcoming Tasks</h2>
          {loading ? (
            <p>Loading...</p>
          ) : upcomingTasks.length > 0 ? (
            <div className="task-list">
              {upcomingTasks.map(task => (
                <div key={task.id} className="task-item">
                  <div className="task-category">{getCategoryIcon(task.category)}</div>
                  <div className="task-details">
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <span className="task-date">
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                    </span>
                  </div>
                  <span className={`task-priority priority-${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>No upcoming tasks</p>
          )}
        </div>

        <button className="btn-view-all" onClick={() => navigate('/tasks')}>
          View All Tasks
        </button>
      </div>

      {showOnboarding && <OnboardingTutorial onComplete={() => setShowOnboarding(false)} />}
      {showAchievements && <AchievementsModal isOpen={showAchievements} onClose={() => setShowAchievements(false)} stats={stats} />}
    </div>
  );
}

function getCategoryIcon(category) {
  const icons = {
    training: '🏋️',
    game: '⚾',
    equipment: '🧤',
    team_meeting: '👥',
    other: '📌'
  };
  return icons[category] || icons.other;
}

export default Dashboard;
