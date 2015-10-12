rehydrate: pip-install-app pip-install-dev npm-install

pip-install-app:
	pip install --requirement=requirements.app.txt --target=./app/__app_env__

pip-install-dev:
	pip install --requirement=requirements.dev.txt

# link-venv:
# 	add2virtualenv ./app/__app_env__

npm-install:
	npm install





# TODO:
# clean:
# build:
# deploy:
# test:  can this cover testing one and watching?
# integration-test:  or functional testing, from the user's perspective


# npm helpers; don't call them directly

NPM_BIN=./node_modules/.bin

MOCHA_OPTS= --opts ./browser_client/__test__/mocha.opts
MOCHA_TARGET=./browser_client/__test__/**/*test.js

WEBPACK_OPTS= --config webpack.config.js
WEBPACK_PROD_OPTS= -p
WEBPACK_DEV_OPTS= -d --display-reasons --display-chunks --display-error-details
WEBPACK_SERVER_OPTS= --hot --inline --no-info


_npm-test-one:
	NODE_ENV=test $(NPM_BIN)/mocha $(MOCHA_OPTS) $(file) $(opts)

_npm-test:
	NODE_ENV=test $(NPM_BIN)/mocha $(MOCHA_OPTS) --recursive $(opts) $(MOCHA_TARGET)

_npm-test-watch:
	NODE_ENV=test $(NPM_BIN)/mocha -w $(MOCHA_OPTS) --reporter=dot --recursive $(MOCHA_TARGET)

_npm-test-cov:
	$(NPM_BIN)/babel-node $(NPM_BIN)/isparta cover $(NPM_BIN)/_mocha -- --recursive

_npm-lint:
	$(NPM_BIN)/eslint browser_client/

_npm-build:
	NODE_ENV=production $(NPM_BIN)/webpack $(WEBPACK_PROD_OPTS) $(WEBPACK_OPTS)

_npm-build-dev:
	NODE_ENV=development $(NPM_BIN)/webpack $(WEBPACK_OPTS) $(WEBPACK_DEV_OPTS)

_npm-serve:
	NODE_ENV=development $(NPM_BIN)/webpack-dev-server $(WEBPACK_OPTS) $(WEBPACK_SERVER_OPTS)
