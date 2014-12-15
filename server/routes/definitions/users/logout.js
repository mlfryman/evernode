'use strict';

module.exports = {
  description: 'Logout a User',
  tags:['users'],
  handler: function(request, reply){
    request.auth.session.clear();
    reply();
  }
};
