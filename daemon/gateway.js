console.log("TK102 TCP GPRS Gateway v0.1-dev");
console.log("Loading...");

var tk102 = require('./tk102');

var portNum = 5030;

tk102.createServer({
        port: portNum
});

tk102.on('track', function(gps) {
        console.log(gps);
});
 
console.log("TK102 Server running on port "+portNum);
