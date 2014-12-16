/* jshint expr:true */

'use strict';

var expect     = require('chai').expect,
    cp         = require('child_process'),
    h          = require('../helpers/helpers'),
    // User       = require('../../server/models/user'),
    server     = require('../../server/index'),
    Lab        = require('lab'),
    lab        = exports.lab = Lab.script(),
    describe   = lab.describe,
    it         = lab.it,
    beforeEach = lab.beforeEach,
    db         = h.getDB();

describe('Users', function(){
  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
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
        done();
      });
    });
  });
});
