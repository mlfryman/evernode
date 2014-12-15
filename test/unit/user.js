/* jshint expr:true */

'use strict';

var expect     = require('chai').expect,
    cp         = require('child_process'),
    h          = require('../helpers/helpers'),
    User       = require('../../server/models/user'),
    Lab        = require('lab'),
    lab        = exports.lab = Lab.script(),
    describe   = lab.describe,
    it         = lab.it,
    // before     = lab.before,
    beforeEach = lab.beforeEach,
    db         = h.getDB();

describe('User', function(){
  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a user object', function(done){
      var user = new User({username:'bob'});

      expect(user).to.be.instanceof(User);
      expect(user.username).to.equal('bob');
      // lab required ALL tests to have "done", whether async or not.
      done();
    });
  });

  describe('.register', function(){
    it('should register a new user', function(done){
      User.register({username:'sam', password:'sam', avatar:'https://www.apple.com/global/elements/flags/16x16/usa_2x.png'}, function(err){
        expect(err).to.be.null;
        done();
      });
    });
    it('should NOT register a new User - duplicate', function(done){
      User.register({username:'bob', password:'bob', avatar:'https://www.apple.com/global/elements/flags/16x16/usa_2x.png'}, function(err){
        expect(err).to.be.ok;
        done();
      });
    });
  });

  describe('.login', function(){
    it('should login a User', function(done){
      User.register({username:'bob', password:'123'}, function(user){
        expect(user.username).to.be.equal('bob');
        expect(user).to.be.ok;
        done();
      });
    });
    it('should NOT login a User - bad username', function(done){
      User.register({username:'bob', password:'123'}, function(user){
        expect(user).to.be.undefined;
        done();
      });
    });
    it('should NOT login a User - bad password', function(done){
      User.register({username:'bob', password:'wrong'}, function(user){
        expect(user).to.be.undefined;
        done();
      });
    });
  });
// last bracket
});
