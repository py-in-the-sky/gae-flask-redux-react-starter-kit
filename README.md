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
* `add2virtualenv ./gae ./gae/__app_env__`
* `make rehydrate`


## Development

* `workon your-virtualenv-name`

This will activate the project's virtualenv and `cd` you into its root directory.

* `honcho start`

This is at the heart of the devlopment process.  It will run the Google App Engine and Webpack development servers, as well as the Karma and Pytest test runners, both in watch mode.  You will have a live instance of the application and will see the logging output of each of the processes in the terminal, each process having its own color.  Use this development mode to implement new features in your app; the changes will be live reloaded as the app runs and cause relevant tests to re-run.

Furthermore, if you'd like to interact with the app directly, you can visit the `/_console` path in your browser (i.e., `localhost:8080/_console`).  You can also instert a `werkzeug_debugger()` call in the code to interact with the app at a specific point in execution, and then when this code is activated by an HTTP request from the browser client, an interactive Werkzeug debugger stack trace will open in the browser.

* `honcho start gae pytest`

If you're working solely on the back end and want to spin up only the relevant processes (i.e., the GAE dev server and Pytest test runner), you can run this command.  You can interact with the application via a client like [Postman](https://www.getpostman.com/).  You can also work interactively with the application via the GAE dev server's [console](https://cloud.google.com/appengine/docs/python/tools/devserver?hl=en#Python_The_Interactive_Console) or via `localhost:8080/_console`.

* `dev_appserver.py gae/ --show_mail_body True --allow_skipped_files True`

If you'd like to interact with the application via the command line, you'll need to run the application directly, instead of through `honcho`.  You can activate the [Python debugger](https://docs.python.org/2/library/pdb.html) by inserting this line `import pdb; pdb.set_trace();` in the code and calling an API endpoint that activates the line.  When the debugger is active, you'll find the `pdb` prompt in the terminal running the application.  See [Python debuggin with pdb](https://cloud.google.com/appengine/docs/python/tools/devserver#Python_Debugging_with_PDB).

* `make coverage`

This command will run the full test suites for the browser client and the back end, both in code-coverage mode.  When each of the two coverage reports are done, they'll open in your default web browser.

* `make check`

Run linting and testing for both the GAE application and the browser client.

This command will lint and test the browser client and back end code.  If no linting problems are encountered and all tests pass, the process will exit without an error.

* `py.test`

This will perform a one-off test run of the GAE/Flask application.  (NB: local config for `pytest` is in `setup.cfg`.)

* `npm test`

This will perform a one-off test run of the browser client.  (NB: config for this command is in `package.json`.)

* `bpython` and `ptpython`

These are both useful Python shells.  When you're using one of them, you may want to run the following `import` statement:

* `import __test__.fix_sys_path` (in Python file or shell)

This is used in the tests to ensure all `google.appengine.*` packages are available for import, in addition to all GAE-bundled third-party packages.  There will be no live application as there is with the dev console (see notes under `honcho start gae pytest` above), so functionality that relies on a service backing it (e.g., many `google.appengine.nbd` functions rely on a datastore connection) will not be available.  Nevertheless, it's still useful to have these packages available for import because you can explore them easily thanks to the autocomplete feature of the Python shells listed above.  Futhermore, you can create a temporary fake application to play with, using `testbed` and a test app; see the `testbed` fixture in `gae/__test__/conftest.py` and the `app` fixture in `gae/__test__/test_app.py` for examples of how to set up a temporary test app.

* `py.test --pep8 gae/__test__/ gae/app gae/config/`

Use this command occasionally to check for style issues.  `pep8` is very strict, and it's fine not to try to correct all the errors it raises.

* debug and profiling development modes

In `gae/config/development.py`, the `DEBUG` and `PROFILE` feature flags control whether the development app runs in debug and profiling mode, respectively.  While the app is running, you can toggle these flags between `1` and `0` (meaning "on" and "off," respectively).  When you toggle these flags (or make any changes to the app), the GAE dev server's live reloading will ensure your app's config is up to date; there's no need to restart the server for your config changes to take effect.

In debug mode, any uncaught errors will open a Werkzeug interactive stack trace in the browser, allowing you to execute code against the app and investigate errors.  In profiling mode, for each HTTP request, the app will log the slowest function calls involved in its processing the request-response cycle.

* `Perf` in browser's dev console

You can profile your React components by running the app in dev mode, opening it in the browser, and using the global `Perf` object from the browser's dev console.  The `Perf` object is attached to the `window` object by the app, and [it allows](https://facebook.github.io/react/docs/perf.html) you gather different profiling statistics on your React components.  Here's an example usage from the browser's dev console that could be very useful:

```js
Perf.start()
// perform some user interactions in the app...
Perf.stop()
Perf.printWasted()
// view table of the time spent, and where, on unnecessary re-renders
```


## Managing Dependencies

### Browser Client

After updating or adding npm packages, run `npm run test:coverage` in addition to running the app and verifying things still work as expected.  Then lock down the specific versions of the npm packages you're using with this command:

* `npm shrinkwrap --dev`

This will update `npm-shrinkwrap.json`; `npm install` uses this file by default, which will ensure you're using the exact same version of third-parth npm packages across environments.  (NB: if you're familiar with Ruby on Rails development with Bundler, you can think of `npm-shrinkwrap.json` as being like `Gemfile.lock`.)

### GAE/Flask Application

* `make pip-app` or `make pip-dev`

To add a new dependency to your project, add `<package name>==<version number>` to `requirements.app.txt` or `requirements.dev.txt`, and then run the corresponding command above to install the dependency.  `requirements.app.txt` is used to install your app's dependency in `gae/__app_env__`, which is deployed with your app to the GAE servers.  `requirements.dev.txt` is used to install all other dependencies (e.g., `pytest`), which are only needed for development and are installed in `virtualenvwrapper`'s default manner.

* `pipdeptree`

This command will produce a visualization of your pip-installed packages, which is useful for maintaining the `requirements.*.txt` files.  All of the package names that align to the left of the terminal window comprise the minimal set of names for your `requirements.dev.txt` and `requirements.app.txt` files.  If there are any sub-dependencies whose version numbers you'd like to pin, add them to the the relevant requirements files as well.

### Verify Everything's Working

Installing new dependencies frequently comes with changes, sometimes radical, to how the development process or the app itself works.  A fairly quick and comprehensive way to verify everything's still working as expected is to follow these steps:

* Run `make coverage` and verify all tests and coverage reports run successfully.
* Run `make clean && honcho start gae webpack`, open the app in the browser with the devtools console open, and interact with a selection of features/pages in the app.  Look at the browser's devtools console as well as the log output in the terminal you've used to run the above command and verify no unexpected errors occur.
* Run `make build && honcho start gae` and follow the same steps outlined in the point above.  Now you're verifying that the build version of the app works with no unexpected errors.


## Deployment

Make sure you have a GAE account and have created the project under your account ([details](https://cloud.google.com/appengine/docs/python/gettingstartedpython27/uploading)).

Also make sure you've replaced "your-app-id-here" with your project's ID under the `application` field in `gae/app.yaml` and in the `deploy` field of the `Makefile`.

Then use this command to build and deploy your project:

* `make deploy`

This will build and deploy your app.  (NB: the `make deploy` command runs `make check` as a dependency before the build and deploy steps are run.)

Once the app is deployed you can use the [GAE console](https://console.cloud.google.com) (or [this alternative](https://appengine.google.com/)) and the [remote API](https://cloud.google.com/appengine/docs/python/tools/remoteapi) to manage and interact with the deployed application.


## Notes and Bookmarks

### Use of `deepFreeze` in test mode for the browser client

Sharing mutable data among your components is bad only if the data is actually mutated.  And it's worse if it's mutated without your knowing!  Using [`deepFreeze`](https://github.com/AnatoliyGatt/deep-freeze-node) in your tests will let you know if any mutations happen in your app's runtime.

The browser client's tests make extensive use of `deepFreeze`.  This means that any unexpected mutative behavior in the app will throw an error during test time, warning you of this undesirable behavior.  Continuing to write tests like this as your app develops will protect you from accidentally introducing undesirable behavior in your app (maybe passing your state as the first argument to `Object.assign`).

This has the added benefit of freeing you from having to always use ImmutableJS structures, or some other immutable structures, just for the sake of implementing an app that treats data as immutable.  Then you're free to choose ImmutableJS only when there's a clear performance or convenience benefit.  Sometimes it's convenient just to use plain JS objects for read-only state that will not be updated during the app's life.

### Importing from `react-pure-render/component`

When importing this class, I bind it to the name "Component" rather than "PureComponent"; this is to [help](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prop-types.md#about-component-detection) eslint detect React components in the code and enforce important lint rules.

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
