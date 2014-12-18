module.exports = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  // can only test 1 browser when debugging
  multiCapabilities: [
    {
      'browserName': 'chrome'
    },
    {
      'browserName': 'firefox'
    }
  ]
};
