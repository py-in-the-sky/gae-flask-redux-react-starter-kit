# gae-flask-redux-react-starter-kit


## Prereqs

* Python 2.7 (suggestion: on OSX, use the [Hombebrew](http://brew.sh/) [installation](http://docs.python-guide.org/en/latest/starting/install/osx/) and follow the brew prompt's directions to overwrite links)
* [gcloud sdk](https://cloud.google.com/sdk/) ([also](http://googlecloudplatform.github.io/gcloud-python/stable/) [see](https://cloud.google.com/python/))
* [virtualenvwrapper](https://virtualenvwrapper.readthedocs.org/en/latest/) ([also](http://virtualenvwrapper.readthedocs.org/en/latest/install.html#shell-startup-file) [see](http://mathematism.com/2009/07/30/presentation-pip-and-virtualenv/))
* [Node](https://nodejs.org/en/) (>= v4) (suggestion: on OSX, use the Homebrew installation)
* [react-devtools](https://github.com/facebook/react-devtools)


## Getting Set up

* git clone this repo and then `cd` into it
* make a virtualenv and ensure it's active.  E.g., `mkvirtualenv your-virtualenv-name -a .`
* `pip install --upgrade pip setuptools`
* `add2virtualenv ./gae`
* `add2virtualenv ./gae/__app_env__`
* `add2virtualenv ${HOME}/google-cloud-sdk/platform/google_appengine/` ([see](http://stackoverflow.com/questions/25525258/add-appengine-sdk-to-python-path))
* `make rehydrate`


## Development

* `workon your-virtualenv-name`

This will activate the project's virtualenv and `cd` you into its root directory.

* `honcho start`

This is at the heart of the devlopment process.  It will run the Google App Engine and Webpack development servers, as well as the Karma and Pytest test runners, both in watch mode.  You will have a live instance of the application and will see the logging output of each of the processes in the terminal, each process having its own color.  Use this development mode to implement new features in your app; the changes will be live reloaded as the app runs and cause relevant tests to re-run.

Furthermore, if you'd like to interact with the app directly, you can instert a `werkzeug_debugger()` call in the code, and then when this code is activated by an HTTP request from the browser client, an interactive Werkzeug debugger stack trace will open in the browser.

* `honcho start gae pytest`

If you're working solely on the back end and want to spin up only the relevant processes (i.e., the GAE dev server and Pytest test runner), you can run this command.  You can interact with the application via a client like [Postman](https://www.getpostman.com/).  You can also work interactively with the application via the GAE dev server's [console](https://cloud.google.com/appengine/docs/python/tools/devserver?hl=en#Python_The_Interactive_Console).

* `dev_appserver.py gae/ --show_mail_body True --allow_skipped_files True`

If you'd like to interact with the application via the command line, you'll need to run the application directly, instead of through `honcho`.  You can activate the [Python debugger](https://docs.python.org/2/library/pdb.html) by inserting this line `import pdb; pdb.set_trace();` in the code and calling an API endpoint that activates the line.  When the debugger is active, you'll find the `pdb` prompt in the terminal running the application.

* `make coverage`

This command will run the full test suites for the browser client and the back end, both in code-coverage mode.  When each of the two coverage reports are done, they'll open in your default web browser.

* `make check`

Run linting and testing for both the GAE application and the browser client.

This command will lint and test the browser client and back end code.  If no linting problems are encountered and all tests pass, the process will exit without an error.

* `py.test`

This will perform a one-off test run of the Flask/GAE application.  (NB: local config for `pytest` is in `setup.cfg`.)

* `npm test`

This will perform a one-off test run of the browser client.  (NB: config for this command is in `package.json`.)

* managing dependencies

TODO: paragraph on updating/adding python packages and updating the `pip` requirements files

TODO: paragraph on updating/adding node packages and updating `package.json` and `npm-shrinkwrap.json`


## Deployment

Make sure you have a GAE account and have created the project under your account ([details](https://cloud.google.com/appengine/docs/python/gettingstartedpython27/uploading)).

Also make sure you've replaced "your-app-id-here" with your project's ID under the `application` field in `gae/app.yaml` and in the `deploy` field of the `Makefile`.

Then use this command to build and deploy your project:

* `make deploy`


## Notes and Bookmarks

### Flask Callbacks and Decorators

Using Flask-RESTful, the order in which callbacks and decorators are invoked in a request-response cycle is roughly this:

Incoming request:

* app `before_request`
* blueprint `before_app_request`
* blueprint `before_request`
* api decorators, rightmost to leftmost
* resource decorators, rightmost to leftmost
* view fn decorators, top to bottom

Outgoing response:

* view fn decorators, bottom to top
* resource decorators, leftmost to rightmost
* api decorators, leftmost to rightmost
* `after_this_request`
* blueprint `after_request`
* blueprint `after_app_request`
* app `after_request`

After response is sent:

* app teardown_request

That's the rough idea.  However, for peer callbacks, the order of invocation depends on when the peers are registered with the app.

For the peers app `before_request` and all blueprint `before_app_request`s, the order in which they're invoked for an incoming request is the order in which they're registered with the app.

For the peers app `after_request` and all blueprint `after_app_request`s, the order in which they're invoked for an outgoing response is the reverse of the order in which they're registered with the app.

This information about the sequencing of peers is important.  For maintainability, these high-level callbacks should depend as little as possible on their relative sequencing.  However, for decorators, it's much easier to maintain sequential dependencies since there sequence is explicit in their colocation in the code and, possibly, their functional contracts.
