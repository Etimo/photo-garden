# db

Database library. Will create a connection to the specified database (read from config, see config file for structure).

```javascript
const db = require("db");
const dbClient = db.create("garden");
```

The name `garden` refers to section `db.garden` in config file.
