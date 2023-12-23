var server = require('./server.js');
var routes = ['user','questions','certificates','authenticate','quizs','settings'];
var serviceName = "master";
server.start(serviceName, routes);