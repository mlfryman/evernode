var config = {};

config.seleniumAddress = 'http://localhost:4444/wd/hub';
config.multiCapabilities = [
  // {
  //   'browserName': 'chrome'
  // },
  {
    'browserName': 'firefox'
  }
];
// define the homepage suite
// run every .spec.js file in the homepage test dir
config.suites = {
  homepage:'test/e2e/homepage/**/*.spec.js',
  authentication: 'test/e2e/authentication/**/*.spec.js',
  notes:'test/e2e/notes/**/*.spec.js'
};

config.jasmineNodeOpts = {
  isVerbose: true,
  showColors: true,
  defaultTimeoutInerval: 30000
};

config.baseUrl = 'http://localhost:8080';

exports.config = config;
