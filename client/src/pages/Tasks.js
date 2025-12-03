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
    trainingSessions: 0,
    gamesPlayed: 0,
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
    if (!window.confirm('Delete this task?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
      fetchStats(); // Refresh stats after deleting
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleSaveTask = () => {
    setShowModal(false);
    fetchTasks();
    fetchStats(); // Refresh stats after saving
  };

  return (
    <div className="tasks-page">
      <Navbar setAuth={setAuth} />
      
      <div className="tasks-content">
        <div className="tasks-header">
          <h1>⚾ My Tasks</h1>
          <button className="btn-create" onClick={handleCreateTask}>
            + New Task
          </button>
        </div>

        <div className="baseball-stats-summary">
          <div className="stat-box">
            <div className="stat-icon">🏋️</div>
            <div className="stat-value">{stats.trainingSessions}</div>
            <div className="stat-label">Training Sessions</div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">⚾</div>
            <div className="stat-value">{stats.gamesPlayed}</div>
            <div className="stat-label">Games Played</div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Tasks Completed</div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Tasks</div>
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
          <p>Loading tasks...</p>
        ) : filteredTasks.length > 0 ? (
          <div className="tasks-grid">
            {filteredTasks.map(task => (
              <div key={task.id} className="task-card">
                <div className="task-card-header">
                  <span className="task-category-badge">
                    {getCategoryIcon(task.category)} {task.category}
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
          <p className="no-tasks">No tasks found</p>
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
    training: '🏋️',
    game: '⚾',
    equipment: '🧤',
    team_meeting: '👥',
    other: '📌'
  };
  return icons[category] || icons.other;
}

export default Tasks;
