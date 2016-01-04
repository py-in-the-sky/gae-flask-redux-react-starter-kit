import pytest
import os
from google.appengine.ext.testbed import Testbed
from google.appengine.ext import ndb
# import dev_appserver


# @pytest.fixture(scope='session', autouse=True)
# def global_setup_and_teardown(request):
#     """
#     setup borrowed from:
#     https://cloud.google.com/appengine/docs/python/tools
#     /localunittesting#Python_Setting_up_a_testing_framework

#     use of pytest fixture borrowed from:
#     http://stackoverflow.com/questions/14399908
#     /py-test-setup-teardown-for-whole-test-suite
#     """
#     # Ensure that the google.appengine.* packages are available
#     # in tests as well as all bundled third-party packages.
#     dev_appserver.fix_sys_path()


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
