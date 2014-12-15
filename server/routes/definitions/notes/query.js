'use strict';

var Joi  = require('joi'),
    Note = require('../../../models/note');

module.exports = {
  description: 'Query Notes',
  tags:['notes'],
  validate: {
    query: {
      limit: Joi.number(),
      offset: Joi.number(),
      tag: Joi.string()
    }
  },
  // allows us to test mobile app
  cors:{origin: ['http://localhost:8100'], credentials: true},
  handler: function(request, reply){
    Note.query(request.auth.credentials, request.query, function(err, notes){
      reply({notes:notes}).code(err ? 400 : 200);
    });
  }
};
