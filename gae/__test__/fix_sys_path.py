"""
GAE path setup borrowed from:
https://cloud.google.com/appengine/docs/python/tools
/localunittesting#Python_Setting_up_a_testing_framework

After this script runs, all `google.appengine.*` packages
are available for import, as well as all GAE-bundled third-party
packages.
"""


import os
import sys


gae_sdk_path = os.path.expanduser('~/google-cloud-sdk/platform/google_appengine')


if gae_sdk_path not in sys.path:
    sys.path.insert(0, gae_sdk_path)


import dev_appserver


dev_appserver.fix_sys_path()
