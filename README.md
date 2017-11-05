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

1) **The website requests:**
The main loop in the 'src/ping/request.js' file keeps running in the background. Its purpose is simple: ping the
websites and store the output in the database. The promises ensure the logging is done once the request is completed.
We use a similar function to setTimeout to keep track of timing in the loop (since each website has its own
refresh interval).

2) **The console program:**
The program is in charge of calculating the relevant metrics for the websites and log them to the console.
The console refresh timing is set by the user, and is independent of the website ping timing.
The statistics are all calculated in parallel, but the console only updated once all the statistics have been
calculated (note the Promise.all). This of course could be optimized with a tree-like frontend architecture to only
update the relevant node at a time.

3) **The database:**
For simplicity we used a json file as our database. The queries are made using lodash syntax.
It stores the website's data (an array of info returned from the request loop) and status (whether at time t the website is down or not - "down" defined by an availability below x% in the past 2min)


## Improvements

- A class should be created for a *service*. This should be created per website, and would allow more control over an
individual case. This would allow custom alerts, warnings, logic, pausing, resuming, editing...
- A proper event-driven architecture between background workers and the frontend. Sockets could be an idea, fired every
time a frontend update is needed.
- A database such as MongoDB/Redis is well suited for website metrics storage, with an index on url and time.
- A pool of workers that make the ping requests would be ideal. A redis-like queue would help process the websites
and resume work between workers in case of crashes.
- Extend test to all methods. Start with a sandboxed environment everytime you run one function (sandi is an amazing
  nodeJS package for this) and stub all external methods. Finally chai asset every output.
- Use ping instead of a request library (it's pulling loading time here, not response time).
- Parallelize requests from multiple hosts, to get a read on uptime vs. availability.
- Include interesting metrics, such as a read on outliers and page loading time alerts.
- Create a proper frontend :) Graphs, logs, settings, editing are of course obvious pages.


## Author

* **Xavier Green** - *A motivated candidate wanting to join the @Datadog team*
