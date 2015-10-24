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
WEBPACK_BUILD_OPTS= --config browser_client/config/webpack.build.js
WEBPACK_PROD_OPTS= -p
WEBPACK_DEV_OPTS= -d --display-reasons --display-chunks --display-error-details
WEBPACK_SERVE_OPTS= --config browser_client/config/webpack.dev.js --history-api-fallback --hot --inline --no-info

_npm-lint:
	$(NPM_BIN)/eslint browser_client/

_npm-build:
	NODE_ENV=production $(NPM_BIN)/webpack $(WEBPACK_PROD_OPTS) $(WEBPACK_BUILD_OPTS)

_npm-build-dev:
	NODE_ENV=development $(NPM_BIN)/webpack $(WEBPACK_BUILD_OPTS) $(WEBPACK_DEV_OPTS)

_npm-serve:
	NODE_ENV=development $(NPM_BIN)/webpack-dev-server $(WEBPACK_SERVE_OPTS)
