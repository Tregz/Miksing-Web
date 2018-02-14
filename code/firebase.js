// JavaScript Document
	
// Initialize Firebase

var firebase;

var config = {
    apiKey: "AIzaSyBjNTscuOcDgc3iMVlQ519mS6yC-2V4px0",
    authDomain: "miksing-3bb36.firebaseapp.com",
    databaseURL: "https://miksing-3bb36.firebaseio.com",
    projectId: "miksing-3bb36",
    storageBucket: "miksing-3bb36.appspot.com",
    messagingSenderId: "616604964223"
};
firebase.initializeApp(config);	

var courriel;
var usersRef = firebase.database().ref('users');
	
window.onload = function() { "use strict";
	document.getElementById('sign-in')
		.addEventListener('click', signIn, false);
    document.getElementById('sign-up')
		.addEventListener('click', signUp, false);
	document.getElementById('validate')
		.addEventListener('click', signValidate, false);
    document.getElementById('canceler')
		.addEventListener('click', signCancel, false);
};
	
// Sign-in button press
function signIn() { "use strict";
	if (firebase.auth().currentUser) { // [START signout]
        firebase.auth().signOut(); } // [END signout]
    else { var email = document.getElementById('courriel').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) { alert('Please enter an email address.');
          return; }
        if (password.length < 4) { alert('Please enter a password.');
          return; }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password)
			.then(function(firebaseUser) {
			
			
			courriel=email; userId();
			
		document.getElementById('name').textContent=snapshot.key;
			
			
   		}).catch(function(error) { // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.'); }
		  else { alert(errorMessage); }
          console.log(error);
          document.getElementById('sign-in').disabled = false; // [END_EXCLUDE]
        }); // [END authwithemail]
	} document.getElementById('sign-in').disabled = true;
}
	
// Sign-up button press
function signUp() { "use strict";
	//document.getElementById('username').style.display='block';
	document.getElementById('validate').style.display='inline';
	document.getElementById('canceler').style.display='inline';
	document.getElementById('sign-up').style.display='none';
	document.getElementById('sign-in').style.display='none';
}

function signValidate() { "use strict";
	var email = document.getElementById('courriel').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) { alert('Please enter an email address.');
      return; }
    if (password.length < 4) { alert('Please enter a password.');
      return; }
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password)
		.then(function(firebaseUser) { usersRef
			.child(firebase.auth().currentUser.uid)
			.set({name:user,mail:email});
   		}).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/weak-password') {
          alert('The password is too weak.'); }
		else { alert(errorMessage); }
        console.log(error); // [END_EXCLUDE]
	}); // [END createwithemail]
}

function signCancel() { "use strict";
	document.getElementById('validate').style.display='none';
	document.getElementById('canceler').style.display='none';
	document.getElementById('sign-up').style.display='inline';
	document.getElementById('sign-in').style.display='inline';
}

// Database user-infos
function userId() { "use strict";
	//var email = firebase.auth().currentUser.email;
	var ref = firebase.database().ref('users');
	ref.once('value').then(function(snap) {
		snap.forEach(function(snapshot) {
		if (snapshot.child('mail').val() === courriel){
		document.getElementById('name').textContent=snapshot.key;
	}})});
}


/* Validate username
	var ref = firebase.database().ref('users');
	var username = document.getElementById('username').value;
	if (ref.child(username).exists())alert('WTF!');*/