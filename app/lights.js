var util = require('util');

var hue = require("node-hue-api"),
	HueApi = hue.HueApi,
	lightState = hue.lightState;

var hostname = "10.0.1.2";
var username = "3c52c72413928b8f24c90b4cf445d17"; // sams username

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

function burstLight(lightid){
	// api.setLightState(lightid, {
	// 	alert: 'select',
	// }, function (err, lights) {
	// 	if (err) return console.log(err);
	// 	console.log(lights);
	// });

	api.setLightState(lightid, {
		bri: 255,
		transitiontime: 0
	}, function (err, lights) {
		if (err) return console.log(err);


		api.setLightState(lightid, {
			bri: 0,
			transitiontime: 0
		}, function (err, lights) {
			if (err) return console.log(err);
		});
	});
}

function startlooping(){
	api.setLightState(1, {
		effect: 'colorloop'
	}, function (err, lights) {
		if (err) return console.log(err);
		console.log(lights);
	});
}


function stoplooping(){
	api.setLightState(1, {
		effect: 'none'
	}, function (err, lights) {
		if (err) return console.log(err);
		console.log(lights);
	});
}

function setLight(lightid, hue, sat){
	api.setLightState(lightid, {
		hue: hue,
		sat: sat,
		transitiontime: 0
	}, function (err, lights) {
		if (err) return console.log(err);
		console.log(lights);
	});
}

exports.startlooping  = startlooping;
exports.stoplooping = stoplooping;
exports.setLight = setLight;
exports.burstLight = burstLight;
exports.turnOffLight = turnOffLight;
