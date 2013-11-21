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
        var modData = {};
        modData['last_updated']=new Date();
        
        if(gps.model=='clone1') {
        
            if(gps.fix) {
                modData['last_fix']=new Date();
                var posData = {};
                posData['time'] = gps.datetime;
                posData['latitude'] = gps.geo.latitude;
                posData['longitude'] = gps.geo.longitude;
                posData['bearing'] = gps.geo.bearing;
                posData['speed'] = gps.speed.mph;
                posData['raw'] = gps.raw;
                
                dbPool.getConnection(function(err, connection) {
                        if (err) throw err;
                        connection.query('INSERT INTO positions SET ?', posData, function(err, rows, fields) {
                                if (err) throw err;
                                connection.release();
                        });
                });
                dbPool.getConnection(function(err, connection) {
                        if (err) throw err;
                        connection.query('UPDATE modems SET ? WHERE imei=?', [modData,gps.imei], function(err, rows, fields) {
                                if (err) throw err;
                                connection.release();
                        });
                });
            } else { // No fix, but modem has checked in.
                dbPool.getConnection(function(err, connection) {
                        if (err) throw err;
                        connection.query('UPDATE modems SET ? WHERE imei=?', [modData,gps.imei], function(err, rows, fields) {
                                if (err) throw err;
                                connection.release();
                        });
                });
            }
        
        } else if(gps.model=='tk102-2') {
        
            if(gps.gps.fix) {
                modData['last_fix']=new Date();
                var posData = {};
                posData['time'] = gps.datetime;
                posData['latitude'] = gps.geo.latitude;
                posData['longitude'] = gps.geo.longitude;
                posData['bearing'] = gps.geo.bearing;
                posData['speed'] = gps.speed.mph;
                posData['altitude'] = gps.geo.altitude;
                posData['sats'] = gps.gps.sats;
                posData['sig'] = gps.gps.signal;
                posData['battery'] = gps.device.battv;
                posData['charging'] = gps.device.charging;
                posData['MCC'] = gps.gsm.mcc;
                posData['MNC'] = gps.gsm.mnc;
                posData['LAC'] = gps.gsm.lac;
                posData['Cell'] = gps.gsm.cell;
                posData['raw'] = gps.raw;
                
                dbPool.getConnection(function(err, connection) {
                        if (err) throw err;
                        connection.query('INSERT INTO nupositions SET ?', posData, function(err, rows, fields) {
                                if (err) throw err;
                                connection.release();
                        });
                });
                dbPool.getConnection(function(err, connection) {
                        if (err) throw err;
                        connection.query('UPDATE modems SET ? WHERE imei=?', [modData,gps.imei], function(err, rows, fields) {
                                if (err) throw err;
                                connection.release();
                        });
                });
            } else { // No fix, but modem has checked in.
                dbPool.getConnection(function(err, connection) {
                        if (err) throw err;
                        connection.query('UPDATE modems SET ? WHERE imei=?', [modData,gps.imei], function(err, rows, fields) {
                                if (err) throw err;
                                connection.release();
                        });
                });
            }
        
        }
});
 
console.log("\nTK102 TCP Gateway now running on port "+portNum);
