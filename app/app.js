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

app.get('/beam', function (req, res){
	res.render('index', { title: 'Hello World' });
	lights.beamOfLight();
});

app.post('/bzflag', function (req, res){
	// responsd immediatly:
	res.json('thx');

	var action = req.body.action;
	if(!action) return console.log('no action given');

	console.log(req.body);

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
		case 'kill':
			if(!req.body.player) return console.log('no player given');
			if(!req.body.victim) return console.log('no victim given');
			playerDied( req.body.player, req.body.victim);
			break;
		case 'part':
			if(!req.body.player) return console.log('no player given');
			playerLeft( req.body.player);
			break;
		case 'spawn':
			if(!req.body.player) return console.log('no player given');
			playerSpawn( req.body.player);
			break;
		case 'start':
			gameStart();
			break;
		case 'stop':
			for(var name in config.player2lightid){
				playerLeft( name);
			}
			break;
		case 'gameend':
			for(var name in config.player2lightid){
				playerLeft( name);
			}
			break;
		case 'servermessage':
			for(var name in config.player2lightid){
				console.log("");
				console.log("SERVER MESSAGE");
				console.log("");
			}
			break;
	}
});

// flagGrabbed('crockysam', 'G');
// flagDropped('crockysam');
// playerSpawn('crockysam');
// shotFired('crockysam');
// playerDied('crockysam', 'robby');
// lights.deathAnimation(5);

// lights.killedAnimation(5);


// **********************************************
// *** BZFlag Events translated to Hue events ***
// **********************************************

function gameStart(){
	for(var name in config.player2lightid){
		playerLeft( name);
	}
}

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

function playerDied(killer, victim){
	var lightid = config.player2lightid[victim];
	if(!lightid) return console.log('unknown victim: ' + victim);

	lights.deathAnimation(lightid, function (err){
		// dim to white and turn off light
		lights.dimToWhite(lightid, function (err){
			lights.turnOffLight(lightid);
		});
	});

	var lightidkiller = config.player2lightid[killer];
	if(!lightidkiller) return console.log('unknown killer: ' + killer);

	// indication for the killer:
	lights.getLightState(lightidkiller, function (err, killerstate){
		lights.killedAnimation(lightidkiller, function (err){
			setTimeout(function(){
				lights.setLight(lightidkiller, killerstate.hue, killerstate.sat);
			},300); // wait some time
		});
	});
}

function playerLeft(player){
	var lightid = config.player2lightid[player];
	if(!lightid) return console.log('unknown player: ' + player);

	// dim to white and turn off light
	lights.dimToWhite(lightid, function (err){
		lights.turnOffLight(lightid);
	});

}

function playerSpawn(player){
	var lightid = config.player2lightid[player];
	if(!lightid) return console.log('unknown player: ' + player);
	lights.turnOnLight(lightid);
	// lights.dimLight(lightid);
	// lights.turnOnDefaultLight(lightid);
}



// ************************************
// *** Command line interface tests ***
// ************************************

/*
// Test flag color
process.stdin.resume();
process.stdin.setEncoding('utf8');
console.log("enter flag code (A, CL, G, GM, L, OO, F, R, SH, SW, SR, SB, T, V, WG) and press ENTER:");
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
console.log("enter hue value and press ENTER:");
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
console.log("press ENTER");
process.stdin.on('data', function (flagid) {
	if (flagid === 'quit\n')
		return process.exit();

	shotFired('sam');
});
*/




