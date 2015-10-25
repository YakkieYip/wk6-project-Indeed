// Create our namespace / empty object
var myApp = {};

myApp.displayCount = 0; //increments by 9
myApp.pageCount = 0; // increments by 1 at the same time as displaycount increments
myApp.resultsCount = 0;
// Insert API key name of '.apiKey' into myApp {} and store API key
myApp.jyipKey = '886387905641973'; // insert personal API key
myApp.userLocation;

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

/* 0: Object
city: "Toronto"
company: "CaseWare"
country: "CA"
date: "Thu, 22 Oct 2015 23:00:42 GMT"
expired: false
formattedLocation: "Toronto, ON"
formattedLocationFull: "Toronto, ON"
formattedRelativeTime: "2 hours ago"
indeedApply: false
jobkey: "4fe1e73045932fd8"
jobTitle: "Application Developer"
latitude: 43.697803
longitude: -79.41209
onmousedown: "indeed_clk(this, '18');"
snippet: "Knowledge of Java, <b>Javascript</b>, CSS, HTML, Angular JS desirable. Become an integral part of a small team of developers building a feature-rich, high-performance,..."
source: "CaseWare"
sponsored: false
state: "ON"
url: "http://ca.indeed.com/viewjob?jk */

myApp.searchListener = function(){
  $("form.mainForm").on("submit", function(e) {
  		e.preventDefault();
  		myApp.keywords = $('.keywords').val();
  		myApp.location = $('.location').val();
  		if( myApp.keywords.length >= 2 && myApp.location.length >= 2){
	  		$('.hidden').removeClass('show').addClass('hide');	
	  		// myApp.resultsCount = 0; //reset the counter
	  		myApp.getUserInput();
  		} else {
  			console.log('poop');
  			$('.hidden').removeClass('hide').addClass('show');
  		};
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
	            q: myApp.keywords, // 'javascript', // Query : 'javascript'	| default is 'as_and'
	            l: myApp.location, // 'toronto', // Location : postal code or 'city, state/province/region' combo.
	            sort: 'date', // Sort by : relevance  | Can sort by 'date'. Default is 'relevance'.
	            radius: 25, // Distance from search Location : Default is 25 MILES of 'Location'.

	            /* These could be left default/we didn't need them?:
	            st: Site type. To show only job board jobs, use "jobsite". For jobs from direct employer websites use "employer".

	            // jt: Job type. Allowed values: "fulltime", "parttime", "contract", "internship", "temporary".

	            // */
	            // start: myApp.resultsCount,//Results start at this number, beginning with 0. Default is 0.


	            limit: 9, // Max num of results returned per query : Default is 10, max 25
	            start: myApp.resultsCount,//Results start at this number, beginning with 0. Default is 0.
	            // start: 0, //global variable - chunks of 9, make it DYNAMIC
	            fromage: 30, // Num of days back, ie: 30 = a month back, to search.
	            highlight: 1, // Set 1 will bold terms in snippet that are also present in q. Default is 0.
	            filter: 1, // Filter duplicate job results. 0 turns off filter. Default is 1.
	            latlong: 1, // If Latitude AND longitude = 1, gives info per job result. Default is 0.
	            co: 'ca' // Country : 'ca' aka CAN. | Default is 'us'.
	            
	            /* Ryan mentioned we didn't need these, but I don't know why:
	            chnl:	// Channel Name: Group API requests to a specific channel
	            userip:	// The IP number of the end-user to whom the job results will be displayed. This field is required.
	            useragent: // The User-Agent (browser) of the end-user to whom the job results will be displayed. Can be obtained from "User-Agent" HTTP request header from the end-user. This field is required.

	            NOTE: 'formattedLocation:' and 'formattedLocationFull: will often be IDENTICAL. The exact values differ based on country and the data we have available.
	            radius is optional; it will only be included when appropriate.
	            /* Note that the ordering of response fields is not guaranteed */
	        }
	    } // end data
	}).then(function(res) { // promise
		myApp.ajaxResults = res; //save our results in a global variable to access later
		console.log(myApp.ajaxResults);

		myApp.jobSearchResults = res.results; //array of 25 job listings
		console.log(myApp.jobSearchResults);

		$('span.start').text(myApp.ajaxResults.start);
		$('span.end').text(myApp.ajaxResults.end);
		$('span.totalResults').text(myApp.ajaxResults.totalResults);
		
// myApp.jobSearchResults.showing.start = res.results.start;
// myApp.jobSearchResults.showing.end = res.results.end;
// myApp.jobSearchResults.showing.totalResults = res.results.totalResults;
// console.log(myApp.jobSearchResults.showing.start);
// console.log(myApp.jobSearchResults.showing.end);
// console.log(myApp.jobSearchResults.showing.totalResults);
		
		myApp.resultsCount += res.results.length; //set a counter variable for page loading logic
		// myApp.counter(); //should the counter method be called here?

		var allArticleObjects = myApp.createJobArticles(myApp.jobSearchResults);
		$('.container').empty();
		$.each(allArticleObjects, function(index, value){
			$('.container').append(value);
		// myApp.counter();
		});
	});
}; // end myApp.init

myApp.loadListener = function(){
	$('.loadMore').on('submit', function(e){
		e.preventDefault();
		
	});
};

// myApp.counter = function(){
// 	$('form.loadMore').on('submit', function(e){
// 		e.preventDefault();
// 		$('span.start').text(myApp.ajaxResults.start);
// 		$('span.end').text(myApp.ajaxResults.end);
// 		$('span.totalResults').text(myApp.ajaxResults.totalResults);
// 	});
// };

// load more button

// take everything i did to make the call, append it to the new div

// $('.load').removeClass('show').addClass('hide');
// $('.load').removeClass('hide').addClass('show');


//create an array of article elements
myApp.createJobArticles = function(resultsArray){
	var objectArray = [];
	$.each(resultsArray, function(index, value){
		var articleObject = myApp.createJobArticle(value);
		objectArray.push(articleObject);
	});
	return objectArray;	
};

//create the html of one article element
myApp.createJobArticle = function(job){
	// var htmlText = '';
	var $article = $('<article>').addClass('equalHM eq');
	//header element
	var $header = $('<header>').addClass('lime');
	var $howRecent = $('<h4>').text(job.formattedRelativeTime);
	var $jobTitle = $('<h3>').text(job.jobtitle);
	$header.append($howRecent, $jobTitle);
	//body
	var $description = $('<p>').addClass('description').html(job.snippet).append($('<a>').attr('href', job.url).text(' Learn More'));
	// var $link = 
	//footer
	var $footer = $('<footer>').addClass('moreInfo');
	var $companyInfo = $('<h5>').text(job.company);
	var $cityProv = $('<h6>').text(job.formattedLocationFull);
	$footer.append($companyInfo, $cityProv);

	// assemble all variables into one article element
	$article.append($header, $description, $footer);
	return $article;
};


//initialize Listener
myApp.init = function(){
	myApp.getLocation();
	myApp.searchListener();
	myApp.loadListener();
};

// On document ready, call initialize method.
$(function() {
	myApp.init();
	// $(".keywords").val("Javascript");
	// $(".location").val("Toronto");	
});

//Back to top function
$('a.top').click(function () {
  $(document.body).animate({scrollTop: 0}, 800);
  return false;
});

myApp.getLocation = function(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			myApp.userLocation = {latitude:position.coords.latitude, longitude:position.coords.longitude};
			
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
				jsonp: '1',
				callback:'test',
				latt: coordinates.latitude,
				longt: coordinates.longitude
			}

	}).then(function(reverseGeocodingResult) {

		myApp.userLocation.city = reverseGeocodingResult.city;
		myApp.userLocation.province = reverseGeocodingResult.prov;
		myApp.userLocation.postalCode = reverseGeocodingResult.postal;

		$('.location').val(myApp.userLocation.city + ", " + myApp.userLocation.province)
		// $('.location').val(myApp.userLocation.postalCode)

	});
};