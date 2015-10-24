rehydrate: pip-app pip-dev npm

pip-app:
	pip install --requirement=requirements.app.txt --target=./app/__app_env__

pip-dev:
	pip install --requirement=requirements.dev.txt

npm:
	npm install

# TODO:
# 	clean:
# 	build:
# 	deploy:
# 	test:  can this cover testing one and watching?
# 	integration-test:  or functional testing, from the user's perspective
