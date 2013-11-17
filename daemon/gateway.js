console.log("TK102B TCP GPRS Gateway v0.1-dev");
console.log("Loading...");

var net = require('net');

var portNum = 5030;

net.createServer(function (socket) { 
    socket.on('data', function (data) {
        console.log("Message received from "+socket.remoteAddress+": "+data);
    });

    socket.on('end', function () {
        console.log(socket.remoteAddress+" Disconnected.");
    });
}).listen(portNum);
 
console.log("TCP Server running on port "+portNum+"\n");
