"""
Point appengine to third-party Python libraries in the project.
"""


import os, sys


sys.path.insert(1, os.path.join(os.path.abspath('.'), '__app_env__'))
