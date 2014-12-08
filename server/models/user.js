'use strict';

var AWS     = require('aws-sdk'),
    bcrypt  = require('bcrypt'),
    crypto  = require('crypto'),
    request = require('request'),
    path    = require('path'),
    pg      = require('../postgres/manager');

/**
 * User constructor
 *
 * @param {Object} obj (user)
 * @auth public
 */
function User(obj){
  this.username = obj.username;
}

/**
 * Register a user
 *
 * @param {Object} obj (user)
 * @param {Function} cb (err, results)
 * @return {String} obj.avatar
 * @return {String} file
 * @return {Function} callback (err, results)
 * @auth required
 */
User.register = function(obj, cb){
  var user = new User(obj);
  user.password = bcrypt.hashSync(obj.password, 8);

  randomUrl(obj.avatar, function(file, avatar){
    user.avatar = avatar;
    pg.query('INSERT INTO users (username, password, avatar) VALUES ($1, $2, $3) RETURNING id', [user.username, user.password, user.avatar], function(err, results){
      console.log(err);
      if(err){return cb(true);}
      download(obj.avatar, file, cb);
    });
  });
};

/**
 * Login Authenticate - check if the credentials are the same
 *
 * @param {Object} obj
 * @param {Function} cb (err, results)
 * @return {Object} user
 * @api public
 */
User.login = function(obj, cb){
  pg.query('SELECT * FROM users WHERE username = $1 limit 1', [obj.username], function(err, results){
    if(err || !results.rowCount){return cb();}
    var isAuth = bcrypt.compareSync(obj.password, results.rows[0].password);
    if(!isAuth){return cb();}
    var user = results.rows[0];
    delete user.password;
    cb(user);
  });
};

/**
 * Generate Random URL - creates unique URL for user's avatar
 *
 * @param {String} url
 * @param {Function} cb (err, results)
 * @return {String} file
 * @return {String} avatar
 */
function randomUrl(url, cb){
  var ext  = path.extname(url);

  crypto.randomBytes(48, function(ex, buf){
    var token  = buf.toString('hex'),
        file   = token + '.avatar' + ext,
        avatar = 'https://s3.amazonaws.com/' + process.env.AWS_BUCKET + '/' + file;
    cb(file, avatar);
  });
}

/**
 * Download Avatar to S3
 *
 * @param {String} url
 * @param {String} file
 * @param {Function} cb (err, results)
 * @return {}
 */
function download(url, file, cb){
  var s3 = new AWS.S3();

  request({url: url, encoding: null}, function(err, response, body){
    var params = {Bucket: process.env.AWS_BUCKET, Key: file, Body: body, ACL: 'public-read'};
    s3.putObject(params, cb);
  });
}

module.exports = User;
