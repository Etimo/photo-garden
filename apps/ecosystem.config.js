// Find all backend services automatically
const { readdirSync, statSync } = require("fs");
const { join } = require("path");

const dirs = readdirSync(".").filter(f => statSync(f).isDirectory()); //.filter(f => f.substr(0, 3) === "be-")
console.log(dirs);

module.exports = {
  apps: dirs.map(dir => {
    return {
      name: dir,
      script: "npm",
      cwd: dir,
      args: "run start:dev",
      watch: false,
      env: {
        APP_NAME: dir
      }
    };
  })
};
