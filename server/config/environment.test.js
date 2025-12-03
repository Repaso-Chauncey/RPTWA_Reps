const fc = require('fast-check');
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
