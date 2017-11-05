const dbInit = require('./src/db/db_functions').init,
      treatWebsiteQueue = require('./src/ping/request').treatWebsiteQueue,
      fs = require("fs");

const console_run = require('./src/client/console');

var stdin = process.openStdin(),
    default_websites = require('./src/config/default_websites');

console.log("\nSome default websites have been entered: google.com / datadog.com / tobby.io / sdkglhsdgksdhgklsdh.com");
console.log("\nIf you want to enter some additional ones, please enter them here");
console.log("\nTo start running the program, please type 'run'\n\n");
stdin.addListener("data", function(d) {
    let user_input = d.toString().trim();
    if (user_input === "run") {
        stdin.removeAllListeners("data")
        dbInit(default_websites);
        console.log("\nEntering the websites in the database");
        treatWebsiteQueue(default_websites);
        console.log("\nStarting the program");
        setTimeout(function () {
            console_run();
        }, 5000);
    } else {
        if (checkURL(user_input)) {
            default_websites.push({
                url: user_input,
                interval: 3000
            })
            console.log(user_input,"added\n");
            console.log("Please enter a new website or type 'run'\n");
        } else {
            console.log("\nInvalid website, please add one of the form [http(s)]://[domain.com]([:port])\n");
        }
    }
  });

checkURL = (str) => {
  var pattern = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!pattern.test(str)) {
    return false;
  } else {
    return true;
  }
}
