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
  pg.query('select add_note($1, $2, $3, $4)', [user.id, obj.title, obj.body, obj.tags], function(err, results){
    cb(err, results && results.rows ? results.rows[0].add_note : null);
  });
};

Note.query = function(user, query, cb){
  pg.query('select * from query_notes($1, $2, $3, $4)', [user.id, query.limit || 10, query.offset || 0, query.tag || '%'], function(err, results){
    cb(err, results && results.rows ? results.rows : null);
  });
};

Note.show = function(user, noteId, cb){
  pg.query('select * from show_note($1, $2)', [user.id, noteId], function(err, results){
    cb(err, results && results.rows ? results.rows[0] : null);
  });
};

Note.count = function(user, cb){
  pg.query('select count(*) from notes where user_id = $1', [user.id], function(err, results){
    cb(err, results && results.rows ? results.rows[0].count : null);
  });
};

Note.nuke = function(user, noteId, cb){
  pg.query('select nuke_note($1, $2)', [user.id, noteId], function(err, results){
    cb(err, results && results.rows ? results.rows[0].nuke_note : null);
  });
};

Note.upload = function(user, file, name, noteId, cb){
  var s3   = new AWS.S3();

  crypto.randomBytes(48, function(ex, buf){
    var hex = buf.toString('hex'),
        loc = user.token + '/' + noteId + '/' + hex + path.extname(name),
        url = 'https://s3.amazonaws.com/' + process.env.AWS_BUCKET + '/' + loc;

    pg.query('insert into photos (url, note_id) values ($1, $2) returning id', [url, noteId], function(err, results){
      if(err){return cb(err);}

      file.pipe(concat(function(buf){
        var params = {Bucket: process.env.AWS_BUCKET, Key: loc, Body: buf, ACL: 'public-read'};
        s3.putObject(params, cb);
      }));
    });
  });
};

Note.uploadmobile = function(user, b64, noteId, cb){
  var s3   = new AWS.S3();

  crypto.randomBytes(48, function(ex, buf){
    var hex = buf.toString('hex'),
    loc = user.token + '/' + noteId + '/' + hex + '.jpg',
    url = 'https://s3.amazonaws.com/' + process.env.AWS_BUCKET + '/' + loc;

    pg.query('insert into photos (url, note_id) values ($1, $2) returning id', [url, noteId], function(err, results){
      if(err){return cb(err);}

      var bin    = new Buffer(b64, 'base64'),
          params = {Bucket: process.env.AWS_BUCKET, Key: loc, Body: bin, ACL: 'public-read'};
      s3.putObject(params, cb);
    });
  });
};

module.exports = Note;
