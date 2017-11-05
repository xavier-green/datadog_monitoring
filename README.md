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


## Improvements

- event managed between front and back (socket?) to add new web, pause, stop, run..
- class to manage a 'service' that hold one url
- test through all methods, by using a sandboxed environment (sandi for ex) and stubs on external methods, chai assert
- dynamic frontend update (if web, smthg like reactjs - especially if reload time < refresh request time)
- use ping instead of a request library (it's pulling loading time here, not response time)


## Author

* **Xavier Green** - *A motivated candidate wanting to join the @Datadog team*
