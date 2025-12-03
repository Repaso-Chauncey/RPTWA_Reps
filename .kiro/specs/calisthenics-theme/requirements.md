# Requirements Document

## Introduction

This feature transforms the existing Baseball PWA application into a Calisthenics-themed fitness tracking application. The transformation includes updating the visual theme to a black and yellow color palette, renaming the database from `baseball_pwa` to `calisthenics-reps`, and updating all related references throughout the codebase. The application will maintain its core functionality (task management, user authentication, gamification) while adopting a calisthenics/bodyweight fitness identity.

## Glossary

- **Calisthenics System**: The fitness tracking application being created from the Baseball PWA transformation
- **Color Palette**: The visual color scheme consisting of black (#000000) as the primary color and yellow (#FFD700 or similar) as the accent color
- **Database Reference**: Any code, configuration, or documentation that references the database name
- **Theme Element**: Any visual component including colors, icons, text labels, and branding that reflects the application's identity
- **Environment File**: Configuration files (.env, .env.development, .env.production) containing database and application settings

## Requirements

### Requirement 1

**User Story:** As a developer, I want to update the database name from `baseball_pwa` to `calisthenics-reps`, so that the database identity matches the new application theme.

#### Acceptance Criteria

1. WHEN the Calisthenics System initializes THEN the system SHALL connect to a database named `calisthenics-reps`
2. WHEN the database schema is created THEN the system SHALL use `calisthenics-reps` as the database name in all SQL scripts
3. WHEN environment files are loaded THEN the system SHALL reference `calisthenics-reps` as the DB_NAME value
4. WHEN the development environment is configured THEN the system SHALL use `calisthenics_reps_dev` as the development database name

### Requirement 2

**User Story:** As a user, I want to see a black and yellow color scheme throughout the application, so that the visual design reflects an energetic fitness aesthetic.

#### Acceptance Criteria

1. WHEN the application renders any page THEN the system SHALL use black (#000000) as the primary background color
2. WHEN the application renders interactive elements (buttons, links, highlights) THEN the system SHALL use yellow (#FFD700) as the accent color
3. WHEN the application renders text on dark backgrounds THEN the system SHALL use white (#FFFFFF) or yellow (#FFD700) for readability
4. WHEN the application renders cards and content containers THEN the system SHALL use appropriate contrast between black backgrounds and yellow/white accents
5. WHEN hover states are triggered on interactive elements THEN the system SHALL provide visual feedback using the yellow accent color

### Requirement 3

**User Story:** As a user, I want to see calisthenics-themed categories for my tasks, so that I can organize my fitness activities appropriately.

#### Acceptance Criteria

1. WHEN a user creates a task THEN the system SHALL offer calisthenics-themed categories: 'push-ups', 'pull-ups', 'squats', 'core', 'stretching', 'other'
2. WHEN the database schema defines task categories THEN the system SHALL use the calisthenics-themed ENUM values
3. WHEN displaying task categories THEN the system SHALL show appropriate fitness-related icons or labels

### Requirement 4

**User Story:** As a user, I want to see calisthenics-themed branding and text throughout the application, so that the application feels cohesive with its fitness purpose.

#### Acceptance Criteria

1. WHEN the application displays the brand name THEN the system SHALL show "Calisthenics Reps" or similar fitness-themed branding
2. WHEN the server health check responds THEN the system SHALL return a message indicating "Calisthenics Reps API"
3. WHEN console logs display application status THEN the system SHALL use calisthenics-themed messaging instead of baseball references
4. WHEN the PWA manifest is loaded THEN the system SHALL display "Calisthenics Reps" as the application name

### Requirement 5

**User Story:** As a developer, I want all environment configuration files updated consistently, so that the application works correctly across all environments.

#### Acceptance Criteria

1. WHEN the .env file is read THEN the system SHALL contain DB_NAME=calisthenics-reps
2. WHEN the .env.development file is read THEN the system SHALL contain DB_NAME=calisthenics_reps_dev
3. WHEN the .env.production file is read THEN the system SHALL contain DB_NAME=calisthenics-reps as the production database reference
4. WHEN JWT and session secrets are configured THEN the system SHALL use calisthenics-themed secret key names

### Requirement 6

**User Story:** As a user, I want the game feature to reflect a calisthenics theme, so that the gamification element matches the fitness application identity.

#### Acceptance Criteria

1. WHEN the game page is accessed THEN the system SHALL display calisthenics-themed game content instead of baseball content
2. WHEN game-related routes are defined THEN the system SHALL use appropriate calisthenics-themed naming
3. WHEN game statistics are displayed THEN the system SHALL use fitness-related terminology and icons
