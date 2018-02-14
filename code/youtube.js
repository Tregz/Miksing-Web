/** JavaScript Document
 * Created by Jerome Robbins on 18-02-12.
 */ /*jshint unused:false*/

var /* boolea */ loading, skipped, unstart;
var /* intrvl */ cntDown, time_In, timeOut;
var /* number */ fade_In, fadeOut, fadeVal=10, indexAt=0, playing=1, present=0, stopped=2, testing=0, vLength=0;
var /* string */ videoId;
var /* vArray */ iframes;
var /* vArray */ players;
var /* vArray */ playlst=['dIK81cpOXYg','5-q3meXJ6W4','V7t1SToZ-i8','UHElD61QBKY','WkyNf6GBI6M','c8cDM2PN_kY','JG9W2TwDtOM','_fPaBhR21Vw','YB_z0Z3msAQ','AldrdUYHFK4','h1gcPNMC0J4','scMATf60KWI'];

var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Insert the iFrame Players
function onYouTubeIframeAPIReady() { "use strict";
    var player_nul = new YT.Player('player_0', { events: { 'onReady': function(e){e.target.mute();}, 'onStateChange': onTestingStateChange } });
    var player_one = new YT.Player('player_1', { events: { 'onStateChange': onPlayerStateChange } });
    var player_two = new YT.Player('player_2', { events: { 'onStateChange': onPlayerStateChange } });
	players = [player_nul,player_one,player_two];								
	iframes = document.getElementsByTagName('iframe');
}

function onTestingStateChange(yt) { "use strict";
	if (yt.data===YT.PlayerState.BUFFERING) { mixing(videoId);
		players[testing].stopVideo(); }
	else if (yt.data===YT.PlayerState.UNSTARTED) { 
		if (unstart) { playNext(); }
		else if (!loading) { unstart=true; } } 
}

function onPlayerStateChange(yt) { "use strict";
	if (loading && yt.data===YT.PlayerState.PLAYING) {
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