'use strict';

var cp   = require('child_process'),
    h    = require('../../helpers/helpers'),
    db   = h.getDB(),
    path = require('path');

describe('login', function(){
  beforeEach(function(done){
    cp.execFile(__dirname + '/../../scripts/clean-db.sh', [db], {cwd:__dirname + '/../../scripts'}, function(err, stdout, stderr){
      login();
      done();
    });
  });

  it('should get the notes page', function(){
    expect(element(by.css('div[ui-view] > h1')).getText()).toEqual('notes');
  });

  it('should create a new note', function(){
    var image = path.resolve(__dirname, '../../fixtures/flag.png');
    element(by.model('note.title')).sendKeys('a');
    // h.debug('red');
    element(by.model('note.body')).sendKeys('b');
    element(by.model('note.tags')).sendKeys('c,d,e');
    element(by.css('input[type="file"]')).sendKeys(image);
    // h.debug('blue');
    element(by.css('button[ng-click]')).click();
    expect(element(by.model('note.title')).getAttribute('value')).toEqual('');
    expect(element(by.model('note.body')).getAttribute('value')).toEqual('');
    expect(element(by.model('note.tags')).getAttribute('value')).toEqual('');
  });
});

function login(){
  browser.get('/#/login');
  element(by.model('user.username')).sendKeys('bob');
  element(by.model('user.password')).sendKeys('123');
  element(by.css('button[ng-click="submit()"]')).click();
  browser.get('/#/notes');
}
