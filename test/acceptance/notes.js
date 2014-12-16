/* jshint expr:true */

'use strict';

var expect     = require('chai').expect,
    cp         = require('child_process'),
    // fs         = require('fs'),
    h          = require('../helpers/helpers'),
    Note       = require('../../server/models/note'),
    server     = require('../../server/index'),
    Lab        = require('lab'),
    lab        = exports.lab = Lab.script(),
    describe   = lab.describe,
    it         = lab.it,
    beforeEach = lab.beforeEach,
    db         = h.getDB();

describe('Notes', function(){
  var cookie,
      noteId;

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      Note.create({id:1}, {title:'a',body:'b',tags:'c,d,e'}, function(err, results){
        noteId = results;
      });

      var options = {
        method: 'POST',
        url: '/login',
        payload: {
          username: 'bob',
          password: '123'
        }
      };

      server.inject(options, function(response){
        cookie = response.headers['set-cookie'][0].match(/hapi-cookie=[^;]+/)[0];
        done();
      });
    });
  });

  describe('POST /notes', function(){
    it('should create a new Note', function(done){
      var options = {
        method: 'POST',
        url: '/notes',
        headers: {
          cookie: cookie
        },
        payload: {
          title: 'Test Note',
          body: 'This is a test note.',
          tags: 'test,notes'
        }
      };

      server.inject(options, function(response){
        // console.log('POST /notes test response: ', response);
        expect(response.statusCode).to.equal(200);
        expect(response.result.noteId).to.be.a('number');
        done();
      });
    });
  });

  describe('GET /notes', function(){
    it('should query a User\'s Notes', function(done){
      var options = {
        method: 'GET',
        url: '/notes',
        headers: {
          cookie: cookie
        },
        query: {
          limit: 10,
          offset: 5,
          tag: 'test'
        }
      };

      server.inject(options, function(response){
        expect(response.statusCode).to.equal(200);
        expect(response.result.notes).to.have.length(1);
        done();
      });
    });
  });

  describe('GET /notes/{noteId}', function(){
    it('should show one Note', function(done){
      var options = {
        method: 'GET',
        url: '/notes',
        headers: {
          cookie: cookie
        },
        params: {
          noteId: 1
        }
      };

      server.inject(options, function(response){
        console.log('GET /note test response: ', response);
        expect(response.statusCode).to.equal(200);
        expect(response.result.notes).to.have.length(1);
        done();
      });
    });
  });
});
