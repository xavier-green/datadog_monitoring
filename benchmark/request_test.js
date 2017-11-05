const axios = require('axios'),
      fetch = require('node-fetch'),
      https = require('https'),
      request = require('request'),
      superagent = require('superagent'),
      bluebird = require('bluebird');

bluebird.promisifyAll(https)

const test_websites = require('./../src/config/default_websites').map((el) => el.url).splice(0, 3);

function httpsPromise(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (resp) => {

      resp.on('data', (d) => {
        resolve(resp.statusCode);
      });

      resp.on('end', (d) => {
        resolve(resp.statusCode);
      });

    }).on('error', (e) => {
      reject();
    });
  })
}

let libraries = [
    {name: 'axios', function: axios.get},
    {name: 'fetch', function: fetch},
    {name: 'https', function: httpsPromise},
    {name: 'request', function: bluebird.promisify(request)},
    {name: 'superagent', function: superagent}
]

testLibraries = () => {

    const loop = Array.from(Array(2).keys()), n = loop.length;

    bluebird.map(libraries, (library) => {
        var totaltime = 0;
        return bluebird.map(loop, () => {
          return bluebird.map(test_websites, (website) => {
            var now = new Date();
            return library.function(website)
            .then(() => {
                totaltime += (new Date()-now)
            })
          })
        })
        .then(() => {
            console.log(library.name, Math.round(totaltime/(3*n)));
        })
    })

}

testLibraries()
