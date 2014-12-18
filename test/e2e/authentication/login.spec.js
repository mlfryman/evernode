'use strict';

var cp  = require('child_process'),
    h   = require('../../helpers/helpers'),
    db  = h.getDB();

describe('login', function(){
  beforeEach(function(done){
    cp.execFile(__dirname + '/../../scripts/clean-db.sh', [db], {cwd:__dirname + '/../../scripts'}, function(err, stdout, stderr){
      browser.get('/#/login');
      done();
    });
  });

  it('should get the login page', function(){
    expect(element(by.css('div[ui-view] > h1')).getText()).toEqual('login');
  });

  it('should login a user', function(){
    element(by.model('user.username')).sendKeys('bob');
    element(by.model('user.password')).sendKeys('123');
    element(by.css('button[ng-click="submit()"]')).click();
    expect(element(by.css('div[ui-view] > h1')).getText()).toEqual('home');
  });

  it('should NOT login a user - wrong credentials', function(){
    element(by.model('user.username')).sendKeys('bob');
    element(by.model('user.password')).sendKeys('wrong');
    element(by.css('button[ng-click="submit()"]')).click();
    expect(element(by.css('div[ui-view] > h1')).getText()).toEqual('login');
  });
});
