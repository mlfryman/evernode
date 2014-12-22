'use strict';

describe('logout', function(){
  it('should logout a User', function(){
    browser.get('/#/login');
    element(by.model('user.username')).sendKeys('bob');
    element(by.model('user.password')).sendKeys('123');
    element(by.css('button[ng-click]')).click();
    expect(element(by.css('a[ui-sref="notes.list"]')).isDisplayed()).toBeTruthy();
    element(by.id('avatarlink')).click();
    expect(element(by.css('a[ui-sref="notes.list"]')).isDisplayed()).toBeFalsy();
    expect(element(by.css('div[ui-view] > h1')).getText()).toEqual('home');
  });
});
