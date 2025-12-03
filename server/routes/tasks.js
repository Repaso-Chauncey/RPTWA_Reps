const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Get user stats
router.get('/stats', async (req, res) => {
  try {
    const [tasks] = await db.query(
      'SELECT category, status FROM tasks WHERE user_id = ?',
      [req.user.id]
    );

    const completedTasks = tasks.filter(t => t.status === 'completed');
    
    const stats = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: completedTasks.length,
      trainingSessions: completedTasks.filter(t => t.category === 'training').length,
      gamesPlayed: completedTasks.filter(t => t.category === 'game').length,
      equipmentChecks: completedTasks.filter(t => t.category === 'equipment').length,
      teamMeetings: completedTasks.filter(t => t.category === 'team_meeting').length
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get all tasks for user
router.get('/', async (req, res) => {
  try {
    const [tasks] = await db.query(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC, created_at DESC',
      [req.user.id]
    );
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    const { title, description, category, priority, status, due_date } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const [result] = await db.query(
      'INSERT INTO tasks (user_id, title, description, category, priority, status, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, title, description, category || 'other', priority || 'medium', status || 'pending', due_date]
    );

    const [task] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    
    // Real-time notification
    const io = req.app.get('io');
    io.to(`user_${req.user.id}`).emit('task_created', task[0]);
    
    res.status(201).json(task[0]);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, priority, status, due_date } = req.body;

    const [existing] = await db.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await db.query(
      'UPDATE tasks SET title = ?, description = ?, category = ?, priority = ?, status = ?, due_date = ? WHERE id = ?',
      [title, description, category, priority, status, due_date, id]
    );

    const [task] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    
    // Real-time notification
    const io = req.app.get('io');
    io.to(`user_${req.user.id}`).emit('task_updated', task[0]);
    
    res.json(task[0]);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    
    // Real-time notification
    const io = req.app.get('io');
    io.to(`user_${req.user.id}`).emit('task_deleted', { id });
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
