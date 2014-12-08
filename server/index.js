'use strict';
require('newrelic');

var Hapi           = require('hapi'),
    server         = new Hapi.Server('0.0.0.0', process.env.PORT),
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
