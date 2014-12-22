'use strict';

var path = require('path');

describe('notes list', function(){
  beforeEach(function(done){
    login();
    done();
  });

  it('should get the notes page', function(){
    expect(element(by.css('div[ui-view] > h1')).getText()).toEqual('notes');
  });

  it('should create a new Note', function(){
    createNote('a', 'b', 'c,d,e');
    expect(element(by.model('note.title')).getAttribute('value')).toEqual('');
    expect(element(by.model('note.body')).getAttribute('value')).toEqual('');
    expect(element(by.model('note.tags')).getAttribute('value')).toEqual('');
    expect(element.all(by.repeater('note in notes')).count()).toBeGreaterThan(0);
  });

  it('should go to the note detail page', function(){
    createNote('a', 'b', 'c,d,e');
    element(by.repeater('note in notes').row(0)).element(by.css('td:nth-child(2) > a')).click();
    expect(element(by.css('div[ui-view] > h1')).getText()).toEqual('a');
  });
});

function login(){
  browser.get('/#/login');
  element(by.model('user.username')).sendKeys('bob');
  element(by.model('user.password')).sendKeys('123');
  element(by.css('button[ng-click]')).click();
  browser.get('/#/notes');
}

function createNote(title, body, tags){
  var image = path.resolve(__dirname, '../../fixtures/flag.png');
  element(by.model('note.title')).sendKeys(title);
    // h.debug('red');
  element(by.model('note.body')).sendKeys(body);
  element(by.model('note.tags')).sendKeys(tags);
  element(by.css('input[type="file"]')).sendKeys(image);
    // h.debug('blue');
  element(by.css('button[ng-click]')).click();
}
