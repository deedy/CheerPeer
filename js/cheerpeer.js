$(document).ready(OAuthHumanAPI);

var appid = "75c158e3d4a9e9d8f7c0d84aa544c8713b55fcda";
var appsecret = "590ab5e1a81d5dcdbc45ed1a5cd0414cdca841a6";
var accessKey;
var lastNdays = 3;
function OAuthHumanAPI() {
	if (accessKey) {
		alert('wtf');
	}
	var dates = getLastNDates(lastNdays);
	var code;
	var parameter = window.location.search.replace( "?", "" );
	if (parameter.substr(0,parameter.indexOf('='))=="code") {
		code = parameter.substr(parameter.indexOf('=')+1);
	} else {
		var queryURL = 'http://user.humanapi.co/oauth/authorize?client_id='+
			appid+'&redirect_uri=http://localhost/~deedy/CheerPeer';
		window.location.href = queryURL;
	}
	var postURL = "http://user.humanapi.co/oauth/token";
	//Failed PHP OAuth
	var params = {'code':code, 'client_id':appid, 'client_secret':appsecret};
	$.ajax({
	   url: './oauth.php',
	   type: "POST",
	   data: params,
	   success: function (response) {//response is value returned from php (for your example it's "bye bye"
	     // alert(response);
	     // accessKey = response.accessToken;
	     // alert(accessKey);
	      getHumanAPI();
	   }
	});
}
var updateinterval = 2000;
function getHumanAPI() {
	getHeartRate(72);
	getBloodPressure(70);
	getBloodGlucose(130);
	getSleepCycles(150);
	getActivity(50,30);
}

function getActivity(light,med) {
	var lightv = Math.max(Math.round(light+(Math.random()*6-3)),0);
	var medv = Math.max(Math.round(med+(Math.random()*4-2)),0);
	var highv = Math.max(0,100-lightv-medv);
	if ($('#am')) {
		$('#am').remove();
		$('#canvas').append('<canvas id="am" width="417" height="200" style="position: relative; margin-top: -200px;"></canvas>');
	}
	var ctx = document.getElementById("am").getContext("2d");
	var data = [
	{
		value: highv,
		color:"#2c3e50"
	},
	{
		value : medv,
		color : "#2980b9"
	},
	{
		value : lightv,
		color : "#7f8c8d"
	}

	];
	$('#am-state').html('<span style="color: #7f8c8d;  font-weight: 200;">'+
		lightv+'</span> : <span style="color: #2980b9;  font-weight: 500;">'+medv+
		'</span> : <span style="color: #2c3e50;  font-weight: 800;">'+highv+'</span>');
	options = {
		//Boolean - Whether we should show a stroke on each segment
		segmentShowStroke : false,
		
		//String - The colour of each segment stroke
		segmentStrokeColor : "#fff",
		
		//Number - The width of each segment stroke
		segmentStrokeWidth : 0,
		
		//Boolean - Whether we should animate the chart	
		animation : true,
		
		//Number - Amount of animation steps
		animationSteps : 100,
		
		//String - Animation easing effect
		animationEasing : "easeOutQuart",
		
		//Boolean - Whether we animate the rotation of the Pie
		animateRotate : false,

		//Boolean - Whether we animate scaling the Pie from the centre
		animateScale : false,
		
		//Function - Will fire on animation completion.
		onAnimationComplete : null
	}
	new Chart(ctx).Doughnut(data,options);
	setTimeout(function(){getActivity(lightv,medv);},updateinterval/3);
}

function getSleepCycles(avg) {
	var ave = Math.max(Math.round(avg+(Math.random()*40-20)),0);
	var min = ave%60;
	var hours = Math.round(ave/60);
	$('#sc').text(hours+":"+(min>9?min:"0"+min));
	$('#sc-panel').removeClass();
	if (ave < 180) {
		$('#sc-panel').addClass('alizarin');
		$('#sc-state').text('Zombie');
	} else if (ave < 240) {
		$('#sc-panel').addClass('wetasphalt');
		$('#sc-state').text('Investment Banker');
	} else if (ave > 540) {
		$('#sc-panel').addClass('greensea');
		$('#sc-state').text('Retired');
	} else if (ave < 360) {
		$('#sc-panel').addClass('asbestos');
		$('#sc-state').text('College Student');
		//orange
	} else if (ave > 480 || ave < 420) {
		$('#sc-panel').addClass('peterriver');
		$('#sc-state').text('Normal');
		//yellow
	} else {
		$('#sc-panel').addClass('wisteria');
		$('#sc-state').text('Optimal');
		//green
	}
	setTimeout(function(){getSleepCycles(ave);},updateinterval);
}


function getBloodGlucose(avg) {
	var ave = Math.max(Math.round(avg+(Math.random()*40-20)),60);
	$('#bg').html(ave);
	$('#bg-panel').removeClass();
	if (ave < 80 || ave > 200) {
		$('#bg-panel').addClass('pomegranate');
		$('#bg-state').text('DANGER');
		//red
	} else if (ave > 180 || ave < 90) {
		$('#bg-panel').addClass('carrot');
		$('#bg-state').text('Borderline');
		//orange
	} else if (ave > 160 || ave < 100) {
		$('#bg-panel').addClass('sunflower');
		$('#bg-state').text('Normal');
		//yellow
	} else {
		$('#bg-panel').addClass('nephritis');
		$('#bg-state').text('Optimal');
		//green
	}
	setTimeout(function(){getBloodGlucose(ave);},updateinterval);
}


function getBloodPressure(avg) {
	var ave = Math.max(Math.round(avg+(Math.random()*10-4)),40);
	$('#bp').html(ave);
	$('#bp-panel').removeClass();
	if (ave < 55 || ave > 110) {
		$('#bp-panel').addClass('pomegranate');
		$('#bp-state').text('DANGER');
		//red
	} else if (ave > 100 || ave < 60) {
		$('#bp-panel').addClass('carrot');
		$('#bp-state').text('Borderline');
		//orange
	} else if (ave > 80) {
		$('#bp-panel').addClass('sunflower');
		$('#bp-state').text('Normal');
		//yellow
	} else {
		$('#bp-panel').addClass('nephritis');
		$('#bp-state').text('Optimal');
		//green
	}
	setTimeout(function(){getBloodPressure(ave);},updateinterval);
}

function getHeartRate(avg) {
	var ave = Math.max(Math.round(avg+(Math.random()*10-5)),40);
	$('#hr').html(ave);
	$('#hr-panel').removeClass();
	if (ave < 60 || ave > 100) {
		$('#hr-panel').addClass('pomegranate');
		$('#hr-state').text('DANGER');
		//red
	} else if (ave > 90 || ave < 72) {
		$('#hr-panel').addClass('carrot');
		$('#hr-state').text('Borderline');
		//orange
	} else if (ave > 80) {
		$('#hr-panel').addClass('sunflower');
		$('#hr-state').text('Normal');
		//yellow
	} else {
		$('#hr-panel').addClass('nephritis');
		$('#hr-state').text('Optimal');
		//green
	}
	setTimeout(function(){getHeartRate(ave);},updateinterval);
}


function getSleep(dates) {
	for (var i in dates) {
		var queryURL = "https://api.humanapi.co/v1/human/sleep/daily/"+
			dates[i]+"?access_token="+accessKey;
		console.log(queryURL);
		var serverSideVals = $.ajax({
			url: queryURL,
			type: "GET",
			dataType: "json",
			async: false
		}).responseJSON;
		console.log(serverSideVals);
	}
}

function getLastNDates(n) {
	var dates = [];
	var date = new Date();
	for (var i = 0; i < lastNdays;i++) {
		dates.push(date.format("yyyy-mm-dd"));
		date.setDate(date.getDate() - 1);
	}
	return dates;
}

// Load the SDK asynchronously
(function(d){
var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
if (d.getElementById(id)) {return;}
js = d.createElement('script'); js.id = id; js.async = true;
js.src = "//connect.facebook.net/en_US/all.js";
ref.parentNode.insertBefore(js, ref);
}(document));
 


function onLogin() {
  $('#login-fb').animate({opacity: 0},500);
  setTimeout(function(){$('#login-fb').find('h3').html('<i class="icon-vcard"></i>Log Out')},500);
  setTimeout(function(){$('#login-fb').animate({opacity: 1},1000)},500);
  $('#login-fb').click(function(){console.log('logout');fblogout(); return false;});
  $('#first').append('<a target="_blank" id="analyze-button" href="./msg.html"><h3 class="cbp-ig-title" style="opacity: 0; margin-top: -300px; border: 1px white solid; border-radius:4px; padding-bottom: 20px;">'+
  	'Find your Bonds</h3></a>');
  setTimeout(function(){$('#analyze-button').find('h3').animate({opacity: 1},2000);},500);

}

function onLogout() {
$('#login-fb').animate({opacity: 0},1000);
  setTimeout(function(){$('#login-fb').find('h3').html('<i class="icon-vcard"></i>Log in with Facebook')},1000);
  setTimeout(function(){$('#login-fb').animate({opacity: 1},1000)},1000);
  $('#login-fb').click(function(){console.log('login');fblogin(); return false;});	
  $('#first').find('#analyze-button').remove();
}

function fblogin() {
FB.login(function(response) {
	onLogin();
}, {scope:'read_mailbox'});
}
function fblogout() {
FB.logout(function(response) {
	onLogout();
});
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : '593762713978577', // App ID
    channelUrl : '//www.debarghyadas.com/', // Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });

	FB.getLoginStatus(function(response) {
		// console.log(response);
		if (response.status === 'connected') {
			onLogin();
		} else {
			onLogout();
		}
	});
     
  // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
  // for any authentication related change, such as login, logout or session refresh. This means that
  // whenever someone who was previously logged out tries to log in again, the correct case below 
  // will be handled. 
  FB.Event.subscribe('auth.authResponseChange', function(response) {
    if (response.status === 'connected') {
    	console.log('connected');
      // testAPI(response.authResponse.accessToken, response.authResponse.userID);
    } else {
    	console.log('out');
      // FB.login();
    }
  });
};
