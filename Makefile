rehydrate: pip-app pip-dev npm

pip-app:
	pip install --requirement=requirements.app.txt --target=./gae/__app_env__

pip-dev:
	pip install --requirement=requirements.dev.txt

npm:
	npm install

coverage: browser-app-coverage gae-app-coverage

gae-app-coverage:
	py.test --cov-report html --cov=gae/app --cov=gae/config
	open __coverage_reports__/gae_app/index.html
	# relies on configuration in `setup.cfg`

browser-app-coverage:
	npm run test:coverage
	open __coverage_reports__/browser_client/*/index.html
	# relies on configuration in `package.json` and
	# in `browser_client/config/karma.make.js`

# TODO:
# 	clean:
# 	build:
# 	deploy:
# 	test:  can this cover testing one and watching?
# 	integration-test:  or functional testing, from the user's perspective
