#!/usr/bin/env node

var express = require('express');
var http = require('http')
var path = require('path');

var lights = require('./lights');

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

var player2lightid = {
	'matt' : 1,
	'robby': 2,
	'sam'  : 3
};

//flag.i is een beetje hacky :p
var flags = {
	A  : {i: 0, code: 'A', name:'Agility', hue: 0},
	CL : {i: 1, code: 'CL', name:'Cloaking', hue: 0},
	G  : {i: 2, code: 'G', name:'Genocide', hue: 0},
	GM : {i: 3, code: 'GM', name:'Guided Missile', hue: 0},
	L  : {i: 4, code: 'L', name:'Laser', hue: 0},
	OO : {i: 5, code: 'OO', name:'Oscillation Overthruster', hue: 0},
	F  : {i: 6, code: 'F', name:'Rapid Fire', hue: 0},
	R  : {i: 7, code: 'R', name:'Ricochet', hue: 0},
	SH : {i: 8, code: 'SH', name:'Shield', hue: 0},
	SW : {i: 9, code: 'SW', name:'Shock Wave', hue: 0},
	SR : {i: 10, code: 'SR', name:'Steam Roller', hue: 0},
	SB : {i: 11, code: 'SB', name:'Super Bullet', hue: 0},
	T  : {i: 12, code: 'T', name:'Tiny', hue: 0},
	V  : {i: 13, code: 'V', name:'High Speed', hue: 0},
	WG : {i: 14, code: 'WG', name:'Wings', hue: 0}
}

function playerCapturesFlag(player, flagid){
	var lightid = player2lightid[player];
	var flag = flags[flagid];

	if(flag.hue == 0){
		// berekeen aan de hand van index
		var nrOfFlags = Object.keys(flags).length;
		flag.hue = Math.round(65535/nrOfFlags * flag.i);
	}

	lights.setLight(lightid, flag.hue);
}


// lights.startlooping();
// lights.startlooping();

playerCapturesFlag('sam', 'SH');



