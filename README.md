# gae-flask-redux-react-starter-kit

## Getting Set up

* Make virtualenv with virtualenvwrapper and ensure it's active.  E.g., `mkvirtualenv gae-flask-redux-react-starter-kit -a .`
* `pip install --upgrade pip setuptools`
* `add2virtualenv ./gae`
* `add2virtualenv ./gae/__app_env__`
* `add2virtualenv ${HOME}/google-cloud-sdk/platform/google_appengine/`
* `make rehydrate`

## Notes

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
