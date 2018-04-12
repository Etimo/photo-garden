# logging

Basic logging for all apps. Use this instead of console.\*. Will log using a standard format that includes the application name that performs the logging. Defaults to stdout for logging but can also log to http://www.logz.io ELK stack.

```javascript
const logger = require("logging");
logger.info("Hello world");
```
