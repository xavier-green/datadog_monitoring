const computeStats =  require('./../src/db/stat_functions').computeStats;

randomNumb = (min, max) => {
    return Math.random()*(max-min)+min;
}
createTimestamp = (max) => { // Max = time in second in the past
    return new Date()-max*1000;
}

const request_errors = [
    { response_time: null, status: { code: 400, message: "Client error" }},
    { response_time: null, status: { code: 401, message: "Client error" }},
    { response_time: null, status: { code: 500, message: "Server error" }},
    { response_time: null, status: { code: 403, message: "Server error" }},
    { response_time: null, status: null}
], request_success = [
    { response_time: randomNumb(300,500), status: { code: 200, message: "Ok" }},
    { response_time: randomNumb(100,900), status: { code: 303, message: "Ok" }},
    { response_time: randomNumb(300,500), status: { code: 201, message: "Ok" }},
    { response_time: randomNumb(100,900), status: { code: 103, message: "Ok" }}
];

const request_types = {
    0: request_errors,
    1: request_success
};

fakeWebsiteData = (max_iterations=50) => {
    let data = [];
    for (var i=0; i<max_iterations; i++) {
        // Randomly bias availability between <65 and >65
        let request_type = (Math.round(randomNumb(0,3)) > 0 ? 1 : 0);
        let requests = request_types[request_type];
        let request_length = requests.length;
        let request_number = Math.round(randomNumb(0, request_length-1));
        let request = requests[request_number];
        request.timestamp = createTimestamp(10)
        data.push(request)
    }
    return data
}

testAlert = () => {
    let test_resuts = {
        alert: 0,
        total_alert: 0,
        recovery: 0,
        total_recovery: 0,
        all_ok: 0,
        total_all_ok: 0
    }

    for (var i=0; i<100; i++) {
          let data = fakeWebsiteData();
          let is_down = (Math.round(Math.random())==0 ? false : true);
          let final_data = {
              websiteData: data,
              is_down
          }
          const result = computeStats(final_data, "http://test.com", "1h");
          const alert = result.alert,
                availability = result.availability;
          if (availability<80) {
              test_resuts['total_alert'] += 1
              if (alert && (alert.text.indexOf("down") !== (-1))) {
                  test_resuts['alert'] += 1
              } else {
                  console.log(result,"\n");
                  throw "An error alert should have appeared";
              }
          } else {
              if (is_down) {
                  test_resuts['total_recovery'] += 1
                  if (alert && (alert.text.indexOf("recovered") !== (-1))) {
                      test_resuts['recovery'] += 1
                  } else {
                      console.log(result,"\n");
                      throw "An recovery notification should have appeared";
                  }
              } else {
                  test_resuts['total_all_ok'] += 1
                  if (!(alert)) {
                      test_resuts['all_ok'] += 1
                  } else {
                      console.log(result,"\n");
                      throw "No error should have appeared";
                  }
              }
          }
    }
    console.log("\nAll okay: "+test_resuts['all_ok'].toString()+"/"+test_resuts['total_all_ok'].toString()+" passed");
    console.log("Recovery: "+test_resuts['recovery'].toString()+"/"+test_resuts['total_recovery'].toString()+" passed");
    console.log("Alerts: "+test_resuts['alert'].toString()+"/"+test_resuts['total_alert'].toString()+" passed");

}

testAlert();
