'use strict';

module.exports = [
  {
    plugin: require('good'),
    options: {
      reporters: [{
        reporter: require('good-console'),
        args: [{log: '*', request: '*'}]
      }]
    }
  },
  {
    plugin: require('lout')
  },
  {
    plugin: require('hapi-auth-cookie')
  }
];
