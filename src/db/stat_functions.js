const moment = require("moment");

const time_deltas = {
    "2min": 2*60*1000+1,
    "10min": 10*60*1000+1,
    "1h": 60*60*1000+1
}
const alert_threshold =  require('./../config/settings').alert_threshold;

computeStats = (website_data, website_url, t_delta) => {

    // console.log("Getting stats for "+website_url);
    const website_stats = website_data.websiteData,
          website_is_down = website_data.is_down;

    const time_delta = time_deltas[t_delta],
          now = moment(new Date());

    let total_time_ms = 0,
        total_requests = 0,
        available_requests = 0,
        max_response_time = 0,
        square_response_time = 0 // will be used for std calculation
        status_codes = {},
        min_timestamp = null,
        max_timestamp = null;

    let last_resp_code = null;

    // Alerts with recovery check
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

        if (stat_response_time) {
            if (status_object.message == "Ok") {
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

    let alert_status = null, down_status_changed = false;

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

module.exports = {
    computeStats
}
