'use strict';

var cp  = require('child_process'),
    h   = require('../../helpers/helpers'),
    db  = h.getDB();

describe('register', function(){
  // before run each test, clean the DB & ensure browser is on the register page
  beforeEach(function(done){
    cp.execFile(__dirname + '/../../scripts/clean-db.sh', [db], {cwd:__dirname + '/../../scripts'}, function(err, stdout, stderr){
      browser.get('/#/register');
      done();
    });
  });

  it('should get the register page', function(){
    expect(element(by.css('div[ui-view] > h1')).getText()).toEqual('register');
  });

  it('should register a new user', function(){
    element(by.model('user.username')).sendKeys('sam' + h.random(500000));
    element(by.model('user.password')).sendKeys('456');
    element(by.model('user.avatar')).sendKeys('http://images.apple.com/global/elements/flags/16x16/usa_2x.png');
    element(by.css('button[ng-click="submit()"]')).click();
    expect(element(by.css('div[ui-view] > h1')).getText()).toEqual('login');
  });
});
