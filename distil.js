/*
 * My implementation of the Javascript Engineer Exercise from Distil
 *
 * Afshin Mokhtari
 * afshinator@gmail.com
 */

 /* 
  Notes to reader:

  - Since Part 2 of the challenge includes Part 1, the code below is the answer to both parts.

  - The spec for this challenge said: 'Every 10 seconds append an incrementing count value
  	to the header,' - it didn't actually mention sending the requests between these custom
  	header updates,  so I wrote it so that time will roll by and as long as you use the
  	mechanism I provided below, it will get the correct custom header.

	- You'll see that I tried to identify & show handling of the main error conditions.
 */


(function() {

	// Helper object for ajax functionality, available to whole app.
	var ajax = function() {
		var 
		createCORSRequest = function( method, url ) {
			var xhr = new XMLHttpRequest();

      // If the XMLHttpRequest object has a "withCredentials" property which
      // only exists on XMLHTTPRequest2 objects, go ahead and use it.
      if ( 'withCredentials' in xhr ) {
        xhr.open(method, url, true);
      }
      else if ( typeof XDomainRequest != 'undefined' ) {
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests:
        xhr = new XDomainRequest();
        xhr.open(method, url);
      }
      else {
        // Otherwise, CORS is not supported by the browser.
        xhr = null;
        alert( 'CORS not supported!' );
      }

      return xhr;
		},

		setRequestHeader = function( xhr, hdr, val ) {
			xhr.setRequestHeader( hdr, val );
		}

		// In a real app, there would be more functionality in here...

		return {
			createRequest : createCORSRequest,
			setRequestHeader : setRequestHeader
		};

	}();



	/*
	 * Main App flow,
	 */

	var delay = 10000; 	// 10000 = 10 secs, delay between custom-header changes

	var xhr,														// Reference to ajax object
			// url = 'http://bogus',				// Fake url for testing
			url = 'http://httpbin.org/ip',	// Real url for a quick GET, for testing
			botsCounter = 0,								// Where to start the counter for custom header
			header = { hdr : 'x-distil-blocks', val : 'bots' },  // the custom header

			// Setup a timer to increment custom header value
			intervalId = window.setInterval( function() {
				botsCounter++;
				console.log( '> bots-' + botsCounter );   // for testing
				}, delay );


	// startRequest() - Every unique ajax call will use this function
	//	method - 'GET', 'POST', ...
	//	url	- endpoint to make request to
	//	customHdr - optionally passed in for custom header
	// 	addCounterToHeader - optional boolean; whether to add the timed counter to custom header
	function startRequest( method, url, customHdr, addCounterToHeader ) {
		var xhr = ajax.createRequest( 'GET', url ),
				hdrVal = '';

		// After ajax.createRequest(), xhr.readyState is 1, even if url is invalid
		// console.log('xhr created and opened; readyState: ' + xhr.readyState); 

		if ( xhr !== null ) {
			if ( xhr.readyState > 0 ) {  // can't setRequestHeader if readyState < 1
				if ( customHdr ) {
					hdrVal = customHdr['val'];
					if ( addCounterToHeader && botsCounter ) {
						hdrVal += ( '-' + botsCounter );
					}
					ajax.setRequestHeader( xhr, customHdr.hdr, hdrVal );
					console.log('--->>> Header was customized to: ' + hdrVal);
				}

				return xhr;
			}
			else {  // readyState should've advanced beyond 0 but hasn't, something is wrong
				console.log( 'Error: readyState : ' + xhr.readyState );
				return 0;
			}			
		}
		else {  // ajax.createRequest() returned an error
			return 0;
		} 

	}


	/*
	 * ok, now here is some code to test out what we're trying to accomplish...
	 *
	 * Sets up a request to be made in a random number of seconds and shows us 
	 * what the bots-x value is at that time.
	 */

	var rndDelay = Math.round( Math.random() * 10 * delay ), 
			test1;

	console.log( 'Lets test the custom header by sending a request in a random # of seconds...' );
	console.log( 'Expecting request in about ' + Math.round( rndDelay/1000 )  +
		' seconds to have bots-' + Math.floor( rndDelay/10000 ) + ' in the header.' );
	console.log( 'Watch as the time rolls by and the header changes every ' + delay/1000 + ' seconds.' );

	test1 = window.setTimeout( function() {
		xhr = startRequest( 'GET', url, header, true );

		if ( xhr ) {
		  // Should at minimum handle this error: 
		  xhr.onerror = function() {   // this will fire on a bad url, after xhr.send() is called.
		    alert( 'Oh no, there was an error making the request.' );
		  };

		  xhr.onreadystatechange = function() { // gets called everytime readyState changes
		    console.log('Event handler for request called, readyState: ' + xhr.readyState +
		    	', status: ' + xhr.status +  											// 200 is good
		    	', responseText:' + xhr.responseText );						// response data
	  	};

	  	xhr.send();  // Make the actual request.
		} 
		else {
			console.log('error condition...');
		}

	}, rndDelay );


})();