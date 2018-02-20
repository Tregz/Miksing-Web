/** JavaScript Document
 * Cloud authentication and database (JSON)
 * Created by Jerome Robbins on 18-02-12.
 */

init();

var lang; // 0=english, 1=french 
var from = ["by", "par"];
var edit = ["video edit by", "edit vidéo par"];

var btAvatar, btSignIn, btSignUp; // Buttons
var txCourriel, txDrawable, txLocation, txPassword, txUsername; // Text inputs

var drawable; // Avatar number;

// Firebase
var config = {
    apiKey: "AIzaSyBjNTscuOcDgc3iMVlQ519mS6yC-2V4px0",
    authDomain: "miksing-3bb36.firebaseapp.com",
    databaseURL: "https://miksing-3bb36.firebaseio.com",
    projectId: "miksing-3bb36",
    storageBucket: "miksing-3bb36.appspot.com",
    messagingSenderId: "616604964223" };
var firebaseApp, firebaseAuth, firebaseData; // JavaScripts
var firebaseReady, authReady, dataReady; // Booleans
var uUid; // String id of current user
var fRef; // Database reference for all files
var uRef; // Database reference for all users

/* Pro user named Tremenz
 * Database rule : readable for everyone
 * Content is recommended for everyone; */
var uOff = "rlOUlYo89IUDNgzKELT9F0Yg0rg1";

function auth() { "use strict";
	firebase.initializeApp(config);	// jshint ignore:line
	fRef = firebase.database().ref('files'); // jshint ignore:line
	uRef = firebase.database().ref('users'); // jshint ignore:line
	bind(uOff);
	// [START authstatelistener]
	firebase.auth().onAuthStateChanged(function(user) { // jshint ignore:line
		if (user) { // User is signed in.
			btSignIn.textContent="Sign out";
			btSignUp.style.display='none';
			document.getElementById("user").checked = true;
        	uUid = user.uid; // unique id
			// optional: user.email;
		    // optional: user.displayName;
        	// optional: user.emailVerified;
        	// optional: user.photoURL;
        	// optional: user.isAnonymous;
        	// optional: user.providerData;
			uRef.once('value', function(snapshot) {
  				if (!snapshot.hasChild(uUid)) { // New user
					uRef.child(uUid).child("date").set(date());
					uRef.child(uUid).child("mood").child("Undefined").set(true);
					uRef.child(uUid).child("sign").set(user.email);
					uRef.child(uUid).child("type").set(0); } });
			uRef.child(uUid).child("wire").set(true);
			uRef.child(uUid).once('value').then(function(snapshot) {
				if (snapshot.hasChild("name")) {
					var username = snapshot.val().name || 'Anonymous';
					txUsername.value=username; }
				if (snapshot.hasChild("area")) {
					txLocation.value=snapshot.val().area; }
				if (snapshot.hasChild("face")) {
					var face = snapshot.val().face || '0';
					txDrawable.value=snapshot.val().face;
					if (parseInt(face)>=0 && parseInt(face)<10) { drawable = parseInt(face);
						btAvatar.style.display='inline';
						draw(); }
					else { document.getElementById('avatar').data = face;
					btAvatar.style.display='none'; } } });
		} else { btSignIn.textContent="Continue";
			btSignUp.style.display='inline';
			document.getElementById("user").checked = false; } // User is signed out
	}); // [END authstatelistener]
}

function bind(user) { "use strict"; // load user's playlists
	var apero = document.getElementById("content1");
	var bistro = document.getElementById("content2");
	var club = document.getElementById("content3");
	var dance = document.getElementById("content4");
	uRef.child(user).once('value').then(function(snapshot) { // user
		snapshot.child("bind").forEach(function(listSnapshot) { // playlists
			var section = listSnapshot.val().idea; // list's topic
			listSnapshot.child("seed").forEach(function(fileSnapshot) { // listed files
				var uuid = fileSnapshot.key; // Universal Unique Identifier for the file's link
				fRef.child(uuid).once('value').then(function(file) {
					var node = document.createElement("article");
					var aside = document.createElement("aside"); // Hashtags
					aside.setAttribute("class", "hashtags");
					var year = file.val().date.substring(0,4);
					aside.textContent = "#"+listSnapshot.key.toLowerCase()+" #"+year;
					node.appendChild(aside);
					var link = document.createElement("a"); // Listener
					var address = file.val().link;
					var trim = "watch?v=";
					var videoId = address.substring(address.indexOf(trim)+trim.length);
					link.setAttribute("onClick", "mixing('"+videoId+"')");
					var thumbnail = document.createElement("img"); // Thumbbail
					thumbnail.setAttribute("src", "http://img.youtube.com/vi/"+videoId+"/0.jpg");
					thumbnail.setAttribute("class","small");
					thumbnail.setAttribute("alt","YouTube Thumbnail");
					link.appendChild(thumbnail);
					var title = document.createElement("h3");
					title.textContent = file.val().name;
					link.appendChild(title);
					var authors = document.createElement("h4");
					var artists = file.val().auth;
					if (file.hasChild("with")) {
						artists+=" ft "+file.val().with; }
					authors.textContent = artists;
					link.appendChild(authors);
					var version = "";
					if (file.hasChild("kind")) {
						version+=file.val().kind+" "; }
					if (file.hasChild("edit")) {
						version+=from[lang]+" "+file.val().edit; }
					if (file.hasChild("hold")) { if (version!=="") { version+=" "; }
						version+="("+file.val().hold+")"; }
					if (file.hasChild("boot")) { if (version!=="") { version+="; "; }
					uRef.child(file.val().boot).once('value').then(function(vj) {			
						version+=edit[lang]+" "+vj.val().name;
						var editor = document.createTextNode(version);
						link.appendChild(editor); }); }
					else if (version!=="") {
						var editor = document.createTextNode(version);
						link.appendChild(editor); }
					node.appendChild(link);
					 switch(section) { default:
					case 0: case 1: case 3: case 4: apero.appendChild(node);
						break;
					case 2: bistro.appendChild(node);
						break;
					case 7: case 8: case 9: club.appendChild(node);
						break;
					case 5: case 6: dance.appendChild(node);
						break; }
				});
			});
		});
	});
}

function draw() { "use strict";
	document.getElementById('avatar').data = "draw/av_face_"+drawable+".svg";
}

function date() { "use strict";
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date();
  return [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate())].join('-');
}

function fail(error) { "use strict"; 
	var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode==='auth/weak-password') { alert('The password is too weak.'); }
	else if (errorCode === 'auth/wrong-password') { alert('Wrong password.'); }
	else { alert(errorMessage); }
    console.log(error);
}

function good(courriel, password) { "use strict";
	if (courriel.length < 4) { alert('Please enter an email address.');
      		return false; }
	if (password.length < 4) { alert('Please enter a password.');
      		return false; }
	return true;
}

function init() { "use strict";
	var language = document.getElementsByTagName("html")[0].getAttribute("lang");
	if (language==="en") { lang = 0; }
	else if (language==="fr") { lang = 1; }
	btAvatar = document.getElementById('switch');
	btAvatar.addEventListener('click', function() {
		if (drawable!==undefined) { drawable++;
			if (drawable===10) { drawable=0; }
			txDrawable.value = String(drawable);
			draw(); } });
	btSignIn = document.getElementById('signIn');
	btSignIn.addEventListener('click', function() {
		if (firebase.auth().currentUser) { // jshint ignore:line
		uRef.child(uUid).child("wire").set(false);
		firebase.auth().signOut(); } // jshint ignore:line
    else { var email = txCourriel.value;
		var password = txPassword.value;
    	if (good(email,password)) {
			firebase.auth().signInWithEmailAndPassword(email, password) // jshint ignore:line
			.catch(function(error) { fail(error); }); } } });
	btSignUp = document.getElementById('signUp');
	btSignUp.addEventListener('click', function() {
		var email = txCourriel.value;
		var password = txPassword.value;
		if (good(email,password)) {
			firebase.auth().createUserWithEmailAndPassword(email, password) // jshint ignore:line
			.catch(function(error) { fail(error); }); } });
	document.getElementById('cancel').addEventListener('click', function() {					 
		document.getElementById("sign").checked = false; });
	document.getElementById('save').addEventListener('click', function() {
		uRef.child(uUid).child("area").set(txLocation.value);
		uRef.child(uUid).child("face").set(txDrawable.value);
		uRef.child(uUid).child("name").set(txUsername.value); });
	txCourriel = document.getElementById("courriel");
	txDrawable = document.getElementById("drawable");
	txLocation = document.getElementById("location");
	txPassword = document.getElementById("password");
	txUsername = document.getElementById("username");
	
	// Initialize Firebase	 
	firebaseApp = 'https://www.gstatic.com/firebasejs/4.9.1/firebase-app.js';
	firebaseAuth = 'https://www.gstatic.com/firebasejs/4.9.1/firebase-auth.js';
	firebaseData = 'https://www.gstatic.com/firebasejs/4.9.1/firebase-database.js';	
	load(firebaseApp);
	load(firebaseAuth);
	load(firebaseData);
}

function load(src) { "use strict";
	var inserted = false;
	var js = document.createElement('script');
	js.src = src;
	js.onload = js.onreadystatechange = function() {
		if (!inserted && (!this.readyState || this.readyState === 'complete')) { inserted = true;
      		if (src===firebaseApp) { firebaseReady = true; }
			else if (src===firebaseAuth) { authReady = true; }
			else if (src===firebaseData) { dataReady = true; }
			if (firebaseReady && authReady && dataReady) {
				auth(); } } };
	var script = document.getElementsByTagName('script')[0];
	script.parentNode.insertBefore(js, script);
}