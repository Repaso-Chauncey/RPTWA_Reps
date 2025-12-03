const mysql = require('mysql2/promise');

async function addSampleData() {
  const connection = await mysql.createConnection({
    host: 'caboose.proxy.rlwy.net',
    port: 49462,
    user: 'root',
    password: 'XWPwGRdVBYtdgQsdBewACpVcRraSpEgc',
    database: 'railway'
  });

  console.log('✅ Connected to Railway MySQL!');

  // Get the first user (or specify your user ID)
  const [users] = await connection.query('SELECT id, username FROM users LIMIT 1');
  
  if (users.length === 0) {
    console.log('❌ No users found. Please create a user account first.');
    await connection.end();
    return;
  }

  const userId = users[0].id;
  console.log(`📝 Adding sample tasks for user: ${users[0].username} (ID: ${userId})`);

  // Sample tasks data
  const sampleTasks = [
    // Completed training sessions
    { title: 'Morning Batting Practice', description: 'Work on swing mechanics and timing', category: 'training', priority: 'high', status: 'completed', daysAgo: 1 },
    { title: 'Pitching Drills', description: 'Focus on fastball accuracy and control', category: 'training', priority: 'medium', status: 'completed', daysAgo: 2 },
    { title: 'Cardio Training', description: 'Run 3 miles for endurance', category: 'training', priority: 'medium', status: 'completed', daysAgo: 3 },
    { title: 'Fielding Practice', description: 'Ground balls and fly balls', category: 'training', priority: 'high', status: 'completed', daysAgo: 4 },
    { title: 'Strength Training', description: 'Upper body workout at gym', category: 'training', priority: 'medium', status: 'completed', daysAgo: 5 },
    
    // Completed games
    { title: 'Home Game vs Tigers', description: 'Championship game - must win!', category: 'game', priority: 'high', status: 'completed', daysAgo: 1 },
    { title: 'Away Game vs Bears', description: 'Regular season match', category: 'game', priority: 'medium', status: 'completed', daysAgo: 3 },
    { title: 'Practice Game vs Juniors', description: 'Friendly scrimmage', category: 'game', priority: 'low', status: 'completed', daysAgo: 5 },
    
    // Completed equipment checks
    { title: 'Check Glove Condition', description: 'Inspect and oil baseball glove', category: 'equipment', priority: 'low', status: 'completed', daysAgo: 2 },
    { title: 'Replace Bat Grip', description: 'Old grip is worn out and slippery', category: 'equipment', priority: 'medium', status: 'completed', daysAgo: 4 },
    { title: 'Clean Cleats', description: 'Remove mud and dirt from cleats', category: 'equipment', priority: 'low', status: 'completed', daysAgo: 6 },
    
    // Completed team meetings
    { title: 'Pre-Season Team Meeting', description: 'Discuss goals and strategy', category: 'team_meeting', priority: 'high', status: 'completed', daysAgo: 7 },
    { title: 'Coach Review Session', description: 'Review last game performance', category: 'team_meeting', priority: 'medium', status: 'completed', daysAgo: 3 },
    
    // Pending tasks
    { title: 'Team Strategy Meeting', description: 'Discuss next game plan and lineup', category: 'team_meeting', priority: 'high', status: 'pending', daysAhead: 2 },
    { title: 'Evening Practice', description: 'Fielding drills and base running', category: 'training', priority: 'medium', status: 'pending', daysAhead: 1 },
    { title: 'Weekend Tournament', description: 'Regional championship tournament', category: 'game', priority: 'high', status: 'pending', daysAhead: 5 },
    { title: 'Buy New Batting Gloves', description: 'Current ones are torn', category: 'equipment', priority: 'medium', status: 'pending', daysAhead: 3 },
    
    // In-progress tasks
    { title: 'Video Analysis', description: 'Review batting footage from last game', category: 'training', priority: 'high', status: 'in_progress', daysAgo: 0 },
    { title: 'Prepare Equipment Bag', description: 'Pack all gear for weekend tournament', category: 'equipment', priority: 'high', status: 'in_progress', daysAhead: 1 }
  ];

  let insertedCount = 0;

  for (const task of sampleTasks) {
    let dueDate;
    let createdAt;

    if (task.daysAgo !== undefined) {
      dueDate = new Date(Date.now() - task.daysAgo * 24 * 60 * 60 * 1000);
      createdAt = new Date(Date.now() - task.daysAgo * 24 * 60 * 60 * 1000);
    } else if (task.daysAhead !== undefined) {
      dueDate = new Date(Date.now() + task.daysAhead * 24 * 60 * 60 * 1000);
      createdAt = new Date();
    } else {
      dueDate = new Date();
      createdAt = new Date();
    }

    try {
      await connection.query(
        'INSERT INTO tasks (user_id, title, description, category, priority, status, due_date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, task.title, task.description, task.category, task.priority, task.status, dueDate, createdAt]
      );
      insertedCount++;
      console.log(`✅ Added: ${task.title}`);
    } catch (error) {
      console.error(`❌ Error adding ${task.title}:`, error.message);
    }
  }

  console.log(`\n🎉 Successfully added ${insertedCount} sample tasks!`);

  // Show stats
  const [stats] = await connection.query(`
    SELECT 
      COUNT(*) as total_tasks,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_tasks,
      SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks,
      SUM(CASE WHEN category = 'training' AND status = 'completed' THEN 1 ELSE 0 END) as training_sessions,
      SUM(CASE WHEN category = 'game' AND status = 'completed' THEN 1 ELSE 0 END) as games_played,
      SUM(CASE WHEN category = 'equipment' AND status = 'completed' THEN 1 ELSE 0 END) as equipment_checks,
      SUM(CASE WHEN category = 'team_meeting' AND status = 'completed' THEN 1 ELSE 0 END) as team_meetings
    FROM tasks 
    WHERE user_id = ?
  `, [userId]);

  console.log('\n📊 Your Baseball Stats:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🏋️  Training Sessions: ${stats[0].training_sessions}`);
  console.log(`⚾ Games Played: ${stats[0].games_played}`);
  console.log(`✅ Tasks Completed: ${stats[0].completed_tasks}`);
  console.log(`🧤 Equipment Checks: ${stats[0].equipment_checks}`);
  console.log(`👥 Team Meetings: ${stats[0].team_meetings}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 Total Tasks: ${stats[0].total_tasks}`);
  console.log(`⏳ Pending: ${stats[0].pending_tasks}`);
  console.log(`🔄 In Progress: ${stats[0].in_progress_tasks}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await connection.end();
  console.log('✅ Done! Check your app to see the stats.');
}

addSampleData().catch(console.error);
