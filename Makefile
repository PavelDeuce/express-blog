install:
	npm install

start:
	DEBUG="blog" npm run start

start-heroku:
	DEBUG="blog" heroku local web DEBUG="blog"

lint:
	npm run lint

test:
	npm run test

test-coverage:
	npm run test-coverage
