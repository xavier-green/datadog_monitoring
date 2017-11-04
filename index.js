const default_websites = require('./src/config/default_websites'),
      dbInit = require('./src/db/db_functions').init,
      treatWebsiteQueue = require('./src/ping/request').treatWebsiteQueue,
      fs = require("fs");

const console_run = require('./src/client/console');

dbInit(default_websites);
console.log("\nStarted");
treatWebsiteQueue(default_websites);
console.log("Now getting stats");

setTimeout(function () {
    console_run();
}, 5000);
