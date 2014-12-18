test:
	@node node_modules/lab/bin/lab -v -m 5000 test/unit test/acceptance
test-cov:
	@node node_modules/lab/bin/lab -r lcov
test-e2e:
	@node node_modules/protractor/bin/protractor protractor.conf.js

.PHONY: test test-cov test-e2e
