/** JavaScript Document
 * Cloud authentication and database (JSON)
 * Created by Jerome Robbins on 18-02-12.
 */

// i18n
var lang; // 0=english, 1=french
var language = document.getElementsByTagName("html")[0].getAttribute("lang");
if (language==="en") { lang = 0; }
else if (language==="fr") { lang = 1; }
var from = ["by", "par"]; // Audio remixer
var post = ["video edit by", "edit vidéo par"]; // When video was re-edited in post-prod
var spin = ["All music genres", "Tous genres musicaux"]; // Spinner's default text

// UI for the user's profile: bt=Buttons; ob=SVG Objects; tx=Text inputs.
var btAvatar = document.getElementById('switch');
var btSignIn = document.getElementById('signIn');
var btSignUp = document.getElementById('signUp');
var obAvatar = document.getElementById('avatar'); // User's avatar.
var drawable; // Index number in list of svg for the user's avatar.
var txCourriel = document.getElementById("courriel");
var txDrawable = document.getElementById("drawable");
var txLocation = document.getElementById("location");
var txPassword = document.getElementById("password");
var txUsername = document.getElementById("username");
// UI for the controller
var controller = document.getElementById('controller');
var tab1 = document.getElementById("section1"); // Users
var tab2 = document.getElementById("section2"); // Playlists
var tab3 = document.getElementById("section3"); // Medias
var dropdown1 = document.getElementById("dropdown1"); // Spinner of kinds of users
var dropdown2 = document.getElementById("dropdown2"); // Spinner of kinds of playlists
var dropdown3 = document.getElementById("dropdown3"); // Spinner of kinds of medias
var filters1, filters2, filters3; // Index numbers for the spinner's list of kinds
var content1 = document.getElementById('content1');
var content2 = document.getElementById('content2');
var content3 = document.getElementById('content3');
var topics = /*0*/ ["Undefined",
			 /*1*/ "Apero-Soft",
             /*2*/ "Bistro-Rock",
             /*3*/ "Caribbean-Latin",
             /*4*/ "Deep-Groove",
             /*5*/ "Electro-House",
             /*6*/ "Funk-Disco",
             /*7*/ "Gangsta-Rap",
             /*8*/ "Hot-Trendy",
             /*9*/ "Indie"];
var moods = [ // Icons for topics
			/*0*/ "ic_playlist",
            /*1*/ "ic_ambiance",
            /*2*/ "ic_power",
            /*3*/ "ic_beach",
            /*4*/ "ic_deep",
            /*5*/ "ic_charged",
            /*6*/ "ic_disco",
            /*7*/ "ic_urban",
            /*8*/ "ic_radio",
            /*9*/ "ic_mysterious"];

// Firebase
var config = {
    apiKey: "AIzaSyBjNTscuOcDgc3iMVlQ519mS6yC-2V4px0",
    authDomain: "miksing-3bb36.firebaseapp.com",
    databaseURL: "https://miksing-3bb36.firebaseio.com",
    projectId: "miksing-3bb36",
    storageBucket: "miksing-3bb36.appspot.com",
    messagingSenderId: "616604964223" };
var firebaseReady, authReady, dataReady; // Booleans
var uUid; // String id of current user
var fRef; // Database reference for all files
var uRef; // Database reference for all users
/* Readable offline data from pro user named Tremenz.
 * The content is recommended for everyone. */
var uOff = "rlOUlYo89IUDNgzKELT9F0Yg0rg1";
var firebaseApp = 'https://www.gstatic.com/firebasejs/4.9.1/firebase-app.js';
var firebaseAuth = 'https://www.gstatic.com/firebasejs/4.9.1/firebase-auth.js';
var firebaseData = 'https://www.gstatic.com/firebasejs/4.9.1/firebase-database.js';	
load(firebaseApp); // Initialize Google's Firebase 
load(firebaseAuth); // Initialize Firebase's authentication
load(firebaseData); // Initialize Firebase's database

// Appending items from firebase database
function bind(user) { "use strict"; // load user's data
	uRef.child(user).once('value').then(function(snapshot) { // user
		snapshot.child("bind").forEach(function(list) { // user's playlists
			var chic = "", kind=0, date;
			if (list.hasChild("chic")) { chic += "Recommended for everyone"; }
			if (list.hasChild("date")) { date = list.val().date.substring(0,4); }
			if (list.hasChild("idea")) { kind = list.val().idea; }
			var nail = "draw/" + moods[kind] + ".svg";
			card(dropdown2,chic,nail,filters2,"#",kind,snapshot.val().name,list.key,"playlist",content2,date);
			list.child("seed").forEach(function(snap) { // listed files
				// snap.key: Universal Unique Identifier for the file's link
				fRef.child(snap.key).once('value').then(function(file) { // medias from playlists
					var edit = "", idea, link, made, name, type, year;
					/* var chic: recommended */
					if (file.hasChild("auth")) { made = file.val().auth;
						if (file.hasChild("with")) { made += " ft " + file.val().with; } }
					if (file.hasChild("date")) { year = file.val().date.substring(0,4); }
					if (file.hasChild("idea")) { idea = file.val().idea; }
					if (file.hasChild("link")) { link = file.val().link; }
					var trim = "watch?v=";
					var videoId = link.substring(link.indexOf(trim)+trim.length);
					var flag = "http://img.youtube.com/vi/"+videoId+"/0.jpg";
					var href = "javascript:mixing('"+videoId+"')"; // jshint ignore:line
					if (file.hasChild("name")) { name = file.val().name; }
					if (file.hasChild("type")) { type = file.val().type; }
					/* START: file version infos followed by cardview creation */
					if (file.hasChild("kind")) { edit+=file.val().kind; }
					if (file.hasChild("edit")) { if (edit!=="") { edit+=" "; }
						edit+=from[lang]+" "+file.val().edit; }
					if (file.hasChild("hold")) { if (edit!=="") { edit+=" "; }
						edit+="("+file.val().hold+")"; }
					if (file.hasChild("boot")) { if (edit!=="") { edit+="; "; }
						uRef.child(file.val().boot).once('value').then(function(vj) {			
							edit+=post[lang]+" "+vj.val().name;
							card(dropdown3,edit,flag,filters3,href,idea,made,name,"media",content3,year); });
					} else { card(dropdown3,edit,flag,filters3,href,idea,made,name,"media",content3,year); }
					/* END: file version infos followed by cardview creation */
				});
			});
		});
	});
}

// Card view model for any item
function card(dropdown,edit,flag,filters,href,idea,made,name,section,tab,year) { "use strict";
	var node = document.createElement("article");
	node.setAttribute("class", "card-"+section+"-"+idea);
	var aside = document.createElement("aside"); // Hashtags
	aside.setAttribute("class", "hashtags");
	aside.textContent = "#"+topics[idea].toLowerCase()+" #"+year;
	if (!filters.includes(idea)) { filters[filters.length] = idea;
		var filter = document.createElement("input");
		filter.setAttribute("id", "card-"+section+"-"+idea);
		filter.setAttribute("name", "filter"+section);
		filter.setAttribute("class", "filter");
		filter.setAttribute("type", "radio");
		controller.insertBefore(filter, controller.childNodes[1]);
		var label = document.createElement("label");
		label.setAttribute("for", "card-"+section+"-"+idea);
		label.textContent = topics[idea];
		dropdown.appendChild(label); }
	node.appendChild(aside);
	/* START: Card's text content */										  
	var link = document.createElement("a");
	link.setAttribute('href', href);
	var thumbnail = document.createElement("img");
	thumbnail.setAttribute("src", flag);
	thumbnail.setAttribute("class","small");
	thumbnail.setAttribute("alt","Thumbnail");
	link.appendChild(thumbnail);
	var title = document.createElement("h3");
	title.textContent = name;
	link.appendChild(title);				 
	var authors = document.createElement("h4");
	authors.textContent = made;
	link.appendChild(authors);					
	link.appendChild(document.createTextNode(edit));											 
	node.appendChild(link);
	/* END: Card's text content */
	tab.appendChild(node);
}

// Format to YYYY-MM-DD
function date() { "use strict";
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date();
  return [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate())].join('-');
}

// Login errors alerts
function fail(error) { "use strict"; 
	var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode==='auth/weak-password') { alert('The password is too weak.'); }
	else if (errorCode === 'auth/wrong-password') { alert('Wrong password.'); }
	else { alert(errorMessage); }
    console.log(error);
}

// Login inputs validation
function good(courriel, password) { "use strict";
	if (courriel.length < 4) {
		alert('Please enter an email address.');
      	return false; }
	if (password.length < 4) {
		alert('Please enter a password.');
      	return false; }
	return true;
}

function head(content, dropdown, header, section) { "use strict";
	dropdown.innerHTML = "";
	var everything = document.createElement("label");
	everything.setAttribute("class","default");
	everything.setAttribute("for","deselected"+section);
	everything.textContent = spin[lang];
	dropdown.appendChild(everything);
	var none = document.createElement("input");
	none.setAttribute("name", "filter"+section);
	none.setAttribute("id", "deselected"+section);
	none.setAttribute("type", "radio");
	content.appendChild(none);
}

// Firebase initialization and user authentication
function load(src) { "use strict";
	var inserted = false;
	var js = document.createElement('script');
	js.src = src;
	js.onload = js.onreadystatechange = function() {
		if (!inserted && (!this.readyState || this.readyState==='complete')) {
			inserted = true;
			if (src===firebaseApp) { firebaseReady = true; }
			else if (src===firebaseAuth) { authReady = true; }
			else if (src===firebaseData) { dataReady = true; }
			if (firebaseReady && authReady && dataReady) { // Scripts loaded
				firebase.initializeApp(config);	// jshint ignore:line
				fRef = firebase.database().ref('files'); // jshint ignore:line
				uRef = firebase.database().ref('users'); // jshint ignore:line
				/* [START currentuserlistener] */
				btAvatar.addEventListener('click', function() {
				if (drawable!==undefined) { drawable++;
					if (drawable===10) { drawable=0; }
					txDrawable.value = String(drawable);
					obAvatar.data = "draw/av_face_"+drawable+".svg"; } });
				btSignIn.addEventListener('click', function() {
					if (firebase.auth().currentUser) { // jshint ignore:line
						uRef.child(uUid).child("wire").set(false);
						firebase.auth().signOut(); } // jshint ignore:line
    				else { var email = txCourriel.value;
						var password = txPassword.value;
    					if (good(email,password)) { firebase.auth() // jshint ignore:line
							.signInWithEmailAndPassword(email, password)
							.catch(function(error) { fail(error); }); } } });
				btSignUp.addEventListener('click', function() {
					var email = txCourriel.value;
					var password = txPassword.value;
					if (good(email,password)) { firebase.auth() // jshint ignore:line
						.createUserWithEmailAndPassword(email, password)
						.catch(function(error) { fail(error); }); } });
				document.getElementById('cancel').addEventListener('click', function() {					 
					document.getElementById("sign").checked = false; });
				document.getElementById('save').addEventListener('click', function() {
					uRef.child(uUid).child("area").set(txLocation.value);
					uRef.child(uUid).child("face").set(txDrawable.value);
					uRef.child(uUid).child("name").set(txUsername.value); });
				/* [END currentuserlistener] */
				/* [START authstatelistener] */
				firebase.auth().onAuthStateChanged(function(user) { // jshint ignore:line
					content1.innerHTML = "";
					content2.innerHTML = "";
					content3.innerHTML = "";
					filters1 = [];
					filters2 = [];
					filters3 = [];
					var header1 = document.getElementById("header1");
					var header2 = document.getElementById("header2");
					var header3 = document.getElementById("header3");
					head(tab1, dropdown1, header1, "user");		// Header for users tab
					head(tab2, dropdown2, header2, "playlist"); // Heaser for playlists tab
					head(tab3, dropdown3, header3, "media");	// Header for medias tab
					if (user) { /* START signinorup */
						btSignIn.textContent="Sign out";
						btSignUp.style.display='none';
						document.getElementById("user").checked = true;
        				uUid = user.uid; // unique id of current user
						/* optional: user.email, user.displayName, user.emailVerified
        				 * user.photoURL, user.isAnonymous, user.providerData; */
						uRef.once('value', function(snapshot) {
  							if (!snapshot.hasChild(uUid)) { // Create new user
								uRef.child(uUid).child("date").set(date());
								uRef.child(uUid).child("mood").child("Undefined").set(true);
								uRef.child(uUid).child("sign").set(user.email);
								uRef.child(uUid).child("type").set(0); } });
						uRef.child(uUid).child("wire").set(true);
						/* [START currentuserprofile */
						uRef.child(uUid).once('value').then(function(snapshot) {
							if (snapshot.hasChild("name")) {
								var username = snapshot.val().name || 'Anonymous';
								txUsername.value=username; }
							if (snapshot.hasChild("area")) {
								txLocation.value=snapshot.val().area; }
							if (snapshot.hasChild("face")) {
								var face = snapshot.val().face || '0';
								txDrawable.value=snapshot.val().face;
								if (parseInt(face)>=0 && parseInt(face)<10) {
									drawable = parseInt(face);
									btAvatar.style.display='inline';
									obAvatar.data = "draw/av_face_"+drawable+".svg"; }
								else { document.getElementById('avatar').data = face;
								btAvatar.style.display='none'; } } });
						/* [END currentuserprofile */
						uRef.once('value').then(function(users) { // Load data of all users
							users.forEach(function(snap) {
								var edit = "", face = "0", idea = 0, made = "", nail, name = "", year;
								if (snap.hasChild("wire")) { var wire = snap.val().wire;
									if (wire) { edit = "Online"; }
									else { edit = "Offline"; } }
								if (snap.hasChild("face")) { face = snap.val().face; }
								if (snap.hasChild("area")) { made = snap.val().area; }
								if (snap.hasChild("name")) { name = snap.val().name; }
								if (snap.hasChild("date")) { year = snap.val().date.substring(0,4); }
								if (parseInt(face)>=0 && parseInt(face)<10) {
									nail = "draw/av_face_"+face+".svg"; }
								else { nail = face; }	
								card(dropdown1,edit,nail,filters1,"#",idea,made,name,"user",content1,year);								
								bind(snap.key); });
						}); /* END signinorup */
					} else { /* START logout */
						bind(uOff); // Offline data
						btSignIn.textContent="Continue";
						btSignUp.style.display='inline';
						document.getElementById("user").checked = false; } /* END logout */ });
					/* [END authstatelistener] */ } } };
	var script = document.getElementsByTagName('script')[0];
	script.parentNode.insertBefore(js, script);
}