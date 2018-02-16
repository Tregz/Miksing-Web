/** JavaScript Document
 * Initialize Firebase
 * Created by Jerome Robbins on 18-02-12.
 */

init();
var config = {
    apiKey: "AIzaSyBjNTscuOcDgc3iMVlQ519mS6yC-2V4px0",
    authDomain: "miksing-3bb36.firebaseapp.com",
    databaseURL: "https://miksing-3bb36.firebaseio.com",
    projectId: "miksing-3bb36",
    storageBucket: "miksing-3bb36.appspot.com",
    messagingSenderId: "616604964223" };
var firebaseReady, authReady, dataReady;
var uRef;

var btSignIn, btSignUp, btCancel;
var txCourriel, txPassword;

function auth() { "use strict";
	firebase.initializeApp(config);	// jshint ignore:line
				 
				 
	uRef = firebase.database().ref('users'); // jshint ignore:line 
			 
	// [START authstatelistener]
	firebase.auth().onAuthStateChanged(function(user) { // jshint ignore:line
		if (user) { online(); // User is signed in.
			var name = user.displayName;
        	var mail = user.email;
        	var unid = user.uid; // unique numeric id
        	// optional: user.emailVerified;
        	// optional: user.photoURL;
        	// optional: user.isAnonymous;
        	// optional: user.providerData;
			
			uRef.child(unid).set({name:name,mail:mail});
		
		}
		else { offline(); } // User is signed out
	}); // [END authstatelistener]
}

function init() { "use strict";
	btCancel = document.getElementById('cancel');
	btSignIn = document.getElementById('signIn');
	btSignUp = document.getElementById('signUp');
	btCancel.addEventListener('click', cancel, false);
	btSignIn.addEventListener('click', signIn, false);
	btSignUp.addEventListener('click', signUp, false);
	txCourriel = document.getElementById('courriel');
    txPassword = document.getElementById('password');
				 
	load('https://www.gstatic.com/firebasejs/4.9.1/firebase-app.js');
	load('https://www.gstatic.com/firebasejs/4.9.1/firebase-auth.js');
	load('https://www.gstatic.com/firebasejs/4.9.1/firebase-database.js');
}

function load(src) { "use strict";
	var inserted = false;
	var js = document.createElement('script');
	js.src = src;
	js.onload = js.onreadystatechange = function() {
		if ( !inserted && (!this.readyState || this.readyState === 'complete') ) { inserted = true;
      		if (src==='https://www.gstatic.com/firebasejs/4.9.1/firebase-app.js') { firebaseReady = true; }
			else if (src==='https://www.gstatic.com/firebasejs/4.9.1/firebase-auth.js') { authReady = true; }
			else if (src==='https://www.gstatic.com/firebasejs/4.9.1/firebase-database.js') { dataReady = true; }
			if (firebaseReady && authReady && dataReady) { auth(); } } };
	var script = document.getElementsByTagName('script')[0];
	script.parentNode.insertBefore(js, script);
}

function signIn() { "use strict"; // Sign in with email and pass. 
				   //alert('sign');
	if (firebase.auth().currentUser) { firebase.auth().signOut(); } // jshint ignore:line
    else { var email = txCourriel.value;
		var password = txPassword.value;
    	if (verify(email,password)) {
			firebase.auth().signInWithEmailAndPassword(email, password) // jshint ignore:line
			.catch(function(error) { signWrong(error); }); }
	}
}

function signUp() { "use strict";
	var email = txCourriel.value;
	var password = txPassword.value;
	if (verify(email,password)) {
    	firebase.auth().createUserWithEmailAndPassword(email, password) // jshint ignore:line
			.catch(function(error) { signWrong(error); });
	}
}

function signWrong(error) { "use strict"; 
	var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode==='auth/weak-password') { alert('The password is too weak.'); }
	else if (errorCode === 'auth/wrong-password') { alert('Wrong password.'); }
	else { alert(errorMessage); }
    console.log(error);
}

function verify(courriel, password) { "use strict";
	if (courriel.length < 4) { alert('Please enter an email address.');
      		return false; }
	if (password.length < 4) { alert('Please enter a password.');
      		return false; }
	return true;
}

function offline() { "use strict"; 
	btSignIn.textContent="Sign In";
	btSignUp.style.display='inline';
}

function online() { "use strict"; 
	btSignIn.textContent="Sign out";
	btSignUp.style.display='none';
}

function cancel() { "use strict"; 
	document.getElementById("sign").checked = false;
}


// Database user-infos
/* function userId(courriel) { "use strict";
	//var email = firebase.auth().currentUser.email;
	var ref = firebase.database().ref('users');
	ref.once('value').then(function(snap) {
		snap.forEach(function(snapshot) {
		if (snapshot.child('mail').val()===courriel){
		document.getElementById('name').textContent=snapshot.key; } });
	});
}


/* Validate username
	var ref = firebase.database().ref('users');
	var username = document.getElementById('username').value;
	if (ref.child(username).exists())alert('WTF!');*/