const db_functions = require('./../db/db_functions'),
      Table = require('cli-table'),
      settings = require('./../config/settings'),
      bluebird = require('bluebird');

// The table that will be shown to the user (and updated every 10s)
var table = new Table({
    head: ['URL', 'Availability', 'Resp. Time', 'Std Resp. Time', 'Max Resp. Time', 'Last Resp. Code', 'Downtime'],
    style: {
        head: ['yellow']
    }
});

const computeStats = db_functions.computeStats,
      getWebsiteList = db_functions.getWebsiteList;

// Holds the website list
let websites = null;
let alerts = [];

setupConsole = () => {

    websites = getWebsiteList();
    console.log(websites.join("\n"));
    for (var p=0; p<websites.length; p++) {
        table.push([]);
    }

}

runConsoleProgram = (i=0) => {

    if (websites === null) {
        setupConsole();
    }

    // Will hold the alerts status
    alerts = [];

    // By default, updates every 10s with 10min data, the every 1min = 6*10s, update with 1h data
    let time_interval = "10min",
        time_for_rerun = settings.console_update_interval,
        k=i+1;
    if (i==5) {
        time_interval = "1h"
        k = 0
    }

    // For every website, compute the relevant statistic
    updateWebsitesStats(k);

    setTimeout(function () {
        runConsoleProgram(k)
    }, time_for_rerun);

}

// This makes a db call on the website list to get the statistics and alert status for all websites
updateWebsitesStats = (k) => {

    const stats_timeframe = (k==0 ? "1h" : "10min");

    let current_time = new Date();
    // We take advantage of javascript's asynchronous functions
    let promises = [];
    for (var j=0; j<websites.length; j++) {
        const web_url = websites[j]
        promises.push(computeStats(web_url, stats_timeframe))
    }
    return bluebird.all(promises)
    .then((stats) => {
        for (var i=0; i<stats.length; i++) {
            statsCalculatedCallback(websites[i], stats[i], i) // Update the table with the data
        }
        let now_time = new Date();
        printTable(stats_timeframe, (now_time-current_time)/1000);
    })


}

statsCalculatedCallback = (web_url, web_stats, j) => {

    const new_alert = web_stats.alert;
    if (new_alert) {
        alerts.push(new_alert);
    }

    table[j] = [
        web_url,
        web_stats.availability.toString()+'%',
        web_stats.mean_response_time,
        web_stats.std_response_time,
        web_stats.max_response_time,
        (web_stats.last_resp_code || 500).toString(),
        web_stats.downtime
    ]

}

printTable = (timerange, update_time) => {
    process.stdout.write('\x1B[2J\x1B[0f\u001b[0;0H');
    console.log("\x1b[0m"); // Have the header reset to normal cmd style
    console.log("Website stats for the past "+timerange+" (Updated in "+update_time+"sec)\n");
    console.log(table.toString());
    console.log("\n\n");
    printAlerts();
}

printAlerts = () => {
    alerts.map((alert_object) => {
        console.log(alert_object.color, alert_object.text, alert_object.color);
        console.log("\n");
    })
}

module.exports = runConsoleProgram
