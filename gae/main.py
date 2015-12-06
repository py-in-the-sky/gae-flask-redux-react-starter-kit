"""
`main` is the top level module where AppEngine gets access
to your Flask application.
"""


from app import create_app
from os import environ


debug = environ['SERVER_SOFTWARE'].startswith('Development')


app = create_app(debug)
# Note: We don't need to call run() since our application is
# embedded within the App Engine WSGI application server.
