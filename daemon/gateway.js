console.log("TK102 TCP GPRS Gateway v0.1-dev");
console.log("Loading...");

var tk102 = require('./tk102');
var mysql = require('mysql');

var portNum = 5030;

console.log("Setting up mysql connection..")

var dbPool  = mysql.createPool({
  host     : 'localhost',
  database : 'tk102',
  user     : 'tk102',
  password : 'SrL3M7RjdMAHTPtx',
  connectionLimit : 2
});

console.log("Setting up tk102 interface..")

tk102.createServer({
        port: portNum
});

tk102.on('track', function(gps) {
        console.log(gps);
        
        var nuData  = {};
        nuData['time'] = gps.datetime;
        nuData['latitude'] = gps.geo.latitude;
        nuData['longitude'] = gps.geo.longitude;
        nuData['bearing'] = gps.geo.bearing;
        nuData['speed'] = gps.speed.mph;
        nuData['raw'] = gps.raw;
        
        dbPool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query('INSERT INTO positions SET ?', nuData, function(err, rows, fields) {
                        if (err) throw err;
                        connection.release();
                });
        });
});
 
console.log("\nTK102 TCP Gateway now running on port "+portNum);
