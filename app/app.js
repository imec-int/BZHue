#!/usr/bin/env node

var express = require('express');
var http = require('http')
var path = require('path');
var util = require('util');

var config = require('./config');
var lights = require('./lights');

// ******************
// *** WEB SERVER ***
// ******************

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

app.get('/', function (req, res){
	res.render('index', { title: 'Hello World' });
});

app.post('/rest/', function (req, res){
	// responsd immediatly:
	res.json('thx');

	var action = req.body.action;
	if(!action) return console.log('no action given');

	switch(action){
		case 'shotfired':
			if(!req.body.player) return console.log('no player given');
			shotFired(req.body.player);
			break;
		case 'flaggrabbed':
			if(!req.body.player) return console.log('no player given');
			if(!req.body.flag) return console.log('no flag given');
			flagGrabbed( req.body.player, req.body.flag );
			break;
		case 'flagdropped':
			if(!req.body.player) return console.log('no player given');
			flagDropped( req.body.player);
			break;
	}
});

// flagGrabbed('matt', 'SH');
// flagDropped('crockysam');
// shotFired('crockysam');


// **********************************************
// *** BZFlag Events translated to Hue events ***
// **********************************************

function flagGrabbed(player, flagid){
	var lightid = config.player2lightid[player];
	var flag = config.flags[flagid];

	if(!lightid) return console.log('unknown player: ' + player);
	if(!flag) return console.log('unknown flag: ' + flagid);

	var sat = flag.sat;
	if(!sat)
		sat = 255; // most saturated

	console.log("Setting flag '" + flag.name + "' for player " + player + " to hue = " + flag.hue + ", sat = " + sat);
	lights.setLight(lightid, flag.hue, sat);
}

function flagDropped(player){
	var lightid = config.player2lightid[player];
	if(!lightid) return console.log('unknown player: ' + player);
	lights.setLight(lightid, 65535, 0);
}

function shotFired(player){
	var lightid = config.player2lightid[player];
	if(!lightid) return console.log('unknown player: ' + player);
	lights.burstLight(lightid);
}

// ************************************
// *** Command line interface tests ***
// ************************************

/*
// Test flag color
process.stdin.resume();
process.stdin.setEncoding('utf8');
console.log("geef flag (A, CL, G, GM, L, OO, F, R, SH, SW, SR, SB, T, V, WG) en druk ENTER:");
process.stdin.on('data', function (flagid) {
	if (flagid === 'quit\n')
		return process.exit();
	flagGrabbed('sam', flagid.replace(/\n/, ''));
});
*/

/*
// Test hue codes:
process.stdin.resume();
process.stdin.setEncoding('utf8');
console.log("geef hue en druk ENTER:");
process.stdin.on('data', function (hueString) {
	if (hueString === 'quit\n')
		return process.exit();
	var hue  = hueString.replace(/\n/, '');
	hue = parseInt(hue);
	if(isNaN(hue)) return console.log("not a number");

	lights.setLight(1, hue);
});
*/

/*
// Test: shot firing
process.stdin.resume();
process.stdin.setEncoding('utf8');
console.log("pres ENTER");
process.stdin.on('data', function (flagid) {
	if (flagid === 'quit\n')
		return process.exit();

	shotFired('sam');
});
*/




