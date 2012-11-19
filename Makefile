NODE = node
TEST = ./node_modules/.bin/vows
TESTS ?= test/*-test.js

test:
	@NODE_ENV=test NODE_PATH=lib $(TEST) $(TEST_FLAGS) $(TESTS)

docs:
	docco lib/passport-dailycred/*.js
	cp -r docs ~/rails/dailycred/public/docs/passport-dailycred

docs/api.html: lib/passport-dailycred/*.js
	dox \
		--title Passport-Dailycred \
		--desc "Dailycred authentication strategy for Passport" \
		$(shell find lib/passport-dailycred/* -type f) > $@

docclean:
	rm -f docs/*.{1,html}

.PHONY: test docs docclean
