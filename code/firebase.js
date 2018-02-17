/** JavaScript Document
 * Cloud authentication and database (JSON)
 * Created by Jerome Robbins on 18-02-12.
 */

init();

var btSignIn, btSignUp; // Buttons
var txCourriel, txDrawable, txLocation, txPassword, txUsername; // Text inputs

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
var unid; // String id of current user
var uRef; // Database reference for all users

function auth() { "use strict";
	firebase.initializeApp(config);	// jshint ignore:line
	uRef = firebase.database().ref('users'); // jshint ignore:line 
	// [START authstatelistener]
	firebase.auth().onAuthStateChanged(function(user) { // jshint ignore:line
		if (user) { // User is signed in.
			btSignIn.textContent="Sign out";
			btSignUp.style.display='none';
			document.getElementById("user").checked = true;
        	unid = user.uid; // unique numeric id
			// optional: user.email;
		    // optional: user.displayName;
        	// optional: user.emailVerified;
        	// optional: user.photoURL;
        	// optional: user.isAnonymous;
        	// optional: user.providerData;
			uRef.once('value', function(snapshot) {
  				if (!snapshot.hasChild(unid)) { // New user
					uRef.child(unid).child("date").set(date());
					uRef.child(unid).child("mood").child("Undefined").set(true);
					uRef.child(unid).child("sign").set(user.email);
					uRef.child(unid).child("type").set(0); } });
			uRef.child(unid).child("wire").set(true);
			uRef.child(unid).once('value').then(function(snapshot) {
				if (snapshot.hasChild("name")) {
					var username = (snapshot.val().name) || 'Anonymous';
					txUsername.value=username; }
				if (snapshot.hasChild("area")) {
					txLocation.value=snapshot.val().area; }
				if (snapshot.hasChild("face")) {
					txDrawable.value=snapshot.val().face; } });
		} else { btSignIn.textContent="Continue";
			btSignUp.style.display='inline';
			document.getElementById("user").checked = false; } // User is signed out
	}); // [END authstatelistener]
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
	btSignIn = document.getElementById('signIn');
	btSignIn.addEventListener('click', function() {
		if (firebase.auth().currentUser) { // jshint ignore:line
		uRef.child(unid).child("wire").set(false);
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
		uRef.child(unid).child("area").set(txLocation.value);
		uRef.child(unid).child("face").set(txDrawable.value);
		uRef.child(unid).child("name").set(txUsername.value); });
	txCourriel = document.getElementById('courriel');
	txDrawable = document.getElementById("drawable");
	txLocation = document.getElementById("location");
	txPassword = document.getElementById('password');
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
			if (firebaseReady && authReady && dataReady) { auth(); } } };
	var script = document.getElementsByTagName('script')[0];
	script.parentNode.insertBefore(js, script);
}