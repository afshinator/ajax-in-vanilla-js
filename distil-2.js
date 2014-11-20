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
  // var    ajaxUrl = 'http://httpbin.org/ip', 
      botsCounter = 0;              // holds the count value for the header,
                                    // Custom header starts out as 'bots', then 'bots-1', 'bots-2', etc every 10 secs

  var xhr = new XMLHttpRequest();

  // Dont really need event handlers if I'm checking readyState and status
  xhr.addEventListener("error", function() { console.log('**error caught');}, false);
  xhr.addEventListener("load", function() { console.log('**load caught');}, false);
  xhr.addEventListener("progress", function() { console.log('**progress caught');}, false);
  xhr.addEventListener("abort", function() { console.log('**abort caught');}, false);  

  xhr.open('GET', ajaxUrl, true);

  xhr.onreadystatechange = function() {
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest    
    // 0 UNSENT  open()has not been called yet.
    // 1 OPENED  send()has not been called yet, but ready for call to setRequestHeader()
    // 2 HEADERS_RECEIVED  send() has been called, and headers and status are available.
    // 3 LOADING Downloading; responseText holds partial data.
    // 4 DONE
    console.log('event handler for request executed, readyState: ' + xhr.readyState); 
    console.log('status: ' + xhr.status);  // error code , we want 200

    console.log('__responseText:' + xhr.responseText);
    console.log('__responseXML: ' + xhr.responseXML);
    console.log('---------------------------------------');

      // if (httpRequest.status === 200) {
  };

  // Should at minimum handle this error: 
  xhr.onerror = function() {   // this will fire on a bad url, after send()
    alert( 'Oh no, there was an error making the request.' );
  };

  xhr.send();

})();
