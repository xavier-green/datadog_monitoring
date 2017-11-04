const low = require('lowdb'),
      FileSync = require('lowdb/adapters/FileSync'),
      adapter = new FileSync('db.json'),
      db = low(adapter),
      stat_functions = require('./stat_functions'),
      moment = require("moment");

const default_model = {
    websites: []
}

const time_deltas = {
    "10min": 10*60*1000+1,
    "1h": 60*60*1000+1
}

init = (default_websites) => {

      console.log("Initializing database\n");
      db.defaults(default_model).write()
      console.log("Entering the default websites");
      default_websites.map((website) => {
          addNewWebsite(website)
          console.log("Added "+website.url);
      })

}

getWebsiteList = () => {

    return db.get('websites').map('url').value();

}

getWebsiteData = (website_url, filter=null) => {

    if (!(filter)) {
        filter = ()=>{return true}
    }

    const websiteData = db.get('websites')
      .find({url:website_url})
      .get('stats')
      .filter(filter)
      .value();
    const is_down = db.get('websites')
      .find({url:website_url})
      .get('is_down')
      .value();

    return {
      websiteData,
      is_down
    }

}

addNewWebsite = (website) => {

      const url = website.url,
          interval = website.interval;

      db.get('websites').push({
          url,
          interval,
          stats:[],
          is_down: false
      }).write()

}

changeDownValue = (website_url, new_value) => {

    db.get('websites')
      .find({url:website_url})
      .set('is_down', new_value)
      .write();

}

addStat = (website_url, stat_object) => {
    // console.log("writing "+JSON.stringify(stat_object));
    db.get('websites')
      .find({url:website_url})
      .get('stats')
      .push(stat_object)
      .write();
}

computeStats = (website_url, t_delta) => {
    return new Promise((resolve, reject) => {
        let time_filter = (stat) => {
            return (now-moment(stat.timestamp))<time_deltas[t_delta]
        }, now = moment(new Date());
        let website_data = getWebsiteData(website_url, time_filter);
        const web_stats = stat_functions.computeStats(website_data, website_url, t_delta);
        if (web_stats.down_status_changed) {
            console.log("Changing is_down value for "+website_url);
            changeDownValue(website_url, !(website_data.is_down))
        }
        resolve(web_stats)
    })
}

module.exports = {
    addNewWebsite,
    addStat,
    init,
    computeStats,
    getWebsiteList,
    getWebsiteData
};
