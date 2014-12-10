'use strict';
require('newrelic');
var Hapi           = require('hapi'),
    // CORS tells server it is okay if you get a request from a different server. origin [array of strings of allowed domains]
    server         = new Hapi.Server('0.0.0.0', process.env.PORT, {cors:{origin: ['http://localhost:8100'],credentials: true}}),
    routes         = require('./routes/config/routes'),
    plugins        = require('./routes/config/plugins'),
    authentication = require('./routes/config/authentication');
server.pack.register(plugins, function(){
  server.auth.strategy('session', 'cookie', true, authentication);
  server.route(routes);
  server.start(function(){
    server.log('info', server.info.uri);
  });
});
