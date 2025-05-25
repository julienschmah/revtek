/**
 * Auth Testing Utility
 * 
 * This script helps test JWT token generation, validation, and expiration handling.
 * Run with: node auth-test.js
 */
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-super-secreto';
const TEST_USER_ID = 1;
const EXPIRATION_TIMES = {
  SHORT: '30s',  // 30 seconds
  MEDIUM: '5m',  // 5 minutes
  STANDARD: '3h', // 3 hours (normal token lifetime)
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Generate a JWT token with specified expiration
 */
function generateToken(userId, expiresIn) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn });
}

/**
 * Verify a JWT token
 */
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return {
      valid: true,
      expired: false,
      payload: decoded
    };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return {
        valid: false,
        expired: true,
        message: 'Token expired',
        error
      };
    }
    
    return {
      valid: false,
      expired: false,
      message: error.message,
      error
    };
  }
}

/**
 * Format date for display
 */
function formatDate(date) {
  return new Date(date * 1000).toLocaleString();
}

/**
 * Get time remaining until expiration
 */
function getTimeRemaining(exp) {
  const now = Math.floor(Date.now() / 1000);
  const remaining = exp - now;
  
  if (remaining <= 0) return 'Expired';
  
  if (remaining < 60) return `${remaining} seconds`;
  if (remaining < 3600) return `${Math.floor(remaining / 60)} minutes`;
  
  return `${Math.floor(remaining / 3600)} hours ${Math.floor((remaining % 3600) / 60)} minutes`;
}

/**
 * Save token to a file for testing
 */
function saveTokenToFile(token, filename) {
  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, token);
  console.log(`${colors.green}Token saved to ${filePath}${colors.reset}`);
}

/**
 * Run tests
 */
function runTests() {
  console.log(`\n${colors.magenta}===== JWT AUTHENTICATION TEST UTILITY =====${colors.reset}\n`);
  console.log(`${colors.cyan}Using secret: ${JWT_SECRET}${colors.reset}\n`);
  
  // Generate tokens with different expiration times
  console.log(`${colors.yellow}Generating test tokens...${colors.reset}`);
  
  const shortLivedToken = generateToken(TEST_USER_ID, EXPIRATION_TIMES.SHORT);
  const mediumLivedToken = generateToken(TEST_USER_ID, EXPIRATION_TIMES.MEDIUM);
  const standardToken = generateToken(TEST_USER_ID, EXPIRATION_TIMES.STANDARD);
  
  // Analyze tokens
  console.log(`\n${colors.yellow}Analyzing tokens...${colors.reset}`);
  
  const shortTokenInfo = jwt.decode(shortLivedToken);
  const mediumTokenInfo = jwt.decode(mediumLivedToken);
  const standardTokenInfo = jwt.decode(standardToken);
  
  console.log(`\n${colors.cyan}SHORT-LIVED TOKEN (${EXPIRATION_TIMES.SHORT})${colors.reset}`);
  console.log(`Issued at: ${formatDate(shortTokenInfo.iat)}`);
  console.log(`Expires at: ${formatDate(shortTokenInfo.exp)}`);
  console.log(`Time remaining: ${getTimeRemaining(shortTokenInfo.exp)}`);
  console.log(`Token: ${shortLivedToken.substring(0, 20)}...`);
  
  console.log(`\n${colors.cyan}MEDIUM-LIVED TOKEN (${EXPIRATION_TIMES.MEDIUM})${colors.reset}`);
  console.log(`Issued at: ${formatDate(mediumTokenInfo.iat)}`);
  console.log(`Expires at: ${formatDate(mediumTokenInfo.exp)}`);
  console.log(`Time remaining: ${getTimeRemaining(mediumTokenInfo.exp)}`);
  console.log(`Token: ${mediumLivedToken.substring(0, 20)}...`);
  
  console.log(`\n${colors.cyan}STANDARD TOKEN (${EXPIRATION_TIMES.STANDARD})${colors.reset}`);
  console.log(`Issued at: ${formatDate(standardTokenInfo.iat)}`);
  console.log(`Expires at: ${formatDate(standardTokenInfo.exp)}`);
  console.log(`Time remaining: ${getTimeRemaining(standardTokenInfo.exp)}`);
  console.log(`Token: ${standardToken.substring(0, 20)}...`);
  
  // Save tokens to files
  console.log(`\n${colors.yellow}Saving tokens to files for testing...${colors.reset}`);
  saveTokenToFile(shortLivedToken, 'short-lived-token.txt');
  saveTokenToFile(mediumLivedToken, 'medium-lived-token.txt');
  saveTokenToFile(standardToken, 'standard-token.txt');
  
  console.log(`\n${colors.green}TEST INSTRUCTIONS:${colors.reset}`);
  console.log(`1. Use the short-lived token (expires in ${EXPIRATION_TIMES.SHORT}) to test expiration handling`);
  console.log(`2. Use the medium-lived token (expires in ${EXPIRATION_TIMES.MEDIUM}) for upload tests`);
  console.log(`3. Use the standard token for normal operation`);
  
  console.log(`\n${colors.yellow}To use a token:${colors.reset}`);
  console.log(`1. Copy the token from the corresponding file`);
  console.log(`2. Use browser dev tools to set it in localStorage:`);
  console.log(`   localStorage.setItem('token', '<paste-token-here>')`);
  console.log(`3. Refresh the page and test functionality`);
  
  console.log(`\n${colors.magenta}===== END OF TEST UTILITY =====${colors.reset}\n`);
}

// Run the tests
runTests();
