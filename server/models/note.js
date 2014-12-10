/* jshint camelcase:false */

'use strict';

var AWS     = require('aws-sdk'),
    concat  = require('concat-stream'),
    crypto  = require('crypto'),
    path    = require('path'),
    pg      = require('../postgres/manager');

/**
 * Note constructor
 *
 * @auth required
 */
function Note(){
}

/**
 * Create a new note - normalize tags, upload photos to S3, save note
 *
 * @param {Object} obj (note)
 * @param {Function} cb (err, results)
 * @return {Number} noteId
 * @auth required
 */
Note.create = function(user, obj, cb){
  console.log('SERVER NOTE MODEL - note.create @params(user, obj, cb): ', user, obj, cb);
  var psqlString = 'SELECT add_note($1, $2, $3, $4)',
     psqlParams = [user.id, obj.title, obj.body, obj.tags];

  pg.query(psqlString, psqlParams, function(err, results){
    console.log('SERVER NOTE MODEL - note.create query return ERROR (err): ', err);
    console.log('SERVER NOTE MODEL - note.create query return RESULTS (results): ', results);
    cb(err, results && results.rows ? results.rows[0].add_note : null);
  });
};

// if the notes has tags, normalize them.
// if !tags set obj.tags to NULL
// obj.tags = Note.normalizeTags(obj.tags || '');
/**
 * Normalize Tags - formats tags for consistency
 *
 * @param {String} dt (dirty tags)
 * @return {String} tags (cleaned tags)
 */
// Note.normalizeTags = function(dt){
//   var tags = dt.split(',');
//   tags.forEach(function(t, i){
//     tags[i] = t.trim().toLowerCase();
//   });
//   return tags.join(',');
// };

/**
 * Query Tags
 *
 * @param {Object} user
 * @param {Object} query
 * @param {Function} callback (err, results)
 * @return {Array} results.rows
 * @auth required
 */
Note.query = function(user, query, cb){
 var psqlString = 'SELECT * FROM query_notes($1, $2, $3, $4)',
     psqlParams = [user.id, query.limit || 10, query.offset || 0, query.tag || '%'];

  pg.query(psqlString, psqlParams, function(err, results){
    cb(err, results && results.rows ? results.rows : null);
  });
};

/**
 * Get a single note
 *
 * @param {Object} user
 * @param {Number} noteId
 * @param {Function} callback (err, results)
 * @return {Array} results.rows
 * @auth required
 */
Note.show = function(user, noteId, cb){
  console.log('SERVER NOTE MODEL - note.show (user, noteId, cb): ', user, noteId, cb);
  var psqlString = 'SELECT * FROM show_note($1, $2)',
     psqlParams = [user.id, noteId];

  pg.query(psqlString, psqlParams, function(err, results){
    console.log('SERVER NOTE MODEL - pg.query show_note ERROR: ', err);
    console.log('SERVER NOTE MODEL - pg.query show_note RESULTS: ', results);
    cb(err, results && results.rows ? results.rows[0] : null);
    console.log('SERVER NOTE MODEL - pg.query show_note CB(ERROR): ', err);
    console.log('SERVER NOTE MODEL - pg.query show_note CB(RESULTS.ROWS): ', results.rows);
  });
};

/**
 * Count Total Notes
 *
 * @param {Object} user
 * @param {Number} noteId
 * @param {Function} callback (err, results)
 * @return {Array} results.rows
 * @auth required
 */
Note.count = function(user, cb){
 var psqlString = 'SELECT COUNT(*) FROM notes WHERE user_id = $1',
     psqlParams = [user.id];

  pg.query(psqlString, psqlParams, function(err, results){
    cb(err, results && results.rows ? results.rows[0].count : null);
  });
};

/**
 * Delete a Note
 *
 * @param {Object} user
 * @param {Number} noteId
 * @param {Function} callback (err, results)
 * @return {Array} results.rows
 * @auth required
 */
Note.nuke = function(user, noteId, cb){
 var psqlString = 'SELECT nuke_note($1, $2)',
     psqlParams = [user.id, noteId];

  pg.query(psqlString, psqlParams, function(err, results){
    cb(err, results && results.rows ? results.rows[0].nuke_note : null);
  });
};

/**
 * Upload files
 *
 * @param {Object} user
 * @param {Object} file
 * @param {Object} name
 * @param {Number} noteId
 * @param {Function} callback (err, results)
 * @return {Array} results.rows
 * @auth required
 */
Note.upload = function(user, file, name, noteId, cb){
  var s3   = new AWS.S3();

  crypto.randomBytes(48, function(ex, buf){
    var hex        = buf.toString('hex'),
        loc        = user.token + '/' + noteId + '/' + hex + path.extname(name),
        url        = 'https://s3.amazonaws.com/' + process.env.AWS_BUCKET + '/' + loc,
        psqlString = 'INSERT INTO photos (url, note_id) VALUES ($1, $2) RETURNING id',
        psqlParams = [url, noteId];

    pg.query(psqlString, psqlParams, function(err, results){
      if(err){return cb(err);}

      file.pipe(concat(function(buf){
        var params = {Bucket: process.env.AWS_BUCKET, Key: loc, Body: buf, ACL: 'public-read'};
        s3.putObject(params, cb);
      }));
    });
  });
};

module.exports = Note;
