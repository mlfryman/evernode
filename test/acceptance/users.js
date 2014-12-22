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

describe('Users', function(){
  var cookie;

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      var options = {
        method: 'POST',
        url: '/login',
        payload: {
          username: 'bob',
          password: '123'
        }
      };

      server.inject(options, function(response){
        // must put set-cookie in brackets since property name is invalid JS syntax
        // @ index[0], since it returns an array of cookies
        cookie = response.headers['set-cookie'][0].match(/hapi-cookie=[^;]+/)[0];
        done();
      });
    });
  });

  describe('POST /register', function(){
    it('should register a new User', function(done){
      var options = {
        method: 'POST',
        url: '/register',
        payload: {
          username: 'sam',
          password: '456',
          avatar: 'http://images.apple.com/global/elements/flags/16x16/usa_2x.png'
        }
      };

      server.inject(options, function(response){
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
    it('should NOT register a new User - duplicate', function(done){
      var options = {
        method: 'POST',
        url: '/register',
        payload: {
          username: 'bob',
          password: '123',
          avatar: 'http://images.apple.com/global/elements/flags/16x16/usa_2x.png'
        }
      };

      server.inject(options, function(response){
        expect(response.statusCode).to.equal(400);
        done();
      });
    });
  });

  describe('POST /login', function(){
    it('should login a User', function(done){
      var options = {
        method: 'POST',
        url: '/login',
        payload: {
          username: 'bob',
          password: '123'
        }
      };

      server.inject(options, function(response){
        expect(response.statusCode).to.equal(200);
        expect(response.result.username).to.equal('bob');
        done();
      });
    });
    it('should NOT login a User - user does not exist', function(done){
      var options = {
        method: 'POST',
        url: '/login',
        payload: {
          username: 'sally',
          password: '876'
        }
      };

      server.inject(options, function(response){
        expect(response.statusCode).to.equal(401);
        done();
      });
    });
  });

  describe('DELETE /logout', function(){
    it('should logout a User', function(done){
      var options = {
        method: 'DELETE',
        url: '/logout',
        headers: {
          cookie: cookie
        }
      };

      server.inject(options, function(response){
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
  });

  describe('GET /status', function(){
    it('should get a status for a User', function(done){
      var options = {
        method: 'GET',
        url: '/status',
        headers: {
          cookie: cookie
        }
      };

      server.inject(options, function(response){
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
  });
});
