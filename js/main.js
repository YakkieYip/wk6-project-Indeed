// Create our namespace / empty object
var myApp = {};

// Insert API key name of '.apiKey' into myApp {} and store API key
myApp.jyipKey = '886387905641973'; // insert personal API key

// Add event listener onto page, once clicked grab input field values by user
// myApp.input1Listener = function(){
// 	$('.keywords').on('change', function(){
// 		var input1 = $(this).val();
// 		if(input1 && input1.length >=2){
// 			myApp.input2Listener();
// 			return input1;
// 		};	
// 	});
// };

// myApp.input2Listener = function(){
// 	$('.keywords').on('change', function(){
// 		var input2 = $(this).val();
// 		if(input2 && input2.length >=2){
// 			myApp.searchListener();
// 			return input2;
// 		};	
// 	});
// };

myApp.searchListener = function(){
  $("form.mainForm").on("submit", function(e) {
  		e.preventDefault();
  		// if(input1 && input1.length >=2){
  		myApp.keywords = $('.keywords').val();
  		myApp.location = $('.location').val();
  		myApp.getUserInput();

  });
};

// Create a method to .ajax call Indeed jobs
myApp.getUserInput = function(){
	$.ajax({
	    url: 'http://proxy.hackeryou.com', // setup proxy url
	    dataType: 'json',
	    method: 'GET',
	    data: {
	        reqUrl: 'http://api.indeed.com/ads/apisearch', // no '?' after '/apisearch' because 'params:' builds a querystring from the supplied object/array
	        params: {
	            publisher: myApp.jyipKey, // Publisher ID : Personal API key
	            v: 2, // API Version : All publishers should be using v.2 | Required 
	            format: 'json', // Output format of API : 'json'	| default is XML
	            q: myApp.keywords, 
	            // 'javascript', // Query : 'javascript'	| default is 'as_and'
	            l: myApp.location,
	            // 'toronto', // Location : postal code or 'city, state/province/region' combo.
	            sort: 'date', // Sort by : relevance  | Can sort by 'date'. Default is 'relevance'.
	            radius: 25, // Distance from search Location : Default is 25 MILES of 'Location'.

	            /* These could be left default/we didn't need them?:
	            
	            st: Site type. To show only job board jobs, use "jobsite". For jobs from direct employer websites use "employer".

	            jt: Job type. Allowed values: "fulltime", "parttime", "contract", "internship", "temporary".

	            start: Results start at this number, beginning with 0. Default is 0.
	            
	            */
	            limit: 9, // Max num of results returned per query : Default is 10
	            fromage: 30, // Num of days back, ie: 30 = a month back, to search.
	            highlight: 1, // Set 1 will bold terms in snippet that are also present in q. Default is 0.
	            filter: 1, // Filter duplicate job results. 0 turns off filter. Default is 1.
	            latlong: 1, // If Latitude AND longitude = 1, gives info per job result. Default is 0.
	            co: 'ca' // Country : 'ca' aka CAN. | Default is 'us'.
	            /*
	            Ryan mentioned we didn't need these, but I don't know why:

	            chnl:	// Channel Name: Group API requests to a specific channel
	            userip:	// The IP number of the end-user to whom the job results will be displayed. This field is required.
	            useragent: // The User-Agent (browser) of the end-user to whom the job results will be displayed. Can be obtained from "User-Agent" HTTP request header from the end-user. This field is required.
	            

	            NOTE: 'formattedLocation:' and 'formattedLocationFull: will often be IDENTICAL. The exact values differ based on country and the data we have available.
	            radius is optional; it will only be included when appropriate.

	            * Note that the ordering of response fields is not guaranteed
	            */   
	        }
	    } // end data
	}).then(function(res) { // promise
		console.log(res);
		myApp.firstTenJobs = res.results;
		console.log(myApp.firstTenJobs);
	});
}; // end myApp.init


myApp.init = function(){
	myApp.input1Listener
	myApp.searchListener();
};

// On document ready, call initialize method.
$(function() {
	myApp.init();
	
// MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE
	myApp.getLocation();
});

//Back to top function
$('a.top').click(function () {
  $(document.body).animate({scrollTop: 0}, 800);
  return false;
});

// On document ready, call initialize method.
$(function() {
	myApp.init();
});

// MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE MIKE

// http://stackoverflow.com/questions/4013606/google-maps-how-to-get-country-state-province-region-city-given-a-lat-long-va
// http://maps.googleapis.com/maps/api/geocode/json?latlng=43.766483,-79.41209&sensor=false

	myApp.userLocation;

myApp.getLocation = function(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			myApp.userLocation = {latitude:position.coords.latitude, longitude:position.coords.longitude};
console.log("latitude: " + myApp.userLocation.latitude);
console.log("longitude: " + myApp.userLocation.longitude);
myApp.getCity(myApp.userLocation);
		});	
	} else {
		alert("Geolocation is not supported by your browser");
	}
};
myApp.getCity = function(coordinates){
		$.ajax({
			url: "http://geocoder.ca/?",
			method: 'GET',
			dataType: 'jsonp',
			data: {
				moreinfo: "1",
			reverse: "Reverse+GeoCode",
			latt: coordinates.latitude,
			longt: coordinates.longitude,
			jsonp: '1',
			callback:'test'}

// test coordinates
	        // latlng: "43.67023,-79.38676" //Toronto
	        // latlng: "43.79104,-79.54052" //Vaughn
	        // latlng: "48.40690,-89.24594" //Thunder Bay
	        // latlng: "43.95084,-78.29176" //Port Hope
	        // latlng: "43.91924,-80.09741" //Orangeville
	        // latlng: "43.58821,-79.64172" //Mississauga
	        // latlng: "44.23142,-76.48101" //Kingston
	        // latlng: "43.84404,-79.01822" //Ajax
	        // latlng: "42.99176,-79.25059" //Welland
	        // latlng: "48.40690,-89.24594" //Thunder Bay

	}).then(function(reverseGeocodingResult) {
console.log("city "+reverseGeocodingResult.city);
console.log("prov "+reverseGeocodingResult.prov);
console.log("post "+reverseGeocodingResult.postal);
	});
};