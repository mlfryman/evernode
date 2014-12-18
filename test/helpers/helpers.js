'use strict';

// parses DB string
exports.getDB = function(){
  return process.env.DATABASE_URL.match(/\/([\w]+$)/)[1];
};

// generates random number for e2e testing register user
exports.random = function(num){
  return Math.floor(Math.random() * num);
};

// debugging function for stopping protractor browser
exports.debug = function(color){
  browser.executeScript('$("body").css("background-color", "' + color +'")');
  browser.debugger();
};
