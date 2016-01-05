gae: dev_appserver.py gae/ --show_mail_body True --allow_skipped_files True
webpack: npm --silent start
karma: npm run --silent test:watch
pytest: $(npm bin)/watch 'py.test' gae/app/ gae/__test__/ --wait=10 -d
