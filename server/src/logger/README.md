# How To Use The Logger

```
import { loggerSetup } from './logger';

const logger = loggerSetup(__dirname, 'AppName');

logger.error('This is an error message');
logger.warn('This is a warning message');
logger.info('This is an informational message');
```

Where dirname isn't used right now (as we output to console) and 'AppName' is to help locate where the failure is.

### Logging Levels

The only available levels are:

- error
- warn
- info
