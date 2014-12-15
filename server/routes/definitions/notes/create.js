'use strict';

var Joi  = require('joi'),
    Note = require('../../../models/note');

module.exports = {
  description: 'Create a Note',
  tags:['notes'],
  validate: {
    payload: {
      title: Joi.string().required(),
      body: Joi.string().required(),
      tags: Joi.string().required()
    }
  },
  handler: function(request, reply){
    Note.create(request.auth.credentials, request.payload, function(err, noteId){
      reply({noteId:noteId}).code(err ? 400 : 200);
    });
  }
};
