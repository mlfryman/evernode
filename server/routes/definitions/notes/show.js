'use strict';

var Joi  = require('joi'),
    Note = require('../../../models/note');

module.exports = {
  description: 'Show Note',
  tags:['notes'],
  validate: {
    params: {
      noteId: Joi.number().required()
    }
  },
  handler: function(request, reply){
    Note.show(request.auth.credentials, request.params.noteId, function(err, note){
      reply(note).code(err ? 400 : 200);
    });
  }
};
