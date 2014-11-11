
    
   function doAlert()
   {
    alert("what the fuck");
}

/*

  //delay after 100 miliseconds when the job can actually be longer than 100 miliseconds 
    setInterval(function(){
        alert("delay 1 sec");
    },100);
    
    //this way an alert his fired and after 1000 miliseconds the function is selfcalled again and again
    (function(){    
        alert("delay 1 sec");
        setTimeout(arguments.callee,1000);    
    }()

    //this way an alert his fired and after 1000 miliseconds the function is selfcalled again and again
    (function myloopsy(){    
        alert("delay 1 sec");
        setTimeout(myloopsy,1000);    
    }()

*/



   /*       


    //http://www.cornify.com/js/cornify.js


    function getScript(url, callback){
    
    
		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
    
    }



    getScript('http://www.cornify.com/js/cornify.js', function(){
    var times = [42,28,75,50,62];
    times = times[Math.floor(Math.random()*times.length)];

      
      //$(document).keydown(cornify_add);
    while(--times)
        cornify_add();


    });

   
   
   
   
   */