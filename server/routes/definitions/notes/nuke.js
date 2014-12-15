'use strict';

var Joi  = require('joi'),
    Note = require('../../../models/note');

module.exports = {
  description: 'Delete Note',
  tags:['notes'],
  validate: {
    params: {
      noteId: Joi.number().required()
    }
  },
  handler: function(request, reply){
    Note.nuke(request.auth.credentials, request.params.noteId, function(err, noteId){
      reply({noteId:noteId}).code(err ? 400 : 200);
    });
  }
};
