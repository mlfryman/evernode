var config;

if(process.env.TRAVIS_JOB_NUMBER){
  config = require('./protractor-sauce.conf');
}else{
  config = require('./protractor-local.conf');
}
// run every .spec.js file in the ______ test dir
config.suites = {
  homepage: 'test/e2e/homepage/**/*.spec.js',
  authentication: 'test/e2e/authentication/**/*.spec.js',
  notes: 'test/e2e/notes/**/*.spec.js'
};

config.jasmineNodeOpts = {
  isVerbose: true,
  showColors: true,
  defaultTimeoutInterval: 300000
};

config.baseUrl = 'http://localhost:9001';

exports.config = config;
