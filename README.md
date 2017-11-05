# Datadog Monitoring Project

The (very) simple node application will help you monitor your websites.
Metrics included:
 - availability
 - mean, max response time
 - standard deviation of response time
 - map of status codes
 - downtime
 - alerts

## Getting Started

This is a beta project, to be used as an experiment. Follow the simple instructions below to install.

### Prerequisites

What things you need to install the software and how to install them

```
- Node JS
- npm
```

### Installing

Only a few basic dependencies are needed, run this command to install them (in the root directory)

```
npm install
```

This will install:
 - axios (for the web requests, promise-based)
 - bluebird (great for promise manipulation)
 - cli-table (nice colors and tables in the log console)
 - fs (to write logs)
 - lowdb (to use a json file as a database, with optimized queries through lodash)
 - moment (easy date manipulation and formatting)

You should now be able to start the program with the following command:

```
npm start
```


## Running the tests

More to come, for now only the alerting logic includes a test file. To test, run:

```
npm test
```

## How it works

Instead of using eventEmitters, sockets or a proper queue this program is based on javascript's asynchronous nature.
There are 3 parts to the project:

1) **The website requests**
The main loop in the 'src/ping/request.js' file keeps running in the background. Its purpose is simple: ping the
websites and store the output in the database. The promises ensure the logging is done once the request is completed.
We use a similar function to setTimeout to keep track of timing in the loop (since each website has its own
refresh interval).

2) **The console program**
The program is in charge of calculating the relevant metrics for the websites and log them to the console.
The console refresh timing is set by the user, and is independent of the website ping timing.
The statistics are all calculated in parallel, but the console only updated once all the statistics have been
calculated (note the Promise.all). This of course could be optimized with a tree-like frontend architecture to only
update the relevant node at a time.

3) **The database**
For simplicity we used a json file as our database. The queries are made using lodash syntax.
It stores:
  - the website's data (an array of info returned from the request loop)
  - status (whether at time t the website is down or not - "down" defined by an availability below x% in the past 2min)


## Improvements

- event managed between front and back (socket?) to add new web, pause, stop, run..
- class to manage a 'service' that hold one url
- test through all methods, by using a sandboxed environment (sandi for ex) and stubs on external methods, chai assert
- dynamic frontend update (if web, smthg like reactjs - especially if reload time < refresh request time)
- use ping instead of a request library (it's pulling loading time here, not response time)


## Author

* **Xavier Green** - *A motivated candidate wanting to join the @Datadog team*
