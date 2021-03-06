rehydrate: pip npm

pip: pip-app pip-dev

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

check:
	py.test --flakes gae/app gae/config/ gae/__test__/
	npm run check

build: clean
	npm run build

deploy: check build
	appcfg.py -A your-app-id-here update gae/

clean:
	rm -vf gae/static/main.js gae/static/index.html
