#!/usr/bin/env node

var express = require('express');
var http = require('http')
var path = require('path');
var hue = require("node-hue-api"),
    HueApi = hue.HueApi,
    lightState = hue.lightState;
/*
var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('123456789987654321'));
	app.use(express.session());
	app.use(app.router);
	app.use(require('stylus').middleware(__dirname + '/public'));
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

app.get('/', function(req, res){
	res.render('index', { title: 'Hello World' });
});
*/

//var hue = new HueApi();



var hostname = "10.0.1.2";
var username = "3c52c72413928b8f24c90b4cf445d17"; // sams username


var api = new HueApi(hostname, username);

// hue.createUser(hostname,  "crockysam", "mixers bzflag interface", function (err, user) {
// 	if (err) throw err;
// 	console.log(user);
// });


// api.getFullState (function(err, config) {
//     if (err) throw err;
//     console.log(config);
// });


// api.lights(function(err, lights) {
//     if (err) throw err;
//     console.log(lights);
// });


// api.setLightState(1, {
// 	alert: 'select',
// 	transitiontime: 3
// }, function (err, lights) {
//     if (err) throw err;
//     console.log(lights);
// });


api.setLightState(1, {
	effect: 'colorloop'
}, function (err, lights) {
    if (err) throw err;
    console.log(lights);
});
