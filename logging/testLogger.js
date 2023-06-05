var loggerSetup = require('./logger');
// Test the logger setup
var logger = loggerSetup(__dirname);
console.log(logger);
var x = (a) => (1 ? 2 : 3);
// logger.error('This is an error message');
// logger.warn('This is a warning message');
// logger.info('This is an informational message');
// // Test logging at a custom level
// logger.log('http', 'This is a custom log message');
