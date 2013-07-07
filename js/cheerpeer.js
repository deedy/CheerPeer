
// Load the SDK asynchronously
(function(d){
var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
if (d.getElementById(id)) {return;}
js = d.createElement('script'); js.id = id; js.async = true;
js.src = "//connect.facebook.net/en_US/all.js";
ref.parentNode.insertBefore(js, ref);
}(document));




window.fbAsyncInit = function() {
  FB.init({
    appId      : '593762713978577', // App ID
    channelUrl : '//www.debarghyadas.com/', // Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });

  // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
  // for any authentication related change, such as login, logout or session refresh. This means that
  // whenever someone who was previously logged out tries to log in again, the correct case below 
  // will be handled. 
  FB.Event.subscribe('auth.authResponseChange', function(response) {
    if (response.status === 'connected') {
      $('#login-fb').animate({opacity: 0},1000);
      setTimeout(function(){$('#login-fb').find('h3').text('Logged In')},1000);
      setTimeout(function(){$('#login-fb').animate({opacity: 1},1000)},1000);

      testAPI(response.authResponse.accessToken, response.authResponse.userID);
    } else if (response.status === 'not_authorized') {
      FB.login();
    } else {
      FB.login();
    }
  });
};
var userID;
function testAPI(accessToken, uID) {
	userID = uID;
	console.log(accessToken);
	console.log(userID);
	console.log('Welcome!  Fetching your information.... ');
	return;
	// Only access 
	var request = '/'+uID+'/inbox?message&access_token='+accessToken;
	console.log(request);
	FB.api(request, function(r) { processResponses(r); sentimentAnalysis(records); });
	sentimentAnalysis(records);
}


function sentimentAnalysis(records) {
	var alchemykey = '1889ff9ee25d0df8b856e00c42241d99494eff8c';
	for (var i in records) {
		var params = {};
		params['friendname'] = i;
		params['whathesentyou'] = records[i].from;
		params['whatyousenthim'] = records[i].to;
		var serverSideVals = $.ajax({
			url: "./sentiment.php",
			type: "POST",
			data: params,
			dataType: "json",
			async: false
		}).responseJSON;
		console.log(i+"\t"+serverSideVals.from+"\t"+serverSideVals.to);
		console.log(params['whathesentyou']);
		console.log(params['whatyousenthim']);

	}
}

var records = {};
function processResponses(response) {
	if(response.hasOwnProperty('error')){
		alert('API Limit exceeded');
	}
	// Only retrieving the first 25 people to save API calls
	for (var i in response.data) {
		var friendname;
		for (var j in response.data[i].to.data) {
			if (response.data[i].to.data[j].id!=userID) {
				friendname = response.data[i].to.data[j].name;
				break;
			}
		}
		// Only retrieving the first 25 messages for each people
		if (response.data[i].comments) {
			var to = '';
			var from = '';
			for (var j in response.data[i].comments.data) {
				// insertIntoTable(response.data[i].comments.data[j].created_time,response.data[i].comments.data[j].from.name,response.data[i].comments.data[j].message);
				
				if (response.data[i].comments.data[j].from && response.data[i].comments.data[j].from.id == userID) {
					to+=' '+response.data[i].comments.data[j].message;
				} else {
					from+=' '+response.data[i].comments.data[j].message;
				}
			}
			records[friendname] = {};
			records[friendname].to = to;
			records[friendname].from = from;
		}
	}
}

function insertIntoTable(time, from, message) {
	$('#data').append('<tr><td>'+time+'</td><td>'+from+'</td><td>'+message+'</td></tr>');
}

