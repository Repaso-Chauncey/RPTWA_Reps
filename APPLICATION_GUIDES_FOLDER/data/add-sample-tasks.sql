-- ⚾ Baseball PWA - Sample Tasks Data
-- Run this in Railway Dashboard → Database → Query tab
-- Replace user_id = 1 with your actual user ID

-- First, check your user ID:
-- SELECT id, username, email FROM users;

-- Add completed training sessions
INSERT INTO tasks (user_id, title, description, category, priority, status, due_date, created_at) VALUES
(1, 'Morning Batting Practice', 'Work on swing mechanics and timing', 'training', 'high', 'completed', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 'Pitching Drills', 'Focus on fastball accuracy and control', 'training', 'medium', 'completed', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(1, 'Cardio Training', 'Run 3 miles for endurance', 'training', 'medium', 'completed', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
(1, 'Fielding Practice', 'Ground balls and fly balls', 'training', 'high', 'completed', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
(1, 'Strength Training', 'Upper body workout at gym', 'training', 'medium', 'completed', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY));

-- Add completed games
INSERT INTO tasks (user_id, title, description, category, priority, status, due_date, created_at) VALUES
(1, 'Home Game vs Tigers', 'Championship game - must win!', 'game', 'high', 'completed', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 'Away Game vs Bears', 'Regular season match', 'game', 'medium', 'completed', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
(1, 'Practice Game vs Juniors', 'Friendly scrimmage', 'game', 'low', 'completed', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY));

-- Add completed equipment checks
INSERT INTO tasks (user_id, title, description, category, priority, status, due_date, created_at) VALUES
(1, 'Check Glove Condition', 'Inspect and oil baseball glove', 'equipment', 'low', 'completed', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(1, 'Replace Bat Grip', 'Old grip is worn out and slippery', 'equipment', 'medium', 'completed', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
(1, 'Clean Cleats', 'Remove mud and dirt from cleats', 'equipment', 'low', 'completed', DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY));

-- Add completed team meetings
INSERT INTO tasks (user_id, title, description, category, priority, status, due_date, created_at) VALUES
(1, 'Pre-Season Team Meeting', 'Discuss goals and strategy', 'team_meeting', 'high', 'completed', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
(1, 'Coach Review Session', 'Review last game performance', 'team_meeting', 'medium', 'completed', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY));

-- Add pending tasks (upcoming)
INSERT INTO tasks (user_id, title, description, category, priority, status, due_date, created_at) VALUES
(1, 'Team Strategy Meeting', 'Discuss next game plan and lineup', 'team_meeting', 'high', 'pending', DATE_ADD(NOW(), INTERVAL 2 DAY), NOW()),
(1, 'Evening Practice', 'Fielding drills and base running', 'training', 'medium', 'pending', DATE_ADD(NOW(), INTERVAL 1 DAY), NOW()),
(1, 'Weekend Tournament', 'Regional championship tournament', 'game', 'high', 'pending', DATE_ADD(NOW(), INTERVAL 5 DAY), NOW()),
(1, 'Buy New Batting Gloves', 'Current ones are torn', 'equipment', 'medium', 'pending', DATE_ADD(NOW(), INTERVAL 3 DAY), NOW());

-- Add in-progress tasks
INSERT INTO tasks (user_id, title, description, category, priority, status, due_date, created_at) VALUES
(1, 'Video Analysis', 'Review batting footage from last game', 'training', 'high', 'in_progress', NOW(), NOW()),
(1, 'Prepare Equipment Bag', 'Pack all gear for weekend tournament', 'equipment', 'high', 'in_progress', DATE_ADD(NOW(), INTERVAL 1 DAY), NOW());

-- Verify the data was inserted
SELECT 
  category,
  status,
  COUNT(*) as count
FROM tasks 
WHERE user_id = 1
GROUP BY category, status
ORDER BY category, status;

-- Check total stats
SELECT 
  COUNT(*) as total_tasks,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
  SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_tasks,
  SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks,
  SUM(CASE WHEN category = 'training' AND status = 'completed' THEN 1 ELSE 0 END) as training_sessions,
  SUM(CASE WHEN category = 'game' AND status = 'completed' THEN 1 ELSE 0 END) as games_played
FROM tasks 
WHERE user_id = 1;
