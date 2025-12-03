import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AchievementsModal.css';

const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

function AchievementsModal({ isOpen, onClose, stats }) {
  const [achievements, setAchievements] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      calculateAchievements();
      fetchRecentActivities();
    }
  }, [isOpen, stats]);

  const calculateAchievements = () => {
    const allAchievements = [
      // Training Achievements
      {
        id: 'training_1',
        title: 'First Steps',
        description: 'Complete your first training session',
        icon: '🥉',
        category: 'training',
        requirement: 1,
        current: stats.trainingSessions || 0,
        unlocked: (stats.trainingSessions || 0) >= 1
      },
      {
        id: 'training_5',
        title: 'Getting Started',
        description: 'Complete 5 training sessions',
        icon: '🏃',
        category: 'training',
        requirement: 5,
        current: stats.trainingSessions || 0,
        unlocked: (stats.trainingSessions || 0) >= 5
      },
      {
        id: 'training_10',
        title: 'Dedicated Trainer',
        description: 'Complete 10 training sessions',
        icon: '💪',
        category: 'training',
        requirement: 10,
        current: stats.trainingSessions || 0,
        unlocked: (stats.trainingSessions || 0) >= 10
      },
      {
        id: 'training_25',
        title: 'Training Master',
        description: 'Complete 25 training sessions',
        icon: '🥈',
        category: 'training',
        requirement: 25,
        current: stats.trainingSessions || 0,
        unlocked: (stats.trainingSessions || 0) >= 25
      },
      {
        id: 'training_50',
        title: 'Elite Athlete',
        description: 'Complete 50 training sessions',
        icon: '🥇',
        category: 'training',
        requirement: 50,
        current: stats.trainingSessions || 0,
        unlocked: (stats.trainingSessions || 0) >= 50
      },
      
      // Game Achievements
      {
        id: 'game_1',
        title: 'First Game',
        description: 'Play your first game',
        icon: '⚾',
        category: 'game',
        requirement: 1,
        current: stats.gamesPlayed || 0,
        unlocked: (stats.gamesPlayed || 0) >= 1
      },
      {
        id: 'game_5',
        title: 'Regular Player',
        description: 'Play 5 games',
        icon: '🎮',
        category: 'game',
        requirement: 5,
        current: stats.gamesPlayed || 0,
        unlocked: (stats.gamesPlayed || 0) >= 5
      },
      {
        id: 'game_10',
        title: 'Game Veteran',
        description: 'Play 10 games',
        icon: '🏆',
        category: 'game',
        requirement: 10,
        current: stats.gamesPlayed || 0,
        unlocked: (stats.gamesPlayed || 0) >= 10
      },
      {
        id: 'game_25',
        title: 'Championship Player',
        description: 'Play 25 games',
        icon: '👑',
        category: 'game',
        requirement: 25,
        current: stats.gamesPlayed || 0,
        unlocked: (stats.gamesPlayed || 0) >= 25
      },
      
      // Task Achievements
      {
        id: 'task_1',
        title: 'Task Starter',
        description: 'Complete your first task',
        icon: '✅',
        category: 'task',
        requirement: 1,
        current: stats.tasksCompleted || 0,
        unlocked: (stats.tasksCompleted || 0) >= 1
      },
      {
        id: 'task_10',
        title: 'Productive',
        description: 'Complete 10 tasks',
        icon: '📝',
        category: 'task',
        requirement: 10,
        current: stats.tasksCompleted || 0,
        unlocked: (stats.tasksCompleted || 0) >= 10
      },
      {
        id: 'task_25',
        title: 'Task Master',
        description: 'Complete 25 tasks',
        icon: '🎯',
        category: 'task',
        requirement: 25,
        current: stats.tasksCompleted || 0,
        unlocked: (stats.tasksCompleted || 0) >= 25
      },
      {
        id: 'task_50',
        title: 'Overachiever',
        description: 'Complete 50 tasks',
        icon: '🌟',
        category: 'task',
        requirement: 50,
        current: stats.tasksCompleted || 0,
        unlocked: (stats.tasksCompleted || 0) >= 50
      },
      {
        id: 'task_100',
        title: 'Century Club',
        description: 'Complete 100 tasks',
        icon: '💯',
        category: 'task',
        requirement: 100,
        current: stats.tasksCompleted || 0,
        unlocked: (stats.tasksCompleted || 0) >= 100
      },
      
      // Equipment Achievements
      {
        id: 'equipment_1',
        title: 'Gear Guardian',
        description: 'Complete your first equipment check',
        icon: '🧤',
        category: 'equipment',
        requirement: 1,
        current: stats.equipmentChecks || 0,
        unlocked: (stats.equipmentChecks || 0) >= 1
      },
      {
        id: 'equipment_5',
        title: 'Equipment Expert',
        description: 'Complete 5 equipment checks',
        icon: '🛠️',
        category: 'equipment',
        requirement: 5,
        current: stats.equipmentChecks || 0,
        unlocked: (stats.equipmentChecks || 0) >= 5
      },
      {
        id: 'equipment_10',
        title: 'Maintenance Master',
        description: 'Complete 10 equipment checks',
        icon: '🔧',
        category: 'equipment',
        requirement: 10,
        current: stats.equipmentChecks || 0,
        unlocked: (stats.equipmentChecks || 0) >= 10
      },
      
      // Team Meeting Achievements
      {
        id: 'meeting_1',
        title: 'Team Player',
        description: 'Attend your first team meeting',
        icon: '👥',
        category: 'meeting',
        requirement: 1,
        current: stats.teamMeetings || 0,
        unlocked: (stats.teamMeetings || 0) >= 1
      },
      {
        id: 'meeting_5',
        title: 'Active Member',
        description: 'Attend 5 team meetings',
        icon: '🤝',
        category: 'meeting',
        requirement: 5,
        current: stats.teamMeetings || 0,
        unlocked: (stats.teamMeetings || 0) >= 5
      },
      {
        id: 'meeting_10',
        title: 'Team Leader',
        description: 'Attend 10 team meetings',
        icon: '👔',
        category: 'meeting',
        requirement: 10,
        current: stats.teamMeetings || 0,
        unlocked: (stats.teamMeetings || 0) >= 10
      }
    ];

    setAchievements(allAchievements);
    setLoading(false);
  };

  const fetchRecentActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const completedTasks = response.data
        .filter(t => t.status === 'completed')
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 10);
      
      setRecentActivities(completedTasks);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      training: '🏋️',
      game: '⚾',
      equipment: '🧤',
      team_meeting: '👥',
      other: '📌'
    };
    return icons[category] || icons.other;
  };

  const getProgressPercentage = (current, requirement) => {
    return Math.min((current / requirement) * 100, 100);
  };

  if (!isOpen) return null;

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="achievements-modal-overlay" onClick={onClose}>
      <div className="achievements-modal" onClick={(e) => e.stopPropagation()}>
        <div className="achievements-header">
          <h2>🏆 Achievements & Progress</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="achievements-summary">
          <div className="summary-card">
            <span className="summary-icon">🏆</span>
            <div className="summary-info">
              <h3>{unlockedAchievements.length}</h3>
              <p>Unlocked</p>
            </div>
          </div>
          <div className="summary-card">
            <span className="summary-icon">🔒</span>
            <div className="summary-info">
              <h3>{lockedAchievements.length}</h3>
              <p>Locked</p>
            </div>
          </div>
          <div className="summary-card">
            <span className="summary-icon">📊</span>
            <div className="summary-info">
              <h3>{Math.round((unlockedAchievements.length / achievements.length) * 100)}%</h3>
              <p>Complete</p>
            </div>
          </div>
        </div>

        <div className="achievements-content">
          {/* Unlocked Achievements */}
          {unlockedAchievements.length > 0 && (
            <div className="achievements-section">
              <h3>✅ Unlocked Achievements</h3>
              <div className="achievements-grid">
                {unlockedAchievements.map(achievement => (
                  <div key={achievement.id} className="achievement-card unlocked">
                    <div className="achievement-icon">{achievement.icon}</div>
                    <div className="achievement-info">
                      <h4>{achievement.title}</h4>
                      <p>{achievement.description}</p>
                      <div className="achievement-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill complete" 
                            style={{ width: '100%' }}
                          ></div>
                        </div>
                        <span className="progress-text">
                          {achievement.current}/{achievement.requirement} ✓
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locked Achievements */}
          {lockedAchievements.length > 0 && (
            <div className="achievements-section">
              <h3>🔒 Locked Achievements</h3>
              <div className="achievements-grid">
                {lockedAchievements.map(achievement => (
                  <div key={achievement.id} className="achievement-card locked">
                    <div className="achievement-icon grayscale">{achievement.icon}</div>
                    <div className="achievement-info">
                      <h4>{achievement.title}</h4>
                      <p>{achievement.description}</p>
                      <div className="achievement-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${getProgressPercentage(achievement.current, achievement.requirement)}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">
                          {achievement.current}/{achievement.requirement}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activities */}
          {recentActivities.length > 0 && (
            <div className="achievements-section">
              <h3>📋 Recent Completed Activities</h3>
              <div className="activities-list">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <span className="activity-icon">{getCategoryIcon(activity.category)}</span>
                    <div className="activity-details">
                      <h4>{activity.title}</h4>
                      <p>{activity.description || 'No description'}</p>
                      <span className="activity-date">
                        {new Date(activity.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`activity-category ${activity.category}`}>
                      {activity.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AchievementsModal;
