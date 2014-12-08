'use strict';

var Joi  = require('joi'),
    Note = require('../../../models/note');

module.exports = {
  description: 'Find one note for logged in user',
  tags:['notes'],
  validate: {
    params: {
      noteId: Joi.number()
    }
  },
  auth: {
    mode: 'try'
  },
  handler: function(request, reply){
    request.params.userId = request.auth.credentials.id;
    Note.findOne(request.params, function(err, note){
      console.log('SERVER GET_NOTE CTRL - Note.findOne ERROR: ', err);
      console.log('SERVER GET_NOTE CTRL - Note.findOne NOTE: ', note);
      reply(note).code(err ? 400 : 200);
      console.log('SERVER GET_NOTE CTRL - get_note REPLY(note): ', note);
    });
  }
};
