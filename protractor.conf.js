var config;

if(process.env.TRAVIS_JOB_NUMBER){
  config = require('./protractor-sauce.conf');
}else{
  config = require('./protractor-local.conf');
}
// define the homepage suite
// run every .spec.js file in the ______ test dir
config.suites = {
  homepage: 'test/e2e/homepage/**/*.spec.js',
  authentication: 'test/e2e/authentication/**/*.spec.js',
  notes: 'test/e2e/notes/**/*.spec.js'
};

config.jasmineNodeOpts = {
  isVerbose: true,
  showColors: true,
  defaultTimeoutInterval: 30000
};

config.baseUrl = 'http://localhost:8080';

exports.config = config;
