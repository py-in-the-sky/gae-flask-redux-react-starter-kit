virtualenv:
	virtualenv venv --python=python2.7

rehydrate:
	pip install -r requirements.txt && npm install
	make requirements

start:
	npm run build-dev && honcho start

install: dev-install link-gae-env

dev-install: pip-install requirements

uninstall: recursive-uninstall requirements link-gae-env

pip-install:
	pip install $(packages)

requirements:
	pip freeze > requirements.txt

link-gae-env:
	python link_env.py $(packages)

recursive-uninstall:
	pip uninstall $(python link_env.py -r $(pkg))

# TODO:
# clean:
# build:
# deploy:
# test:  can this cover testing one and watching?
# integration-test:  or functional testing, from the user's perspective


# npm helpers; don't call them directly

NPM_BIN=./node_modules/.bin

MOCHA_OPTS= --opts ./user_interface/javascript/__test__/mocha.opts
MOCHA_TARGET=./user_interface/javascript/__test__/**/*test.js

WEBPACK_OPTS= --config webpack.config.js
WEBPACK_PROD_OPTS= -p
WEBPACK_DEV_OPTS= -d --display-reasons --display-chunks --display-error-details
WEBPACK_SERVER_OPTS= --hot --inline --no-info


_npm-test-one:
	NODE_ENV=test $(NPM_BIN)/mocha $(MOCHA_OPTS) $(file) $(opts)

_npm-test:
	NODE_ENV=test $(NPM_BIN)/mocha $(MOCHA_OPTS) --recursive $(opts) $(MOCHA_TARGET)

_npm-test-watch:
	NODE_ENV=test $(NPM_BIN)/mocha -w $(MOCHA_OPTS) --recursive $(MOCHA_TARGET)

_npm-test-cov:
	$(NPM_BIN)/babel-node $(NPM_BIN)/isparta cover $(NPM_BIN)/_mocha -- --recursive

_npm-lint:
	$(NPM_BIN)/eslint user_interface/javascript/

_npm-build:
	NODE_ENV=production $(NPM_BIN)/webpack $(WEBPACK_PROD_OPTS) $(WEBPACK_OPTS)

_npm-build-dev:
	NODE_ENV=development $(NPM_BIN)/webpack $(WEBPACK_OPTS) $(WEBPACK_DEV_OPTS)

_npm-serve:
	NODE_ENV=development $(NPM_BIN)/webpack-dev-server $(WEBPACK_OPTS) $(WEBPACK_SERVER_OPTS)
