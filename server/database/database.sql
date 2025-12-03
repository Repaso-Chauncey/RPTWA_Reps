-- Calisthenics Reps Database Schema
-- Run this in phpMyAdmin

CREATE DATABASE IF NOT EXISTS `calisthenics-reps`;
USE `calisthenics-reps`;

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

-- Tasks table (Calisthenics-themed: push-ups, pull-ups, squats, core, stretching, etc.)
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('push-ups', 'pull-ups', 'squats', 'core', 'stretching', 'other') DEFAULT 'other',
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
('demo_athlete', 'demo@calisthenics.com', '$2b$10$YourHashedPasswordHere');

INSERT INTO tasks (user_id, title, description, category, priority, status, due_date) VALUES
(1, 'Morning Push-ups', 'Complete 50 push-ups with proper form', 'push-ups', 'high', 'pending', DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'Pull-up Challenge', 'Work on 20 pull-ups in sets of 5', 'pull-ups', 'high', 'pending', DATE_ADD(NOW(), INTERVAL 3 DAY)),
(1, 'Squat Session', 'Complete 100 bodyweight squats', 'squats', 'medium', 'pending', DATE_ADD(NOW(), INTERVAL 2 DAY)),
(1, 'Core Workout', 'Planks and ab exercises for 15 minutes', 'core', 'medium', 'completed', DATE_SUB(NOW(), INTERVAL 1 DAY));
