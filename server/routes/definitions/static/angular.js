'use strict';

module.exports = {
  description: 'Static Angular Routes',
  tags:['static'],
  auth: false,
  handler: {
    directory: {
      path: __dirname + '/../../../../public'
    }
  }
};
