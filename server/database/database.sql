-- Baseball PWA Database Schema
-- Run this in phpMyAdmin

CREATE DATABASE IF NOT EXISTS baseball_pwa;
USE baseball_pwa;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    profile_picture VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_google_id (google_id)
);

-- Tasks table (Baseball-themed: training sessions, games, equipment checks, etc.)
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('training', 'game', 'equipment', 'team_meeting', 'other') DEFAULT 'other',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    due_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date)
);

-- Sessions table for authentication
CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
);

-- Insert sample data
INSERT INTO users (username, email, password) VALUES 
('demo_player', 'demo@baseball.com', '$2b$10$YourHashedPasswordHere');

INSERT INTO tasks (user_id, title, description, category, priority, status, due_date) VALUES
(1, 'Batting Practice', 'Work on swing mechanics and timing', 'training', 'high', 'pending', DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'Team Game vs Yankees', 'Home game at 7 PM', 'game', 'high', 'pending', DATE_ADD(NOW(), INTERVAL 3 DAY)),
(1, 'Check Baseball Glove', 'Oil and condition leather', 'equipment', 'medium', 'pending', DATE_ADD(NOW(), INTERVAL 2 DAY)),
(1, 'Strategy Meeting', 'Discuss playoff tactics', 'team_meeting', 'medium', 'completed', DATE_SUB(NOW(), INTERVAL 1 DAY));
