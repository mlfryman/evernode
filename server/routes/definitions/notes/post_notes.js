'use strict';

var Joi  = require('joi'),
    Note = require('../../../models/note');

module.exports = {
  description: 'Create a Note',
  tags:['notes'],
  payload: {
    //- should limit file size to 3MB 4194304
    maxBytes: 300000000,
    output:'stream',
    parse: true
  },
  validate: {
    payload: {
      title: Joi.string(),
      body: Joi.string(),
      tags: Joi.string(),
      photos: [Joi.array(), Joi.object(), Joi.any().allow(undefined)]
    }
  },
  auth: {
    mode: 'try'
  },
  handler: function(request, reply){
    request.payload.userId = request.auth.credentials.id;
    Note.create(request.payload, function(err, noteId){
      reply({noteId:noteId}).code(err ? 418 : 200);
    });
  }
};
