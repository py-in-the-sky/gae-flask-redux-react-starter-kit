import pytest
import os
import sys
import dev_appserver

dev_appserver.fix_sys_path()
# GAE path setup borrowed from :
# https://cloud.google.com/appengine/docs/python/tools
# /localunittesting#Python_Setting_up_a_testing_framework
# Now google.appengine.* packages are available, as well as
# all GAE-bundled third-party packages.

from google.appengine.ext.testbed import Testbed
from google.appengine.ext import ndb


# @pytest.fixture(scope='session', autouse=True)
# def global_setup_and_teardown(request):
#     """
#     use of pytest fixture borrowed from:
#     http://stackoverflow.com/questions/14399908
#     /py-test-setup-teardown-for-whole-test-suite
#     """
#     pass


@pytest.yield_fixture(scope='function')
def testbed():
    testbed = Testbed()
    testbed.activate()
    # testbed.setup_env(app_id='_')
    os.environ['APPLICATION_ID'] = '_'
    # this is a hack to get things working; `testbed.setup_env` does
    # not seem to be doing the job
    # see:
    # http://einaregilsson.com/unit-testing-model-classes-in-google-app-engine/

    # will almost always need datastore for tests that use this fixture
    testbed.init_datastore_v3_stub()
    # ndb uses memcache, so stub it as well
    testbed.init_memcache_stub()
    # clear in-context memcache before test
    ndb.get_context().clear_cache()

    yield testbed

    ndb.get_context().clear_cache()
    testbed.deactivate()
