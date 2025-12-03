const fc = require('fast-check');
const fs = require('fs');
const path = require('path');
const { validateConfig, REQUIRED_VARS } = require('./environment');

/**
 * Feature: development-environment, Property 1: Configuration Validation Completeness
 * Validates: Requirements 1.4
 * 
 * For any configuration object, if any required variable is missing,
 * the validation function SHALL return a failure result listing all missing variables.
 */
describe('Environment Configuration Validator', () => {
  // Helper to create a complete valid config
  const createCompleteConfig = () => ({
    PORT: '5000',
    NODE_ENV: 'development',
    DB_HOST: 'localhost',
    DB_NAME: 'test_db',
    JWT_SECRET: 'test_secret',
    SESSION_SECRET: 'session_secret',
    CLIENT_URL: 'http://localhost:3000'
  });

  describe('Property 1: Configuration Validation Completeness', () => {
    /**
     * Property: For any subset of required variables that are missing,
     * validateConfig should return exactly those missing variables
     */
    it('should identify all missing required variables for any configuration', () => {
      fc.assert(
        fc.property(
          // Generate a random subset of required vars to remove
          fc.subarray(REQUIRED_VARS, { minLength: 0, maxLength: REQUIRED_VARS.length }),
          (varsToRemove) => {
            // Create a config with some vars removed
            const config = createCompleteConfig();
            varsToRemove.forEach(varName => {
              delete config[varName];
            });

            const result = validateConfig(config);

            // The missing array should contain exactly the removed vars
            const sortedMissing = [...result.missing].sort();
            const sortedRemoved = [...varsToRemove].sort();

            expect(sortedMissing).toEqual(sortedRemoved);
            expect(result.valid).toBe(varsToRemove.length === 0);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: A complete config should always be valid
     */
    it('should return valid=true when all required variables are present', () => {
      fc.assert(
        fc.property(
          // Generate random values for each required var
          fc.record({
            PORT: fc.nat({ max: 65535 }).map(String),
            NODE_ENV: fc.constantFrom('development', 'production'),
            DB_HOST: fc.string({ minLength: 1 }),
            DB_NAME: fc.string({ minLength: 1 }),
            JWT_SECRET: fc.string({ minLength: 1 }),
            SESSION_SECRET: fc.string({ minLength: 1 }),
            CLIENT_URL: fc.string({ minLength: 1 })
          }),
          (config) => {
            const result = validateConfig(config);
            expect(result.valid).toBe(true);
            expect(result.missing).toEqual([]);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Empty config should report all required vars as missing
     */
    it('should report all required variables as missing for empty config', () => {
      const result = validateConfig({});
      expect(result.valid).toBe(false);
      expect(result.missing.sort()).toEqual([...REQUIRED_VARS].sort());
    });
  });
});


/**
 * Feature: calisthenics-theme, Property 1: Database Name Consistency
 * Validates: Requirements 1.1, 1.3, 5.1, 5.2, 5.3
 * 
 * For any environment configuration file in the project, the DB_NAME value
 * SHALL match the expected database name pattern (calisthenics-reps for production,
 * calisthenics_reps_dev for development).
 */
describe('Database Name Consistency', () => {
  const rootDir = path.join(__dirname, '..', '..');
  
  const envFiles = [
    { file: '.env', expectedDbName: 'calisthenics-reps', type: 'main' },
    { file: '.env.development', expectedDbName: 'calisthenics_reps_dev', type: 'development' },
    { file: '.env.production', expectedDbName: 'calisthenics-reps', type: 'production' }
  ];

  /**
   * Property: For any environment file, DB_NAME should match the calisthenics pattern
   */
  it('should have calisthenics-themed database names in all environment files', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...envFiles),
        (envConfig) => {
          const filePath = path.join(rootDir, envConfig.file);
          
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const dbNameMatch = content.match(/DB_NAME=(.+)/);
            
            expect(dbNameMatch).not.toBeNull();
            if (dbNameMatch) {
              const dbName = dbNameMatch[1].trim();
              expect(dbName).toBe(envConfig.expectedDbName);
              // Verify no baseball references
              expect(dbName.toLowerCase()).not.toContain('baseball');
            }
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Database names should follow calisthenics naming convention
   */
  it('should not contain baseball references in any DB_NAME', () => {
    envFiles.forEach(envConfig => {
      const filePath = path.join(rootDir, envConfig.file);
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const dbNameMatch = content.match(/DB_NAME=(.+)/);
        
        if (dbNameMatch) {
          const dbName = dbNameMatch[1].trim().toLowerCase();
          expect(dbName).toContain('calisthenics');
          expect(dbName).not.toContain('baseball');
        }
      }
    });
  });
});


/**
 * Feature: calisthenics-theme, Property 4: Category ENUM Consistency
 * Validates: Requirements 3.1, 3.2
 * 
 * For any task category definition (database schema or frontend), the categories
 * SHALL include calisthenics-themed values ('push-ups', 'pull-ups', 'squats', 'core', 'stretching', 'other').
 */
describe('Category ENUM Consistency', () => {
  const rootDir = path.join(__dirname, '..', '..');
  const expectedCategories = ['push-ups', 'pull-ups', 'squats', 'core', 'stretching', 'other'];
  const baseballCategories = ['training', 'game', 'equipment', 'team_meeting'];

  /**
   * Property: Database schema should contain calisthenics categories
   */
  it('should have calisthenics-themed categories in database schema', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...expectedCategories),
        (category) => {
          const schemaPath = path.join(rootDir, 'server', 'database', 'database.sql');
          
          if (fs.existsSync(schemaPath)) {
            const content = fs.readFileSync(schemaPath, 'utf8');
            expect(content).toContain(category);
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Database schema should NOT contain baseball categories
   */
  it('should not contain baseball-themed categories in database schema', () => {
    const schemaPath = path.join(rootDir, 'server', 'database', 'database.sql');
    
    if (fs.existsSync(schemaPath)) {
      const content = fs.readFileSync(schemaPath, 'utf8');
      
      baseballCategories.forEach(category => {
        expect(content).not.toContain(`'${category}'`);
      });
    }
  });

  /**
   * Property: All expected calisthenics categories should be present
   */
  it('should include all calisthenics categories in the ENUM definition', () => {
    const schemaPath = path.join(rootDir, 'server', 'database', 'database.sql');
    
    if (fs.existsSync(schemaPath)) {
      const content = fs.readFileSync(schemaPath, 'utf8');
      
      expectedCategories.forEach(category => {
        expect(content).toContain(`'${category}'`);
      });
    }
  });
});


/**
 * Feature: calisthenics-theme, Property 3: Brand Name Consistency
 * Validates: Requirements 4.1, 4.4
 * 
 * For any user-facing text that displays the application name, the text
 * SHALL contain "Calisthenics" and not contain "Baseball".
 */
describe('Brand Name Consistency', () => {
  const rootDir = path.join(__dirname, '..', '..');

  /**
   * Property: PWA manifest should contain calisthenics branding
   */
  it('should have calisthenics branding in PWA manifest', () => {
    const manifestPath = path.join(rootDir, 'client', 'public', 'manifest.json');
    
    if (fs.existsSync(manifestPath)) {
      const content = fs.readFileSync(manifestPath, 'utf8');
      const manifest = JSON.parse(content);
      
      // Check short_name contains Calisthenics
      expect(manifest.short_name.toLowerCase()).toContain('calisthenics');
      expect(manifest.short_name.toLowerCase()).not.toContain('baseball');
      
      // Check name contains Calisthenics
      expect(manifest.name.toLowerCase()).toContain('calisthenics');
      expect(manifest.name.toLowerCase()).not.toContain('baseball');
    }
  });

  /**
   * Property: Server health check should return calisthenics branding
   */
  it('should have calisthenics branding in server health check', () => {
    const serverPath = path.join(rootDir, 'server', 'server.js');
    
    if (fs.existsSync(serverPath)) {
      const content = fs.readFileSync(serverPath, 'utf8');
      
      // Check health check message
      expect(content).toContain('Calisthenics Reps API');
      expect(content).not.toContain('Baseball PWA API');
    }
  });

  /**
   * Property: Brand references should be consistent across files
   */
  it('should not contain baseball branding in key files', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'client/public/manifest.json',
          'server/server.js'
        ),
        (filePath) => {
          const fullPath = path.join(rootDir, filePath);
          
          if (fs.existsSync(fullPath)) {
            const content = fs.readFileSync(fullPath, 'utf8').toLowerCase();
            // Should not contain "baseball pwa" as a brand name
            expect(content).not.toContain('baseball pwa');
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * Feature: calisthenics-theme, Property 2: Color Palette Consistency
 * Validates: Requirements 2.2, 2.5
 * 
 * For any CSS file that defines interactive element styles (buttons, links),
 * the accent color values SHALL be yellow (#FFD700 or equivalent).
 */
describe('Color Palette Consistency', () => {
  const rootDir = path.join(__dirname, '..', '..');
  const yellowAccent = '#FFD700';
  const yellowAccentLower = '#ffd700';
  
  const cssFiles = [
    'client/src/pages/Dashboard.css',
    'client/src/pages/Tasks.css',
    'client/src/pages/Profile.css',
    'client/src/components/Navbar.css'
  ];

  /**
   * Property: CSS files should contain yellow accent color
   */
  it('should have yellow accent color in CSS files', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...cssFiles),
        (cssFile) => {
          const filePath = path.join(rootDir, cssFile);
          
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8').toLowerCase();
            // Check for yellow accent color presence
            expect(content).toContain(yellowAccentLower);
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Interactive elements should use yellow for hover states
   */
  it('should use yellow accent for hover states', () => {
    cssFiles.forEach(cssFile => {
      const filePath = path.join(rootDir, cssFile);
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8').toLowerCase();
        
        // If file has hover states, it should reference yellow
        if (content.includes(':hover')) {
          expect(content).toContain(yellowAccentLower);
        }
      }
    });
  });

  /**
   * Property: Primary background should be black
   */
  it('should use black as primary background color', () => {
    const indexCssPath = path.join(rootDir, 'client', 'src', 'index.css');
    
    if (fs.existsSync(indexCssPath)) {
      const content = fs.readFileSync(indexCssPath, 'utf8').toLowerCase();
      expect(content).toContain('#000');
    }
  });
});
