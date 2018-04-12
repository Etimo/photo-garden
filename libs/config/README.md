# config

Basic configuration handling for all apps. By default this will load the configuration file `config.${NODE_ENV}.json` from the root of the repo. Default node env is development so the file that will be loaded in dev is `config.development.json`.

Add needed configuration to this file. It's just a plain json file that can be used like this:

```javascript
const config = require("config");
config.get("providers.googleDrive.validPhotos");
```

Missing keys will be read from environment variables if available. The key a.b.c will be read from `PHOTO_GARDEN_A_B_C` if not found in the config.
