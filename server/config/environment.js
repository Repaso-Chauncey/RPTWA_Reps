const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Required environment variables that must be present
const REQUIRED_VARS = [
  'PORT',
  'NODE_ENV',
  'DB_HOST',
  'DB_NAME',
  'JWT_SECRET',
  'SESSION_SECRET',
  'CLIENT_URL'
];

/**
 * Load environment configuration based on NODE_ENV
 * Falls back to .env if environment-specific file is not found
 */
function loadEnvironment() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const rootDir = path.resolve(__dirname, '../..');
  
  // Determine which env file to load
  const envFile = `.env.${nodeEnv}`;
  const envPath = path.join(rootDir, envFile);
  const defaultEnvPath = path.join(rootDir, '.env');
  
  let loadedFrom = '';
  
  // Try to load environment-specific file first
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    loadedFrom = envFile;
    console.log(`✅ Loaded environment from ${envFile}`);
  } else if (fs.existsSync(defaultEnvPath)) {
    // Fall back to default .env
    console.warn(`⚠️  Environment file ${envFile} not found, falling back to .env`);
    dotenv.config({ path: defaultEnvPath });
    loadedFrom = '.env';
  } else {
    console.error('❌ No environment file found!');
    loadedFrom = 'none';
  }
  
  return {
    loadedFrom,
    nodeEnv: process.env.NODE_ENV || 'development'
  };
}

/**
 * Validate that all required environment variables are present
 * @param {object} env - The process.env object to validate
 * @returns {object} - { valid: boolean, missing: string[] }
 */
function validateConfig(env = process.env) {
  const missing = REQUIRED_VARS.filter(varName => !env[varName]);
  
  return {
    valid: missing.length === 0,
    missing
  };
}

/**
 * Get the current environment name
 * @returns {string} - 'development' or 'production'
 */
function getEnvironmentName() {
  return process.env.NODE_ENV || 'development';
}

/**
 * Check if running in development mode
 * @returns {boolean}
 */
function isDevelopment() {
  return getEnvironmentName() === 'development';
}

/**
 * Check if running in production mode
 * @returns {boolean}
 */
function isProduction() {
  return getEnvironmentName() === 'production';
}

module.exports = {
  loadEnvironment,
  validateConfig,
  getEnvironmentName,
  isDevelopment,
  isProduction,
  REQUIRED_VARS
};
