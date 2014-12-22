'use strict';

describe('homepage', function(){
  it('should get the homepage', function(){
    browser.get('/');
    expect(browser.getTitle()).toEqual('Evernode');
    // select the div that has an attribute of ui-view, with a direct child of h1
    expect(element(by.css('.header-content > h1#title')).getText()).toEqual('Evernode');
  });
});
