module.exports = {
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,
  multiCapabilities: [
    {
      'browserName': 'chrome',
      'platform' : 'OS X 10.10',
      'version' : '38',
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      'build': process.env.TRAVIS_BUILD_NUMBER,
      'name': 'App Tests'
    },
    {
      'browserName': 'chrome',
      'platform' : 'OS X 10.10',
      'version' : '37',
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      'build': process.env.TRAVIS_BUILD_NUMBER,
      'name': 'App Tests'
    },
    {
      'browserName': 'chrome',
      'platform' : 'OS X 10.9',
      'version' : '36',
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      'build': process.env.TRAVIS_BUILD_NUMBER,
      'name': 'App Tests'
    },
    {
      'browserName': 'chrome',
      'platform' : 'OS X 10.9',
      'version' : '35',
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      'build': process.env.TRAVIS_BUILD_NUMBER,
      'name': 'App Tests'
    },
    {
      'browserName': 'firefox',
      'platform' : 'OS X 10.10',
      'version' : '34',
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      'build': process.env.TRAVIS_BUILD_NUMBER,
      'name': 'App Tests'
    },
    {
      'browserName': 'firefox',
      'platform' : 'OS X 10.10',
      'version' : '33',
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      'build': process.env.TRAVIS_BUILD_NUMBER,
      'name': 'App Tests'
    },
    {
      'browserName': 'firefox',
      'platform' : 'OS X 10.10',
      'version' : '32',
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      'build': process.env.TRAVIS_BUILD_NUMBER,
      'name': 'App Tests'
    },
    {
      'browserName': 'safari',
      'platform' : 'OS X 10.10',
      'version' : '8',
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      'build': process.env.TRAVIS_BUILD_NUMBER,
      'name': 'App Tests'
    },
    {
      'browserName': 'internet explorer',
      'platform' : 'Windows 7',
      'version' : '11',
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      'build': process.env.TRAVIS_BUILD_NUMBER,
      'name': 'App Tests'
    },
    {
      'browserName': 'internet explorer',
      'platform' : 'Windows 7',
      'version' : '10',
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      'build': process.env.TRAVIS_BUILD_NUMBER,
      'name': 'App Tests'
    }
  ]
};
