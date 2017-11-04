const axios = require("axios"),
      bluebird =  require("bluebird"),
      checkResponseCode = require('./response_codes').checkResponseCode,
      settings = require('./../config/settings'),
      addStat = require('./../db/db_functions').addStat,
      moment = require("moment");


// These two helper functions will track response time
startTime = () => {
    return process.hrtime();
}
endTime = (start_time) => {
    const elapsed = process.hrtime(start_time)[1] / 1000000; //hrtime is in nanoseconds, convert to milli
    return elapsed.toFixed(2);
}

sendRequests = (website_obj) => {

    const url = website_obj.url,
          interval = website_obj.interval;

    const start_time = startTime();
    return axios.get(url, settings.request_timeout)
    .then((axios_response) => {
        const response_time = endTime(start_time);
        const response_data = axios_response.data,
              response_status = axios_response.status;

        // Process the status code and write the data to the db
        const status_object = checkResponseCode(response_status),
              stat_object = {
                  response_time,
                  status:status_object,
                  timestamp: new Date()
              };
        addStat(url, stat_object)
        // console.log(JSON.stringify(stat_object)+" ("+i+") in "+response_time+"ms\n");
        return bluebird.delay(interval)
    })
    .then(()=>{
        return sendRequests(website_obj)
    })
    .catch((err) => {
        // This happens if axios times out (the website could not be reached)
        const stat_object = {
            response_time: null,
            message: "Timeout error",
            response_status: null,
            timestamp: new Date()
        };
        addStat(url, stat_object)
        return bluebird.delay(interval)
        .then(()=>{
            return sendRequests(website_obj)
        })
    })

}

treatWebsiteQueue = (websites) => {

    for (var i=0; i<websites.length; i++) { // Do this asynchronously
      sendRequests(websites[i]);
    }

}

module.exports.treatWebsiteQueue = treatWebsiteQueue;
