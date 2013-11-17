/*
Name:         tk102
Description:  TK102 GPS server for Node.js
Source:       https://github.com/fvdm/nodejs-tk102
Feedback:     https://github.com/fvdm/nodejs-tk102/issues
License:      Unlicense / Public Domain

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org>
*/


// INIT
var net = require('net'),
    EventEmitter = require('events').EventEmitter

var tk102 = new EventEmitter()

// defaults
tk102.settings = {
	ip:		'0.0.0.0',	// default listen on all IPs
	port:		0,		// 0 = random, 'listening' event reports port
	connections:	3,		// 10 simultaneous connections
	timeout:	3		// 10 seconds idle timeout
}

// Create server
tk102.createServer = function( vars ) {
	
	// override settings
	if( typeof vars == 'object' && Object.keys(vars).length >= 1 ) {
		for( var key in vars ) {
			tk102.settings[ key ] = vars[ key ]
		}
	}
	
	// start server
	tk102.server = net.createServer( function( socket ) {
		
		// socket idle timeout
		if( tk102.settings.timeout > 0 ) {
			socket.setTimeout( tk102.settings.timeout * 1000, function() {
				tk102.emit( 'timeout', socket )
				socket.end()
				socket.destroy()
			})
		}
		
	}).listen( tk102.settings.port, tk102.settings.ip, function() {
		
		// server ready
		tk102.emit( 'listening', tk102.server.address() )
		
	})
	
	// maximum number of slots
	tk102.server.maxConnections = tk102.settings.connections
	
	// inbound connection
	tk102.server.on( 'connection', function( socket ) {
		
		tk102.emit( 'connection', socket )
		socket.setEncoding( 'utf8' )
		var data = ''
		
		// receiving data
		socket.on( 'data', function( chunk ) {
			tk102.emit( 'data', chunk )
			data += chunk
		})
		
		// complete
		socket.on( 'close', function() {
			
			var gps = {}
			gps = tk102.parse( data )
			if( data != '' ) {
				var gps = tk102.parse( data )
				if( gps ) {
					tk102.emit( 'track', gps )
				} else {
					tk102.emit( 'fail', {
						reason:	'Cannot parse GPS data from device',
						socket:	socket,
						input:	data
					})
				}
			}
			
		})
		
	})
}

// Parse GPRMC string
tk102.parse = function( raw ) {
	
	// 1203292316,0031698765432,GPRMC,211657.000,A,5213.0247,N,00516.7757,E,0.00,273.30,290312,,,A*62,F,imei:123456789012345,123
	// #353588020145956##1#0000#AUT#01#2340104bb6374c#00000.0000,E,0000.0000,N,0.00,0.00#000000#000000.000##".
	// #353588020145956##1#0000#AUT#01#2340104bb6374c#123.854500,W,5056.346600,N,0.00,0.00#171113#205016.000##
	var raw = raw.trim()
	var str = raw.split('#')
	var data = false
	
	// only continue with correct input, else the server may quit...
	if( str.length == 13) {
	
	    //Check GPS fix
	    if(str[9]=="000000") { // date is blank, so no GPS
	        var gpsFix = false;
	    } else {
	        var gpsFix = true;
	    }
		
		// parse
		var datetime = str[9].replace( /([0-9]{2})([0-9]{2})([0-9]{2})/, function( match, day, month, year ) {
			return '20'+ year +'-'+ month +'-'+ day
		})+" "+str[10].replace( /([0-9]{2})([0-9]{2})([0-9]{2})\.([0-9]{3})/, function( match, hour, minute, second, ms ) {
			return hour +':'+ minute +':'+ second
		})
		
		var gpsPieces = str[8].split(',')
		
		data = {
			'raw':		raw,
			'datetime':	datetime,
			'geo': {
				'latitude':	tk102.fixGeo( gpsPieces[2], gpsPieces[3] ),
				'longitude':	tk102.fixGeo( gpsPieces[0], gpsPieces[1] ),
				'bearing':		parseInt( gpsPieces[5] )
			},
			'speed': {
				'knots':	Math.round( gpsPieces[4] * 1000 ) / 1000,
				'kmh':		Math.round( gpsPieces[4] * 1.852 * 1000 ) / 1000,
				'mph':		Math.round( gpsPieces[4] * 1.151 * 1000 ) / 1000
			},
			'imei':		str[1],
			'fix':      gpsFix
		}
	}
	
	// done
	return data
}

// Clean geo positions, with 6 decimals
tk102.fixGeo = function( one, two ) {
	var minutes = one.substr(-9, 9)
	var degrees = parseInt( one.replace( minutes, '' ), 10 )
	var one = degrees + (minutes / 60)

	var one = parseFloat( (two == 'S' || two == 'W' ? '-' : '') + one )
	return Math.round( one * 10000 ) / 1000000
}

// ready
module.exports = tk102
