/** JavaScript Document
 * Initialize YouTube API
 * Created by Jerome Robbins on 18-02-12.
 */

var /* boolea */ loading, unstart;
var /* intrvl */ cntDown, time_In, timeOut;
var /* number */ fade_In, fadeOut, fadeVal=10, indexAt=0, playing=1, present=0, stopped=2, testing=0, vLength=0;
var /* string */ videoId;
var /* vArray */ iframes;
var /* vArray */ players;
var /* vArray */ playlst=['dIK81cpOXYg','5-q3meXJ6W4','V7t1SToZ-i8','UHElD61QBKY','WkyNf6GBI6M','c8cDM2PN_kY','JG9W2TwDtOM','_fPaBhR21Vw','YB_z0Z3msAQ','AldrdUYHFK4','h1gcPNMC0J4','scMATf60KWI'];

var js = document.createElement('script');
js.src = "https://www.youtube.com/iframe_api";
var script = document.getElementsByTagName('script')[0];
script.parentNode.insertBefore(js, script);

// Insert the iFrame Players
function onYouTubeIframeAPIReady() { "use strict"; // jshint ignore:line
    var player_nul = new YT.Player('player_0', { events: { // jshint ignore:line
		'onReady': function(e){e.target.mute();}, 
		'onStateChange': onTestingStateChange } });
    var player_one = new YT.Player('player_1', { events: { // jshint ignore:line
		'onStateChange': onPlayerStateChange } });
    var player_two = new YT.Player('player_2', { events: { // jshint ignore:line
		'onStateChange': onPlayerStateChange } });
	players = [player_nul,player_one,player_two];								
	iframes = document.getElementsByTagName('iframe');
									
	//ytRequest("https://www.youtube.com/watch?v=GMp-_PeD50A"); //&list=PLqFMT2yxu9RTERhYtFb9si0iURrkDFP7G
}

function onTestingStateChange(yt) { "use strict";
	if (yt.data===YT.PlayerState.BUFFERING) { mixing(videoId); // jshint ignore:line
		players[testing].stopVideo(); }
	else if (yt.data===YT.PlayerState.UNSTARTED) { // jshint ignore:line
		if (unstart) { playNext(); } // when video does not start, it will return to unstart state
		else if (!loading) { unstart=true; } } 
}

function onPlayerStateChange(yt) { "use strict";
	if (loading && yt.data===YT.PlayerState.PLAYING) { // jshint ignore:line
		fade_In=0;
		fadeOut=0;
		clearInterval(time_In);
		time_In=setInterval(fader_In,200);
		setTimeout(delayedFadeOut,700); }
}

function mixing(id) { "use strict";
	loading=true; // stop automix when mixing
	var current = playing; // current player's position in array of players
	playing = stopped; // stopped player will load new video
	stopped = current; // stopping player's position
	players[playing].loadVideoById(id);
}

function playNext() { "use strict";
	if (!loading) { if (playlst===undefined) { /* No video in prepared list; do nothing */ }
		else { indexAt += 1; // next vid's position
			if (playlst.length===indexAt) { indexAt = 0; } // loop index
			videoId=playlst[indexAt];
			players[testing].loadVideoById(videoId); } }
	else { /* Already mixing; do nothing */ }
}

function delayedFadeOut() { "use strict";
	iframes[playing].style.visibility = 'visible';
	iframes[stopped].style.visibility = 'hidden';
	clearInterval(timeOut);
	timeOut=setInterval(faderOut,200);
} // switch players when transition is halfway

function faderOut() { "use strict";
	fadeOut += fadeVal;
	players[stopped].setVolume(100-fadeOut);
	if (fadeOut===100) { loading = false;
		vLength=players[playing].getDuration();
		clearInterval(cntDown);
		cntDown=setInterval(countdown,1000);
		players[stopped].stopVideo();
		clearInterval(timeOut); }
} // fade out current video

function fader_In() { "use strict";
	fade_In+=fadeVal;
	players[playing].setVolume(fade_In);
	if (fade_In===100) { clearInterval(time_In); }
} // fade in new video

function countdown() { "use strict";
	present = players[playing].getCurrentTime();
	if (present>0 && vLength>0 && (vLength-present<10)) {
		vLength=0;
		present=0;
		playNext();
		unstart=false;
		clearInterval(cntDown);
	}
}

function ytRequest(id,list){ "use strict"; // jshint ignore:line
	var request = new XMLHttpRequest();
	var server = "https://www.googleapis.com/youtube/v3/videos?part=snippet&key=";
	if (list) { server = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key="; }
	var apikey = "AIzaSyAfFy6RAXVxVwTZSRsHxr1oUp5recgXYqg";
	var object = "&id=";
	if (list) { object = "&playlistId="; }
    request.open('GET',server+apikey+object+id+"&max-results=50",true);
	request.onreadystatechange = function() { var data;
		if (this.readyState===4 && this.status===200) {
			data = JSON.parse(request.responseText);
			if (list) { /**/ }
			else { document.getElementById("media-details").checked = true;
				document.getElementById("media-save-insert").setAttribute("name", data.items[0].id);
				var channel = "Channel: "+data.items[0].snippet.channelTitle;
				document.getElementById("media-chan").textContent = channel;
				var date = data.items[0].snippet.publishedAt;
				var released = date.substring(0, date.indexOf('T'));
				document.getElementById("media-date-insert").textContent = "Released: "+released;
				document.getElementById("media-date-insert").setAttribute("name", released);
				document.getElementById("media-name-insert").value = data.items[0].snippet.title; } }
		else { data = 'error'; } };
	request.send();
}