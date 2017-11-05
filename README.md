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
NodeJS :)
```

### Installing

Only a few basic dependencies are needed, run this command to install them (in the root directory)

```
npm i
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

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc



To improve:
 - event managed between front and back (socket?) to add new web, pause, stop, run..
 - class to manage a 'service' that hold one url
 - test through all methods, by using a sandboxed environment (sandi for ex) and stubs on external methods, chai assert
 - dynamic frontend update (if web, smthg like reactjs - especially if reload time < refresh request time)
 - use ping instead of a request library (it's pulling loading time here, not response time)
