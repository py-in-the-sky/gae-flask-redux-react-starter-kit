"""
Point appengine to third-party Python libraries in the project.
"""

import os, sys

app_env = os.path.join(os.path.abspath('.'), 'app_env')
sys.path.insert(1, app_env)
