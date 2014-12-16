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
        method: 'post',
        url: '/login',
        payload: {
          username: 'bob',
          password: '123'
        }
      };

      server.inject(options1, function(response){
        cookie = response.headers['set-cookie'][0].match(/hapi-cookie=[^;]+/)[0];
        var options2 = {
          method: 'post',
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
        method: 'post',
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
  });

  describe('get /notes', function(){
    it('should get notes', function(done){
      var options = {
        method: 'get',
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
  });


  describe('get /notes/count', function(){
    it('should get notes count', function(done){
      var options = {
        method: 'get',
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
  });


  describe('get /notes/3', function(){
    it('should show a note', function(done){
      var options = {
        method: 'get',
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
  });

  describe('delete /notes/3', function(){
    it('should delete a note', function(done){
      var options = {
        method: 'delete',
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
  });

  describe('post /notes/3/upload-mobile', function(){
    it('should upload a mobile photo', function(done){
      var options = {
        method: 'post',
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
  });
});
