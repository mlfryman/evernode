'use strict';

module.exports = {
  description: 'Logout a User',
  tags:['users'],
  // allows us to test mobile app
  cors:{origin: ['http://localhost:8100'], credentials: true},
  handler: function(request, reply){
    request.auth.session.clear();
    reply();
  }
};
