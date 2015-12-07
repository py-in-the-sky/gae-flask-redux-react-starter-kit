"""
`main` is the top level module where AppEngine gets access
to your Flask application.
"""


from app import create_app
from config import config
from os import environ


server_software_name = environ['SERVER_SOFTWARE']


if server_software_name.startswith('Development'):
    app_config = config['development']
else:
    app_config = config['production']


app = create_app(app_config)
# Note: We don't need to call run() since our application is
# embedded within the App Engine WSGI application server.
