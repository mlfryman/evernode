'use strict';

module.exports = [
  {method: 'GET',    path: '/{param*}',                     config: require('../definitions/static/angular')},
  {method: 'POST',   path: '/register',                     config: require('../definitions/users/register')},
  {method: 'POST',   path: '/login',                        config: require('../definitions/users/login')},
  {method: 'DELETE', path: '/logout',                       config: require('../definitions/users/logout')},
  {method: 'GET',    path: '/status',                       config: require('../definitions/users/status')},
  {method: 'POST',   path: '/notes',                        config: require('../definitions/notes/create')},
  {method: 'GET',    path: '/notes',                        config: require('../definitions/notes/query')},
  {method: 'POST',   path: '/notes/{noteId}/upload',        config: require('../definitions/notes/upload')},
  {method: 'POST',   path: '/notes/{noteId}/upload-mobile', config: require('../definitions/notes/upload-mobile')},
  {method: 'GET',    path: '/notes/{noteId}',               config: require('../definitions/notes/show')},
  {method: 'DELETE', path: '/notes/{noteId}',               config: require('../definitions/notes/nuke')},
  {method: 'GET',    path: '/notes/count',                  config: require('../definitions/notes/count')}
];
