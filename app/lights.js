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

function startlooping(){
	api.setLightState(1, {
		effect: 'colorloop'
	}, function (err, lights) {
	    if (err) throw err;
	    console.log(lights);
	});
}


function stoplooping(){
	api.setLightState(1, {
		effect: 'none'
	}, function (err, lights) {
	    if (err) throw err;
	    console.log(lights);
	});
}

exports.startlooping  = startlooping;
exports.stoplooping = stoplooping;
