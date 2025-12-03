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
      
      // Calculate calisthenics-specific statistics
      const completedTasks = tasksData.filter(t => t.status === 'completed');
      const pushUps = completedTasks.filter(t => t.category === 'push-ups').length;
      const pullUps = completedTasks.filter(t => t.category === 'pull-ups').length;
      const squats = completedTasks.filter(t => t.category === 'squats').length;
      const core = completedTasks.filter(t => t.category === 'core').length;
      const stretching = completedTasks.filter(t => t.category === 'stretching').length;
      const tasksCompleted = completedTasks.length;
      
      setStats({
        total: tasksData.length,
        pending: tasksData.filter(t => t.status === 'pending').length,
        completed: tasksCompleted,
        pushUps: pushUps,
        pullUps: pullUps,
        squats: squats,
        core: core,
        stretching: stretching,
        totalReps: (pushUps + pullUps + squats + core) * 10 // Estimated reps
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
          <h1>💪 Calisthenics Dashboard</h1>
          <p>Track your bodyweight training progress</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card highlight clickable" onClick={() => setShowAchievements(true)} title="Click to view achievements">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <h3>{stats.totalReps || 0}</h3>
              <p>Total Reps</p>
            </div>
            <div className="stat-badge">🏆</div>
          </div>

          <div className="stat-card highlight clickable" onClick={() => setShowAchievements(true)} title="Click to view achievements">
            <div className="stat-icon">💪</div>
            <div className="stat-info">
              <h3>{stats.pushUps || 0}</h3>
              <p>Push-up Sessions</p>
            </div>
            <div className="stat-badge">🏆</div>
          </div>

          <div className="stat-card highlight clickable" onClick={() => setShowAchievements(true)} title="Click to view achievements">
            <div className="stat-icon">🏋️</div>
            <div className="stat-info">
              <h3>{stats.pullUps || 0}</h3>
              <p>Pull-up Sessions</p>
            </div>
            <div className="stat-badge">🏆</div>
          </div>

          <div className="stat-card clickable" onClick={() => setShowAchievements(true)} title="Click to view achievements">
            <div className="stat-icon">🦵</div>
            <div className="stat-info">
              <h3>{stats.squats || 0}</h3>
              <p>Squat Sessions</p>
            </div>
            <div className="stat-badge">🏆</div>
          </div>

          <div className="stat-card clickable" onClick={() => setShowAchievements(true)} title="Click to view achievements">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <h3>{stats.core || 0}</h3>
              <p>Core Workouts</p>
            </div>
            <div className="stat-badge">🏆</div>
          </div>

          <div className="stat-card clickable" onClick={() => setShowAchievements(true)} title="Click to view achievements">
            <div className="stat-icon">🧘</div>
            <div className="stat-info">
              <h3>{stats.stretching || 0}</h3>
              <p>Stretching Sessions</p>
            </div>
            <div className="stat-badge">🏆</div>
          </div>

          <div className="stat-card clickable" onClick={() => setShowAchievements(true)} title="Click to view achievements">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.completed || 0}</h3>
              <p>Workouts Done</p>
            </div>
            <div className="stat-badge">🏆</div>
          </div>

          <div className="stat-card" onClick={() => navigate('/tasks')} title="Click to view workouts">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{stats.pending || 0}</h3>
              <p>Pending Workouts</p>
            </div>
          </div>
        </div>

        <div className="upcoming-section">
          <h2>🗓️ Upcoming Workouts</h2>
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
            <p>No upcoming workouts. Time to create one! 💪</p>
          )}
        </div>

        <button className="btn-view-all" onClick={() => navigate('/tasks')}>
          <span>View All Workouts</span>
        </button>
      </div>

      {showOnboarding && <OnboardingTutorial onComplete={() => setShowOnboarding(false)} />}
      {showAchievements && <AchievementsModal isOpen={showAchievements} onClose={() => setShowAchievements(false)} stats={stats} />}
    </div>
  );
}

function getCategoryIcon(category) {
  const icons = {
    'push-ups': '💪',
    'pull-ups': '🏋️',
    'squats': '🦵',
    'core': '🎯',
    'stretching': '🧘',
    'other': '📌'
  };
  return icons[category] || icons.other;
}

export default Dashboard;
