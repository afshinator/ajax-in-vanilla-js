/*
 * My implementation of the Javascript Engineer Exercise from Distil
 *
 * Afshin Mokhtari
 * afshinator@gmail.com
 */

 /* 
  Notes to reader:

  - Since Part 2 of the challenge includes Part 1, the code below is the answer to both parts.

  - I assume the functionality I was told to implement exists in the context of some application,
    so I wrapped all the code below and encapsulated the ajax calls into its own object.

  - The spec for this challenge said: 'Every 10 seconds append an incrementing count value to the header,'
    it didn't actually mention sending the requests between these custom header updates,
    so I wrote it so that it doesn't assume a call is made between those header updates.

  - The Ajax calls and setting a timer to increment the value in the header happen
    in the Main application flow area at the bottom.

 */



// Enclose application
(function() {

  // Variables global to the application
  var ajaxUrl = 'http://...',       // This would be where the (cross-domain) request will be made to
      botsCounter = 0;              // holds the count value for the header,
                                    // Custom header starts out as 'bots', then 'bots-1', 'bots-2', etc every 10 secs


  // Ajax functions Helper object available to the app
  var ajax = function() {
    // Call this first.  Returns a XMLHTTPRequest instance or null on error.
    var createCORSRequest = function( method, url, onOpenSuccess ) {
      var error = false,
          xhr = new XMLHttpRequest();

      // This will catch errors like invalid url
      xhr.addEventListener("error", function() { alert('Transfer failed! Invalid url?'); error = true; }, false);
      xhr.addEventListener("load", onOpenSuccess, false);


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
    };


    // call after createCORSRequest, but before send() on xhr
    var setRequestHeader = function( xhr, hdr, val ) {
      xhr.setRequestHeader( hdr, val );
    };


    // Make the actual call, using the passed in handler for the response.
    // Call after creating the request, and setting custom request header if used.
    var makeCORSRequest = function( xhr, responseHandler ) {
      //  Response handler
      xhr.onreadystatechange = responseHandler;

      // Should at minimum handle this error: 
      xhr.onerror = function() {
        // alert( 'Oh no, there was an error making the request.' );
        return 0;
      };

      xhr.send();
      return 1;
    };

    // ... more methods here

    return {
      createRequest : createCORSRequest,
      setRequestHeader : setRequestHeader,
      makeRequest: makeCORSRequest
      // ... 
    };

  }();      // end my ajax object


  // More app-wide helper objects here...


  /* 
   * Main application flow
   */

  var successfulXHROpen = function() {
    console.log( ' --> successfulXHROpen <-- ');
  };

  var xhr = ajax.createRequest( 'GET', ajaxUrl,  function(){ console.log('success?') } ),   // ajaxUrl is app-wide global var
      responseHandler = function() { /* ... */ };   // callback function for the ajax request

  if ( xhr ) {
    ajax.setRequestHeader( xhr, 'x-distil-blocks', 'bots');  // the very first time, just 'bots'

    // ... other code could go here... including call(s) to xhr.send() ...

    // Setup a counter that increments the custom header every ten seconds
    var intervalID = window.setInterval( function() {
      botsCounter++;
      ajax.setRequestHeader( xhr, 'x-distil-blocks', 'bots-' + botsCounter );
      // now any calls to ajax.makeRequest( xhr, responseHandler ) in the next 10 seconds will have updated bots- value
    }, 10000 );

    // Now we're setup so that any calls to ajax.makeRequest( xhr, responseHandler ) will have the
    // header reflect which 10 second interval the request was sent in...

    // More app code here...

    // At some point, 
    if ( ajax.makeRequest( xhr, responseHandler ) === 0 ) {
      // error condition
      console.log('Error making the request!');
      window.clearInterval( intervalID );
    }


  }
  else {
    // CORS not supported...
  }

  // ...

})();
