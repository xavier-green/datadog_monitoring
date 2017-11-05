const moment = require("moment");

const time_deltas = {
    "2min": 2*60*1000+1,
    "10min": 10*60*1000+1,
    "1h": 60*60*1000+1
}
const alert_threshold =  require('./../config/settings').alert_threshold;

computeStats = (website_data, website_url, t_delta) => {

    // Timeseries data of the website requests + down status
    const website_stats = website_data.websiteData,
          website_is_down = website_data.is_down;

    // Current time that will be used to fetch 2min data for alert calculation
    const now = moment(new Date());

    let total_time_ms = 0,
        total_requests = 0,
        available_requests = 0, // will be used for availability calculation
        max_response_time = 0,
        square_response_time = 0 // will be used for std calculation
        status_codes = {}, // holds a map of the status codes
        min_timestamp = null, // these variables will be used to calculate downtime
        max_timestamp = null;

    let last_resp_code = null; // holding the last code value that we print in the console

    // Allow the calculation of availability with a 2min window different that the fetching window
    let two_min_total_requests = 0,
        two_min_success_requests = 0;

    website_stats.map((stat) => {

        //General stats computing
        total_requests += 1;
        const stat_response_time = parseFloat(stat['response_time']),
            status_object = stat['status'],
            stat_time = moment(stat.timestamp);

        if (!(min_timestamp)) {
            min_timestamp = stat_time
        }
        max_timestamp = stat_time

        if (stat_response_time) { // This is true if the request did not timeout
            if (status_object.message == "Ok") { // This is true for status codes 2xx and 3xx
                available_requests += 1;
                total_time_ms += stat_response_time;
                square_response_time += stat_response_time*stat_response_time;
                if (stat_response_time>max_response_time) {
                    max_response_time = stat_response_time;
                }
            }
            const status = status_object.code;
            last_resp_code = status;
            if (status in status_codes) {
                status_codes[status] += 1
            } else {
                status_codes[status] = 0
            }
        }


        //Alert computing
        if ((now-stat_time)<time_deltas["2min"]) {
            two_min_total_requests += 1;
            if (stat_response_time && (status_object.message == "Ok")) {
                two_min_success_requests += 1;
            }
        }

    })

    const two_min_availability = two_min_success_requests/two_min_total_requests;

    // Pull alert object from the relevant function
    const alertObject = getAlertObject(website_url, two_min_availability, website_is_down),
          alert_status = alertObject[0],
          // This will hold the logic of whether we need to update to website's state
          down_status_changed = alertObject[1];

    const availability = available_requests/total_requests,
          mean_response_time = total_time_ms/available_requests,
          std_response_time = Math.sqrt(square_response_time/available_requests - mean_response_time*mean_response_time);

    // Downtime computing
    let timeframe = (max_timestamp-min_timestamp)/1000;
    const down_time = timeframe*(1-availability) // In seconds

    return {
        availability: Math.round(availability*10000)/100,
        mean_response_time: Math.round(mean_response_time*100)/100,
        max_response_time: Math.round(max_response_time*100)/100,
        std_response_time: Math.round(std_response_time*100)/100,
        last_resp_code,
        alert: alert_status,
        downtime: Math.round(down_time.toString())+'s',
        down_status_changed
    }

}

getAlertObject = (website_url, two_min_availability, website_is_down) => {

    let alert_status = null, down_status_changed = false;

    // This block holds the logic for alert/recovery, based on whether the website was already down
    if (two_min_availability<alert_threshold) {
          alert_status = {
              text: "Website "+website_url+" is down, availability="+Math.round(two_min_availability*10000)/100+"%, time="+moment().format("D/M/YYYY H:m:s"),
              color: "\x1b[31m"
          }
          if (!(website_is_down)) {
              down_status_changed = true;
          }
    } else {
          if (website_is_down) {
                alert_status = {
                    text: "Website "+website_url+" recovered! time="+moment().format("D/M/YYYY H:m:s"),
                    color: "\x1b[32m"
                }
                down_status_changed = true;
          }
    }
    return [alert_status,down_status_changed]

}

module.exports = {
    computeStats
}
