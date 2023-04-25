#!/usr/bin/env node

import moment from "moment-timezone";
import minimist from "minimist";
import fetch from "node-fetch";

const args = minimist(process.argv.slice(2));

let timezone = moment.tz.guess();
if (args.z){
    timezone = args.z;
}
console.log(args);


if (args.h) {
    try {
        console.log(`
        Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
        -h            Show this help message and exit.
        -n, -s        Latitude: N positive; S negative.
        -e, -w        Longitude: E positive; W negative.
        -z            Time zone: uses tz.guess() from moment-timezone by default.
        -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
        -j            Echo pretty JSON from open-meteo API and exit.`);
        process.exit(0);
    }
    catch (err) {
        process.exit(1);
    }
}

let latitude, longitude;
if (args.n && args.s){
	console.log("Either N or S latitude");
	process.exit(0);
} else if (args.n) {
	latitude = args.n;
} else if (args.s) {
	latitude = -args.s;
} else {
	console.log("Latitude must be in range");
	process.exit(0);
}

if (args.e && args.w){
	console.log("Only E or W longitude");
	process.exit(0);
} else if (args.e){
	longitude = args.e;
} else if (args.w) {
	longitude = -args.w;
} else {
	console.log("Longitude must be in range");
	process.exit(0);
}

const url ="https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&timezone=" + timezone + "&daily=precipitation_hours";
const response = await fetch(url);

const data = await response.json();
const days = args.d;

let output;
if(data.daily.precipitation_hours[days] == 0){
    output = "You will not need your umbrella ";
} else{
    output = "You might need your umbrella "
}

if(days == 0){
    output += "today.";
} else if (days > 1){
    output += 'in ' + days + " days.";
} else {
    output += "tomorrow.";
}

if (args.j) {
    console.log(data);
    process.exit(0);
} else {
    console.log(output);
}