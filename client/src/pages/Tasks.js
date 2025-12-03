import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import TaskModal from '../components/TaskModal';
import './Tasks.css';

const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

function Tasks({ setAuth }) {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pushUps: 0,
    pullUps: 0,
    squats: 0,
    core: 0,
    stretching: 0,
    completed: 0,
    total: 0
  });

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  useEffect(() => {
    filterTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, filter]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/tasks/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filterTasks = () => {
    if (filter === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(t => t.status === filter));
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this workout?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
      fetchStats();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleSaveTask = () => {
    setShowModal(false);
    fetchTasks();
    fetchStats();
  };

  return (
    <div className="tasks-page">
      <Navbar setAuth={setAuth} />
      
      <div className="tasks-content">
        <div className="tasks-header">
          <h1>💪 My Workouts</h1>
          <button className="btn-create" onClick={handleCreateTask}>
            + New Workout
          </button>
        </div>

        <div className="calisthenics-stats-summary">
          <div className="stat-box">
            <div className="stat-icon">💪</div>
            <div className="stat-value">{stats.pushUps || 0}</div>
            <div className="stat-label">Push-ups</div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">🏋️</div>
            <div className="stat-value">{stats.pullUps || 0}</div>
            <div className="stat-label">Pull-ups</div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">🦵</div>
            <div className="stat-value">{stats.squats || 0}</div>
            <div className="stat-label">Squats</div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">🎯</div>
            <div className="stat-value">{stats.core || 0}</div>
            <div className="stat-label">Core</div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{stats.completed || 0}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{stats.total || 0}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>

        <div className="filter-tabs">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''} 
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={filter === 'in_progress' ? 'active' : ''} 
            onClick={() => setFilter('in_progress')}
          >
            In Progress
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''} 
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        {loading ? (
          <p>Loading workouts...</p>
        ) : filteredTasks.length > 0 ? (
          <div className="tasks-grid">
            {filteredTasks.map(task => (
              <div key={task.id} className="task-card">
                <div className="task-card-header">
                  <span className="task-category-badge">
                    {getCategoryIcon(task.category)} {formatCategory(task.category)}
                  </span>
                  <span className={`priority-badge priority-${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
                
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                
                <div className="task-meta">
                  <span className={`status-badge status-${task.status}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className="task-date">
                    {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                  </span>
                </div>

                <div className="task-actions">
                  <button onClick={() => handleEditTask(task)} className="btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteTask(task.id)} className="btn-delete">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-tasks">No workouts found. Start your fitness journey! 💪</p>
        )}
      </div>

      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={() => setShowModal(false)}
          onSave={handleSaveTask}
        />
      )}
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

function formatCategory(category) {
  const names = {
    'push-ups': 'Push-ups',
    'pull-ups': 'Pull-ups',
    'squats': 'Squats',
    'core': 'Core',
    'stretching': 'Stretching',
    'other': 'Other'
  };
  return names[category] || category;
}

export default Tasks;
