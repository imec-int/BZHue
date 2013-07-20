var util = require('util');

var hue = require("node-hue-api"),
	HueApi = hue.HueApi,
	lightState = hue.lightState;

var hostname = "10.0.1.2";
var username = "robbywauters"; // sams username

var api = new HueApi(hostname, username);

// hue.createUser(hostname,  "crockysam", "mixers bzflag interface", function (err, user) {
// 	if (err) throw err;
// 	console.log(user);
// });

// api.getFullState (function (err, config) {
//     if (err) throw err;
//     console.log(util.inspect(config, { showHidden: true, depth: null }));
// });

// api.lights(function(err, lights) {
//     if (err) throw err;
//     console.log(lights);
// });

function turnOffLight(lightid){
	api.setLightState(lightid, {
		on: false,
		transitiontime: 0
	}, function (err, lights) {
		if (err) return console.log(err);
	});
}

// function turnOffLight(lightid){
// 	api.setLightState(lightid, {
// 		on: false,
// 		transitiontime: 0
// 	}, function (err, lights) {
// 		if (err) return console.log(err);
// 	});
// }

function turnOnLight(lightid){
	api.setLightState(lightid, {
		on: true,
		transitiontime: 0
	}, function (err, lights) {
		if (err) return console.log(err);
	});
}

function burstLight(lightid){
	// api.setLightState(lightid, {
	// 	alert: 'select',
	// }, function (err, lights) {
	// 	if (err) return console.log(err);
	// 	console.log(lights);
	// });

	api.setLightState(lightid, {
		bri: 255,
		transitiontime: 1
	}, function (err, lights) {
		if (err) return console.log(err);


		api.setLightState(lightid, {
			bri: 0,
			transitiontime: 3
		}, function (err, lights) {
			if (err) return console.log(err);
		});
	});
}

function dimLight(lightid){
	api.setLightState(lightid, {
			bri: 0,
			transitiontime: 0
		}, function (err, lights) {
			if (err) return console.log(err);
		});
}

function turnOnDefaultLight(lightid){
	api.setLightState(lightid, {
			on: true,
			bri: 0,
			hue: 65535,
			sat: 0,
			transitiontime: 0
		}, function (err, lights) {
			if (err) return console.log(err);
		});
}

function turnOffDefaultLight(lightid){
	api.setLightState(lightid, {
			on: false,
			bri: 0,
			hue: 65535,
			sat: 0,
			transitiontime: 0
		}, function (err, lights) {
			if (err) return console.log(err);
		});
}

function beamOfLight(){

	burstLight(1);
	setTimeout(function(){burstLight(2)},150);
	setTimeout(function(){burstLight(3)},300);

}

function startlooping(){
	api.setLightState(1, {
		effect: 'colorloop'
	}, function (err, lights) {
		if (err) return console.log(err);
		// console.log(lights);
	});
}


function stoplooping(){
	api.setLightState(1, {
		effect: 'none'
	}, function (err, lights) {
		if (err) return console.log(err);
		// console.log(lights);
	});
}

function setLight(lightid, hue, sat){
	api.setLightState(lightid, {
		hue: hue,
		sat: sat,
		transitiontime: 0
	}, function (err, lights) {
		if (err) return console.log(err);
		// console.log(lights);
	});
}

exports.startlooping  = startlooping;
exports.stoplooping = stoplooping;
exports.setLight = setLight;
exports.burstLight = burstLight;
exports.beamOfLight = beamOfLight;
exports.turnOffLight = turnOffLight;
exports.turnOnLight = turnOnLight;
exports.turnOffDefaultLight = turnOffDefaultLight;
exports.turnOnDefaultLight = turnOnDefaultLight;
exports.dimLight = dimLight;
