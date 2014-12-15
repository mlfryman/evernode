'use strict';

var Joi  = require('joi'),
    Note = require('../../../models/note');

module.exports = {
  description: 'Upload a Photo',
  tags:['notes'],
  validate: {
    params: {
      noteId: Joi.number().required()
    }
  },
  payload:{
    maxBytes: 4194304, // 2^22 ; 4MB
    output:'stream',
    parse: true,
    // surgically give this route 60s to timeout
    timeout: 60000
  },
  handler: function(request, reply){
    Note.upload(request.auth.credentials, request.payload.file, request.payload.file.hapi.filename, request.params.noteId, function(err){
      reply().code(err ? 400 : 200);
    });
  }
};
