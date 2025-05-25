/**
 * Upload Testing Utility
 * 
 * This script helps test file upload functionality with authentication.
 * Run with: node upload-test.js
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:3001/api';
const DEFAULT_TOKEN_PATH = path.join(__dirname, 'medium-lived-token.txt');

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
 * Create a test image file
 */
function createTestImage(filename, size = 100) {
  const filePath = path.join(__dirname, filename);
  
  // Create a simple text file that pretends to be an image
  const content = Buffer.alloc(size * 1024, 'A');
  fs.writeFileSync(filePath, content);
  
  console.log(`${colors.green}Created test file: ${filePath} (${size}KB)${colors.reset}`);
  return filePath;
}

/**
 * Read token from file
 */
function readToken(tokenPath = DEFAULT_TOKEN_PATH) {
  try {
    return fs.readFileSync(tokenPath, 'utf8').trim();
  } catch (error) {
    console.error(`${colors.red}Error reading token from ${tokenPath}: ${error.message}${colors.reset}`);
    console.log(`${colors.yellow}Run auth-test.js first to generate tokens${colors.reset}`);
    process.exit(1);
  }
}

/**
 * Upload a file with authentication
 */
async function uploadFile(filePath, token) {
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    
    console.log(`${colors.yellow}Uploading file: ${filePath}${colors.reset}`);
    console.log(`${colors.cyan}Using token: ${token.substring(0, 20)}...${colors.reset}`);
    
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status
    };
  }
}

/**
 * Run tests
 */
async function runTests() {
  console.log(`\n${colors.magenta}===== FILE UPLOAD TEST UTILITY =====${colors.reset}\n`);
  
  // Read token
  const token = readToken();
  
  // Create test files
  const validImageFile = createTestImage('test-image.jpg', 100);  // 100KB
  const largeImageFile = createTestImage('large-image.jpg', 6000); // 6MB (exceeds limit)
  
  // Test with valid image and valid token
  console.log(`\n${colors.yellow}TEST 1: Upload with valid image and valid token${colors.reset}`);
  const validResult = await uploadFile(validImageFile, token);
  
  if (validResult.success) {
    console.log(`${colors.green}SUCCESS: File uploaded successfully${colors.reset}`);
    console.log(validResult.data);
  } else {
    console.log(`${colors.red}FAILED: ${validResult.error?.message || JSON.stringify(validResult.error)}${colors.reset}`);
    console.log(`Status: ${validResult.status}`);
  }
  
  // Test with large image (should fail validation)
  console.log(`\n${colors.yellow}TEST 2: Upload with oversized image (should fail)${colors.reset}`);
  const largeResult = await uploadFile(largeImageFile, token);
  
  if (!largeResult.success && largeResult.status === 400) {
    console.log(`${colors.green}SUCCESS: Server correctly rejected oversized file${colors.reset}`);
    console.log(largeResult.error);
  } else if (largeResult.success) {
    console.log(`${colors.red}FAILED: Server accepted oversized file (should have rejected)${colors.reset}`);
    console.log(largeResult.data);
  } else {
    console.log(`${colors.red}ERROR: ${largeResult.error?.message || JSON.stringify(largeResult.error)}${colors.reset}`);
    console.log(`Status: ${largeResult.status}`);
  }
  
  // Test with invalid token
  console.log(`\n${colors.yellow}TEST 3: Upload with invalid token (should fail auth)${colors.reset}`);
  const invalidToken = 'invalid.token.format';
  const invalidTokenResult = await uploadFile(validImageFile, invalidToken);
  
  if (!invalidTokenResult.success && invalidTokenResult.status === 401) {
    console.log(`${colors.green}SUCCESS: Server correctly rejected invalid token${colors.reset}`);
    console.log(invalidTokenResult.error);
  } else {
    console.log(`${colors.red}FAILED: Server did not properly handle invalid token${colors.reset}`);
    console.log(invalidTokenResult);
  }
  
  // Clean up test files
  console.log(`\n${colors.yellow}Cleaning up test files...${colors.reset}`);
  try {
    fs.unlinkSync(validImageFile);
    fs.unlinkSync(largeImageFile);
    console.log(`${colors.green}Test files removed${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}Error removing test files: ${error.message}${colors.reset}`);
  }
  
  console.log(`\n${colors.magenta}===== END OF TEST UTILITY =====${colors.reset}\n`);
}

// Run the tests
runTests();
