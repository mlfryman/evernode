'use strict';

exports.getDB = function(){
  return process.env.DATABASE_URL.match(/\/([\w]+$)/)[1];
};
