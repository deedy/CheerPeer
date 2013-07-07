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

	FB.getLoginStatus(function(response) {
		if (response.status != 'connected') {
			history.back();
		} else {
			testAPI(response.authResponse.accessToken, response.authResponse.userID);
		}
	});
};
     



var userID;
function testAPI(accessToken, uID) {
	userID = uID;
	console.log(accessToken);
	console.log(userID);
	console.log('Welcome!  Fetching your information.... ');
	// Only access 
	var request = '/'+uID+'/inbox?message&access_token='+accessToken;
	console.log(request);
	
	// addRecordsToDom();
	// FB.api(request, function(r) { processResponses(r); sentimentAnalysis(records); });
	FB.api(request, function(r) {
		processResponses(r);
		sentimentAnalysis();
		addRecordsToDom();});
	
}


var records = [];
var yourname;
function processResponses(response) {
	if(response.hasOwnProperty('error')){
		alert('API Limit exceeded');
	}
	console.log(response);
	// Only retrieving the first 25 people to save API calls
	for (var i in response.data.slice(0,6)) {
		var friendname;
		var friendid;
		for (var j in response.data[i].to.data) {
			if (response.data[i].to.data[j].id!=userID) {
				friendname = response.data[i].to.data[j].name;
				friendid = response.data[i].to.data[j].id;
				if (!yourname) 
					break;
			} else {
				yourname = response.data[i].to.data[j].name;
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
			var record = {};
			record.friendname = friendname;
			record.to = to;
			record.from = from;
			record.id = friendid;
			records.push(record);
		}
	}
}
var template;
function addRecordsToDom() {
	if ($('.main').size()==1) {
		$('.main').show();
		template = $('.main').clone();
		$('.main').remove();
	}
	for (var i in records) {
		var template = $(template).clone();
		addRecordToDom(template,records[i].friendname,records[i].from,records[i].to,records[i].id,records[i].fromscore,records[i].toscore)
	}
}

function addRecordToDom(template,sndr,sndrmsg,rcvrmsg,sndrpic,sndrscore,rcvrscore) {
	$(template).find('#sndr-name').text(sndr);
	$(template).find('#rcvr-name').text(yourname);
	$(template).find('#sndr-msg').text(sndrmsg);
	$(template).find('#rcvr-msg').text(rcvrmsg);
	$(template).find('#sndr-img').attr('src','https://graph.facebook.com/'+sndrpic+'/picture');
	$(template).find('#rcvr-img').attr('src','https://graph.facebook.com/'+userID+'/picture');
	$(template).find('#sndr-score').text(Math.round(sndrscore*100));
	$(template).find('#rcvr-score').text(Math.round(rcvrscore*100));
	$('.container').append(template);

}

function quickSentimentalAnalysis(friendname,from,to) {
	var params = {};
	params['friendname'] = friendname;
	params['whathesentyou'] = from;
	params['whatyousenthim'] = to;
	var data = $.ajax({
		url: "./sentiment.php",
		type: "POST",
		data: params,
		dataType: "json",
		async: false
	}).responseJSON;
	console.log(data);
	return data;
}

var alchemykey = '1889ff9ee25d0df8b856e00c42241d99494eff8c';
function sentimentAnalysis() {
	for (var i in records) {
		var params = {};
		console.log(records[i]);
		params['friendname'] = records[i].friendname;
		params['whathesentyou'] = records[i].from;
		params['whatyousenthim'] = records[i].to;
		var data = $.ajax({
			url: "./sentiment.php",
			type: "POST",
			data: params,
			dataType: "json",
			async: false
		}).responseJSON;
		records[i].fromscore = data.from;
		records[i].toscore = data.to;
	}	
	console.log(records);
	records.sort(compareRecords);
	console.log(records);
}

function compareRecords(record1,record2) {
  if (record1.toscore < record2.toscore)
     return 1;
  if (record1.toscore > record2.toscore)
    return -1;
  return 0;
}


