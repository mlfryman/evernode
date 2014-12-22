/* jshint camelcase:false */

'use strict';

var pg     = require('../postgres/manager'),
    AWS    = require('aws-sdk'),
    crypto = require('crypto'),
    path   = require('path'),
    concat = require('concat-stream');

function Note(){
}

Note.create = function(user, obj, cb){
  var psqlString = 'SELECT add_note($1, $2, $3, $4)',
      psqlParams = [user.id, obj.title, obj.body, obj.tags];
  pg.query(psqlString, psqlParams, function(err, results){
    cb(err, results && results.rows ? results.rows[0].add_note : null);
  });
};

Note.query = function(user, query, cb){
  var psqlString = 'SELECT * FROM query_notes($1, $2, $3, $4)',
      psqlParams = [user.id, query.limit || 10, query.offset || 0, query.tag || '%'];
  pg.query(psqlString, psqlParams, function(err, results){
    cb(err, results && results.rows ? results.rows : null);
  });
};

Note.show = function(user, noteId, cb){
  var psqlString = 'SELECT * FROM show_note($1, $2)',
      psqlParams = [user.id, noteId];
  pg.query(psqlString, psqlParams, function(err, results){
    cb(err, results && results.rows ? results.rows[0] : null);
  });
};

Note.count = function(user, cb){
  var psqlString = 'SELECT COUNT(*) FROM notes WHERE user_id = $1',
      psqlParams = [user.id];
  pg.query(psqlString, psqlParams, function(err, results){
    cb(err, results && results.rows ? results.rows[0].count : null);
  });
};

Note.nuke = function(user, noteId, cb){
  var psqlString = 'SELECT nuke_note($1, $2)',
      psqlParams = [user.id, noteId];
  pg.query(psqlString, psqlParams, function(err, results){
    cb(err, results && results.rows ? results.rows[0].nuke_note : null);
  });
};

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

Note.uploadmobile = function(user, b64, noteId, cb){
  var s3 = new AWS.S3();

  crypto.randomBytes(48, function(ex, buf){
    var hex        = buf.toString('hex'),
        loc        = user.token + '/' + noteId + '/' + hex + '.jpg',
        url        = 'https://s3.amazonaws.com/' + process.env.AWS_BUCKET + '/' + loc,
        psqlString = 'INSERT INTO photos (url, note_id) VALUES ($1, $2) RETURNING id',
        psqlParams = [url, noteId];
    pg.query(psqlString, psqlParams, function(err, results){
      if(err){return cb(err);}

      var bin    = new Buffer(b64, 'base64'),
          params = {Bucket: process.env.AWS_BUCKET, Key: loc, Body: bin, ACL: 'public-read'};
      s3.putObject(params, cb);
    });
  });
};

module.exports = Note;
