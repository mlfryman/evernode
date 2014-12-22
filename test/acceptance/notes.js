/* jshint expr:true */

'use strict';

var expect     = require('chai').expect,
    cp         = require('child_process'),
    h          = require('../helpers/helpers'),
    server     = require('../../server/index'),
    Lab        = require('lab'),
    lab        = exports.lab = Lab.script(),
    describe   = lab.describe,
    it         = lab.it,
    beforeEach = lab.beforeEach,
    db         = h.getDB();

describe('Notes', function(){
  var cookie, noteId;

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      var options1 = {
        method: 'POST',
        url: '/login',
        payload: {
          username: 'bob',
          password: '123'
        }
      };

      server.inject(options1, function(response){
        cookie = response.headers['set-cookie'][0].match(/hapi-cookie=[^;]+/)[0];
        var options2 = {
          method: 'POST',
          url: '/notes',
          payload: {
            title: 'a',
            body: 'b',
            tags: 'c,d,e'
          },
          headers:{
            cookie:cookie
          }
        };

        server.inject(options2, function(response){
          noteId = response.result.noteId;
          done();
        });
      });
    });
  });

  describe('post /notes', function(){
    it('should create a note', function(done){
      var options = {
        method: 'POST',
        url: '/notes',
        payload: {
          title: 'a',
          body: 'b',
          tags: 'c,d,e'
        },
        headers:{
          cookie:cookie
        }
      };

      server.inject(options, function(response){
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
    it('should NOT create a note - missing title', function(done){
      var options = {
        method: 'POST',
        url: '/notes',
        payload: {
          body: 'b',
          tags: 'c,d,e'
        },
        headers:{
          cookie:cookie
        }
      };

      server.inject(options, function(response){
        expect(response.statusCode).to.equal(400);
        done();
      });
    });
  });

  describe('get /notes', function(){
    it('should get notes', function(done){
      var options = {
        method: 'GET',
        url: '/notes',
        headers:{
          cookie:cookie
        }
      };

      server.inject(options, function(response){
        expect(response.statusCode).to.equal(200);
        expect(response.result.notes).to.have.length(1);
        done();
      });
    });
    it('should NOT get notes - user logged out', function(done){
      var options = {
        method: 'GET',
        url: '/notes'
      };

      server.inject(options, function(response){
        expect(response.statusCode).to.equal(401);
        done();
      });
    });
  });

  describe('get /notes/count', function(){
    it('should get notes count', function(done){
      var options = {
        method: 'GET',
        url: '/notes/count',
        headers:{
          cookie:cookie
        }
      };

      server.inject(options, function(response){
        expect(response.statusCode).to.equal(200);
        expect(response.result.count).to.equal('1');
        done();
      });
    });
    it('should NOT get notes count - user logged out', function(done){
      var options = {
        method: 'GET',
        url: '/notes/count'
      };

      server.inject(options, function(response){
        expect(response.statusCode).to.equal(401);
        done();
      });
    });
  });


  describe('get /notes/3', function(){
    it('should show a note', function(done){
      var options = {
        method: 'GET',
        url: '/notes/' + noteId,
        headers:{
          cookie:cookie
        }
      };

      server.inject(options, function(response){
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
    it('should NOT show a note - invalid noteId', function(done){
      var options = {
        method: 'GET',
        url: '/notes/',
        headers:{
          cookie:cookie
        }
      };

      server.inject(options, function(response){
        //- expect status = note NOT FOUND
        expect(response.statusCode).to.equal(404);
        done();
      });
    });
  });

  describe('delete /notes/3', function(){
    it('should delete a note', function(done){
      var options = {
        method: 'DELETE',
        url: '/notes/' + noteId,
        headers:{
          cookie:cookie
        }
      };

      server.inject(options, function(response){
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
    it('should NOT delete a note - missing noteId', function(done){
      var options = {
        method: 'DELETE',
        url: '/notes/',
        headers:{
          cookie:cookie
        }
      };

      server.inject(options, function(response){
        //- expect status = note NOT FOUND
        expect(response.statusCode).to.equal(404);
        done();
      });
    });
  });

  describe('post /notes/3/upload-mobile', function(){
    it('should upload a mobile photo', function(done){
      var options = {
        method: 'POST',
        url: '/notes/' + noteId + '/upload-mobile',
        headers:{
          cookie:cookie
        },
        payload:{
          b64: 'ab64string'
        }
      };

      server.inject(options, function(response){
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
    it('should NOT upload a mobile photo - invalid noteId', function(done){
      var options = {
        method: 'POST',
        url: '/notes/100/upload-mobile',
        headers:{
          cookie:cookie
        },
        payload:{
          b64: 'ab64string'
        }
      };

      server.inject(options, function(response){
        expect(response.statusCode).to.equal(400);
        done();
      });
    });
  });
});
