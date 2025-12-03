# Implementation Plan

- [ ] 1. Create environment configuration files
  - [ ] 1.1 Create `.env.development` file with development-specific settings
    - Set NODE_ENV=development
    - Configure development database name (e.g., baseball_pwa_dev)
    - Set appropriate localhost URLs
    - _Requirements: 1.1, 5.1_
  - [ ] 1.2 Create `.env.production` file template with production settings
    - Set NODE_ENV=production
    - Include placeholders for production database credentials
    - _Requirements: 1.2, 5.2_
  - [ ] 1.3 Update `.gitignore` to protect sensitive environment files
    - Add .env.production to gitignore
    - Keep .env.development tracked for team sharing
    - _Requirements: 1.1, 1.2_

- [ ] 2. Implement environment configuration loader
  - [ ] 2.1 Create `server/config/environment.js` module
    - Implement loadEnvironment() function to load correct .env file based on NODE_ENV
    - Implement fallback logic to default .env if specific file missing
    - Log warning when falling back
    - _Requirements: 1.1, 1.2, 1.3_
  - [ ] 2.2 Implement configuration validator function
    - Define REQUIRED_VARS array
    - Create validateConfig() function that checks all required variables
    - Return list of missing variables if validation fails
    - _Requirements: 1.4_
  - [ ] 2.3 Write property test for configuration validator
    - **Property 1: Configuration Validation Completeness**
    - **Validates: Requirements 1.4**
    - Use fast-check to generate random config objects
    - Verify validator catches all missing required fields
  - [ ] 2.4 Integrate environment loader into server startup
    - Call loadEnvironment() before other requires
    - Call validateConfig() and exit if validation fails
    - _Requirements: 1.3, 1.4_

- [ ] 3. Enhance server startup logging
  - [ ] 3.1 Add environment mode logging to server.js
    - Log current NODE_ENV value on startup
    - Display clear banner showing development vs production mode
    - _Requirements: 3.2_
  - [ ] 3.2 Add database connection logging
    - Log database name when connecting
    - Include host and port in connection log
    - Log clear error message with database details on connection failure
    - _Requirements: 3.3, 5.3_

- [ ] 4. Update npm scripts for development workflow
  - [ ] 4.1 Update root package.json scripts
    - Ensure `npm run dev` uses NODE_ENV=development
    - Add `npm run start:prod` script with NODE_ENV=production
    - Configure nodemon for backend hot-reloading
    - _Requirements: 2.1, 2.2, 4.1, 4.2, 4.3_

- [ ] 5. Create DevIndicator UI component
  - [ ] 5.1 Create `client/src/components/DevIndicator.js` component
    - Display "DEV" badge when not in production
    - Style with fixed position for visibility
    - Use environment variable to determine visibility
    - _Requirements: 3.1_
  - [ ] 5.2 Integrate DevIndicator into App.js
    - Import and render DevIndicator component
    - Pass environment info from React environment variables
    - _Requirements: 3.1_

- [ ] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Update documentation
  - [ ] 7.1 Update env-example.txt with new structure
    - Document both development and production configurations
    - Add comments explaining each variable
    - _Requirements: 1.1, 1.2_
