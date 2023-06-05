const loggerSetup = require('./logger');

// Test the logger setup
const logger = loggerSetup(__dirname);

console.log(logger);

// logger.error('This is an error message');
// logger.warn('This is a warning message');
// logger.info('This is an informational message');

// // Test logging at a custom level
// logger.log('http', 'This is a custom log message');
