'use strict';

module.exports = {
  description: 'Get User Status',
  tags:['users'],
  handler: function(request, reply){
    reply(request.auth.credentials);
  }
};
