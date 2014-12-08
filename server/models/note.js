/* jshint camelcase:false */

'use strict';

var async   = require('async'),
    AWS     = require('aws-sdk'),
    path    = require('path'),
    pg      = require('../postgres/manager');

/**
 * Note constructor
 *
 * @param {Object} obj (note)
 * @auth required
 */
function Note(obj){
}

/**
 * Create a new note - normalize tags, upload photos to S3, save note
 *
 * @param {Object} obj (note)
 * @param {Function} cb (err, results)
 * @return {Number} noteId
 * @auth required
 */
Note.create = function(obj, cb){
  // console.log('SERVER NOTE MODEL - note.create @param obj: ', obj);
  // console.log('SERVER NOTE MODEL - note.create @param obj.photos[0]: ', obj.photos[0].hapi.filename);

  // if the notes has tags, normalize them.
  // if !tags set obj.tags to NULL
  obj.tags = Note.normalizeTags(obj.tags || '');

  var psqlString = 'SELECT create_note($1, $2, $3, $4)',
      psqlParams = [obj.userId, obj.title, obj.body, obj.tags];

  pg.query(psqlString, psqlParams, function(err, results){
    if(err || !(results && results.rows)){return cb(err || 'SERVER NOTE MODEL - create Note failed', null);}
    // console.log('SERVER NOTE MODEL - create.note results: ', results.rows[0].create_note);
    // the noteId will be index[0] in the rows array
    var noteId = results.rows[0].create_note;

    // if no photos are attached, continue to save the note
    if(!obj.photos){return cb(err, noteId);}
    // if only one file is selected, Hapi returns an {} instead of an [].
    // so, if obj.photos is ![], turn it into an [].
    if(!Array.isArray(obj.photos)){obj.photos = [obj.photos];}

    var photos = obj.photos.map(function(obj, i){
      return {noteId:noteId, photoId:i, stream:obj};
    });
    /**
     * Upload Photos to S3
     *
     * @param {Array} photos
     * @param {Function} uploadPhotoToS3(iterator)
     * @param {Function} cb (err, photoUrls)
     * @return {Array} photoUrls
     * @auth required
     */
    // produces a new array of values by mapping each value in arr through the iterator function.
    async.map(photos, uploadPhotoToS3, function(err, photoUrls){
      var urlString = photoUrls.join(',');
      // run psql upload_photos function
      pg.query('SELECT upload_photos($1,$2)', [urlString, noteId], function(err, results){
        cb(err, noteId);
      });
    });
  });
};

/**
 * Normalize Tags - formats tags for consistency
 *
 * @param {String} dt (dirty tags)
 * @return {String} tags (cleaned tags)
 */
Note.normalizeTags = function(dt){
  var tags = dt.split(',');
  tags.forEach(function(t, i){
    tags[i] = t.trim().toLowerCase();
  });
  return tags.join(',');
};

/**
 * Query Tags
 *
 * @param {Object} query
 * @param {Function} callback (err, results)
 * @return {Array} results.rows
 * @auth required
 */
Note.query = function(query, cb){
  console.log('SERVER NOTE MODEL - note.query(limit, offset, filter): ', query);
  query.limit = query.limit || 10;
  query.offset = query.offset || 0;
  query.filter = query.filter || '';

  var psqlString = 'SELECT * FROM query_notes($1,$2,$3)',
      psqlParams = [query.userId, query.limit, query.offset];

  pg.query(psqlString, psqlParams, function(err, results){
    cb(err, results.rows);
  });
};

/**
 * Get a single note
 *
 * @param {String} psqlString
 * @param {Array} psqlParams
 * @param {Function} callback (err, results)
 * @return {Array} results.rows
 * @auth required
 */
Note.findOne = function(params, cb){
  console.log('SERVER NOTE MODEL - note.findOne (params, cb): ', params, cb);
  var psqlString = 'SELECT * FROM get_note($1,$2)',
      psqlParams = [params.userId, params.noteId];

  pg.query(psqlString, psqlParams, function(err, results){
    console.log('SERVER NOTE MODEL - pg.query get_note ERROR: ', err);
    console.log('SERVER NOTE MODEL - pg.query get_note RESULTS: ', results);
    cb(err, results.rows);
    console.log('SERVER NOTE MODEL - pg.query get_note CB(ERROR): ', err);
    console.log('SERVER NOTE MODEL - pg.query get_note CB(RESULTS.ROWS): ', results.rows);
  });
};

module.exports = Note;


// *** HELPER FUNCTION *** //

/**
 * Upload Photos to S3
 *
 * @param {Object} obj
 * @param {Function} cb (err, photoUrl)
 * @return {String} photoUrl
 */
function uploadPhotoToS3(obj, done){
  var s3     = new AWS.S3(),
      ext    = path.extname(obj.stream.hapi.filename),
      file   = obj.noteId + '_' + obj.photoId + ext,
      url    = 'https://s3.amazonaws.com/' + process.env.AWS_BUCKET + '/' + file,
      params = {Bucket: process.env.AWS_BUCKET, Key: file, Body: obj.stream._data, ACL: 'public-read'};
  s3.putObject(params, function(err){
    done(err, url);
    console.log('SERVER NOTE MODEL - uploadPhotoToS3 ERROR: ', err);
    console.log('SERVER NOTE MODEL - uploadPhotoToS3 URL: ', url);
  });
}
