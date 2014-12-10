'use strict';

module.exports = [
  {method: 'GET',    path: '/{param*}',              config: require('../definitions/static/static_angular')},
  {method: 'POST',   path: '/register',              config: require('../definitions/users/post_register')},
  {method: 'POST',   path: '/login',                 config: require('../definitions/users/post_login')},
  {method: 'DELETE', path: '/logout',                config: require('../definitions/users/delete_logout')},
  {method: 'GET',    path: '/status',                config: require('../definitions/users/get_status')},
  {method: 'POST',   path: '/notes',                 config: require('../definitions/notes/post_note')},
  {method: 'GET',    path: '/notes',                 config: require('../definitions/notes/get_notes')},
  {method: 'POST',   path: '/notes/{noteId}/upload', config: require('../definitions/notes/post_upload')},
  {method: 'GET',    path: '/notes/{noteId}',        config: require('../definitions/notes/get_note')},
  {method: 'DELETE', path: '/notes/{noteId}',        config: require('../definitions/notes/delete_note')},
  {method: 'GET',    path: '/notes/count',           config: require('../definitions/notes/get_count')}
];
