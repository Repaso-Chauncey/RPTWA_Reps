# Implementation Plan

- [x] 1. Update environment configuration files

  - [x] 1.1 Update .env file with new database name and secrets


    - Change DB_NAME from `baseball_pwa` to `calisthenics-reps`
    - Update JWT_SECRET and SESSION_SECRET to use calisthenics-themed names


    - _Requirements: 1.1, 1.3, 5.1, 5.4_
  - [x] 1.2 Update .env.development file


    - Change DB_NAME from `baseball_pwa_dev` to `calisthenics_reps_dev`
    - Update development secrets to use calisthenics-themed names


    - _Requirements: 1.4, 5.2, 5.4_

  - [x] 1.3 Update .env.production file


    - Change DB_NAME reference to `calisthenics-reps`
    - Update production secret placeholders to use calisthenics-themed names
    - _Requirements: 5.3, 5.4_


  - [x] 1.4 Write property test for database name consistency

    - **Property 1: Database Name Consistency**

    - **Validates: Requirements 1.1, 1.3, 5.1, 5.2, 5.3**




- [x] 2. Update database schema and server configuration


  - [x] 2.1 Update database.sql schema file

    - Change database name from `baseball_pwa` to `calisthenics-reps`
    - Update task category ENUM from ('training', 'game', 'equipment', 'team_meeting', 'other') to ('push-ups', 'pull-ups', 'squats', 'core', 'stretching', 'other')
    - Update sample data to use calisthenics-themed tasks
    - _Requirements: 1.2, 3.1, 3.2_


  - [x] 2.2 Update server/config/database.js default fallback

    - Change default database name from `baseball_pwa` to `calisthenics-reps`


    - _Requirements: 1.1_



  - [x] 2.3 Update server/server.js console logs and health check

    - Change banner from "Baseball PWA" to "Calisthenics Reps"
    - Update health check message to "Calisthenics Reps API"


    - _Requirements: 4.2, 4.3_
  - [x] 2.4 Write property test for category ENUM consistency

    - **Property 4: Category ENUM Consistency**


    - **Validates: Requirements 3.1, 3.2**


- [-] 3. Update PWA manifest and client configuration

  - [x] 3.1 Update client/public/manifest.json


    - Change short_name to "Calisthenics Reps"
    - Change name to "Calisthenics Reps - Fitness Tracker"
    - Update description to fitness-themed text
    - Change theme_color to #000000 (black)
    - Change background_color to #FFD700 (yellow)
    - _Requirements: 4.4_


  - [ ] 3.2 Write property test for brand name consistency
    - **Property 3: Brand Name Consistency**
    - **Validates: Requirements 4.1, 4.4**

- [ ] 4. Update CSS files with black and yellow color palette
  - [x] 4.1 Update client/src/index.css base styles

    - Ensure body background is #000000
    - _Requirements: 2.1_
  - [x] 4.2 Update client/src/pages/Dashboard.css

    - Change white accents to yellow (#FFD700) for buttons and highlights
    - Update hover states to use yellow accent
    - Keep black backgrounds, update interactive elements
    - _Requirements: 2.2, 2.3, 2.5_

  - [x] 4.3 Update client/src/pages/Tasks.css

    - Change white accents to yellow (#FFD700) for buttons and highlights
    - Update hover states to use yellow accent
    - Update filter tabs active state to yellow
    - _Requirements: 2.2, 2.3, 2.5_
  - [x] 4.4 Update client/src/pages/Profile.css

    - Change white accents to yellow (#FFD700) for buttons and highlights
    - Update hover states to use yellow accent
    - _Requirements: 2.2, 2.3, 2.5_


  - [ ] 4.5 Update client/src/components/Navbar.css
    - Change white accents to yellow (#FFD700) for brand and links
    - Update hover states and logout button to use yellow
    - _Requirements: 2.2, 2.5_
  - [x] 4.6 Write property test for color palette consistency

    - **Property 2: Color Palette Consistency**
    - **Validates: Requirements 2.2, 2.5**

- [x] 5. Update component branding and content

  - [x] 5.1 Update client/src/components/Navbar.js


    - Change brand text from "⚾ Baseball PWA" to "💪 Calisthenics Reps"
    - Update game link text from "⚾ Play Game" to "💪 Workout Game"
    - _Requirements: 4.1_

  - [x] 5.2 Rename and update BaseballGame component to CalisthenicsGame

    - Rename client/src/pages/BaseballGame.js to CalisthenicsGame.js
    - Rename client/src/pages/BaseballGame.css to CalisthenicsGame.css
    - Update all baseball references to calisthenics (e.g., "batting" to "reps", "pitcher" to "timer")
    - Update game mechanics text and icons to fitness theme
    - Change localStorage key from 'baseballHighScore' to 'calisthenicsHighScore'
    - _Requirements: 6.1, 6.2, 6.3_
  - [x] 5.3 Update client/src/App.js imports


    - Change import from BaseballGame to CalisthenicsGame
    - Update route component reference
    - _Requirements: 6.2_

- [x] 6. Update additional CSS files for game and modals

  - [x] 6.1 Update CalisthenicsGame.css (formerly BaseballGame.css)


    - Apply black and yellow color palette
    - Update any baseball-specific styling classes
    - _Requirements: 2.2, 6.1_
  - [x] 6.2 Update client/src/components/TaskModal.css


    - Apply yellow accent colors to buttons and form elements
    - _Requirements: 2.2_
  - [x] 6.3 Update client/src/components/AchievementsModal.css


    - Apply yellow accent colors
    - _Requirements: 2.2_
  - [x] 6.4 Update client/src/pages/Auth.css


    - Apply black and yellow theme to login/register pages
    - _Requirements: 2.1, 2.2_

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Final verification and cleanup


  - [x] 8.1 Search and replace any remaining baseball references


    - Grep codebase for "baseball", "Baseball", "BASEBALL"
    - Update any missed references to calisthenics theme
    - _Requirements: 4.1, 4.3_

  - [x] 8.2 Update README.md if it contains baseball references

    - Update project description to reflect calisthenics theme
    - _Requirements: 4.1_

- [ ] 9. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
