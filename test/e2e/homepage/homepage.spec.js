'use strict';

describe('homepage', function(){
  it('should get the homepage', function(){
    browser.get('/');
    expect(browser.getTitle()).toEqual('Evernode 2');
    // select the div that has an attribute of ui-view, with a direct child of h1
    expect(element(by.css('div[ui-view] > h1')).getText()).toEqual('home');
  });
});
