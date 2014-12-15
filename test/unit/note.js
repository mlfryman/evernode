/* jshint expr:true */

'use strict';

var expect     = require('chai').expect,
    cp         = require('child_process'),
    h          = require('../helpers/helpers'),
    // User       = require('../../server/models/user'),
    Note       = require('../../server/models/note'),
    Lab        = require('lab'),
    lab        = exports.lab = Lab.script(),
    describe   = lab.describe,
    it         = lab.it,
    beforeEach = lab.beforeEach,
    db         = h.getDB();

describe('Note', function(){
  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Note', function(done){
      var note = new Note({});
      // user.id, obj.title, obj.body, obj.tags
      expect(note).to.be.instanceof(Note);
      expect(note.title).to.equal('Test Note');
      done();
    });
  });

// last bracket
});
