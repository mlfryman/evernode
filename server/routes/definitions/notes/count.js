'use strict';

var Note = require('../../../models/note');

module.exports = {
  description: 'Count all Notes by User',
  tags:['notes'],
  handler: function(request, reply){
    Note.count(request.auth.credentials, function(err, count){
      reply({count:count}).code(err ? 400 : 200);
    });
  }
};
