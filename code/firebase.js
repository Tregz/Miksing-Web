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
var spinner1 = ["Undefined genre", "Genre non-défini"]; // Spinner's default text
var spinner2 = ["All music genres", "Tous genres musicaux"]; // Spinner's default text

// UI for the user's profile: bt=Buttons; tx=Text inputs.
var btSignIn = document.getElementById('signIn');
var btSignUp = document.getElementById('signUp');
var drawable; // Index number in list of svg for the user's avatar.
var txCourriel = document.getElementById("courriel");
var txPassword = document.getElementById("password");
// UI for the controller
var dropdown1 = document.getElementById("dropdown1"); // Spinner of kinds of users
var dropdown2 = document.getElementById("dropdown2"); // Spinner of kinds of playlists
var dropdown3 = document.getElementById("dropdown3"); // Spinner of kinds of medias
var filters1, filters2, filters3; // Index numbers for the spinner's list of kinds
var items1 = document.getElementById('items1');
var items2 = document.getElementById('items2');
var items3 = document.getElementById('items3');
//var list1 = document.getElementById("list1");
//var list2 = document.getElementById("list2");
var list3 = document.getElementById("list3");

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
// Ref for string infos about YouTube music video
var _KEY = 0; // Video id
var AUTH = 1; // Author/Artist/Email
var BEAT = 2; // Producer/DJ/Remixer
var CALL = 3; // Title
var DATE = 4; // Release date YYYY-MM-DD
var EDIT = 5; // Mix version
var FEAT = 6; // Collabs
var GEEK = 7; // Video editor
var HOME = 8; // Label/Bootlegger/User's location
var ICON = 9; // User's image

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
var uRef; // Database reference for all users
var tRef; // Database reference for all videos
/* Readable offline data from pro user named Tremenz.
 * The content is recommended for everyone. */
var uOff = "rlOUlYo89IUDNgzKELT9F0Yg0rg1";
var wired = false;
var pro = false;
var admin = false;
var firebaseApp = 'https://www.gstatic.com/firebasejs/4.9.1/firebase-app.js';
var firebaseAuth = 'https://www.gstatic.com/firebasejs/4.9.1/firebase-auth.js';
var firebaseData = 'https://www.gstatic.com/firebasejs/4.9.1/firebase-database.js';	
load(firebaseApp); // Initialize Google's Firebase 
load(firebaseAuth); // Initialize Firebase's authentication
load(firebaseData); // Initialize Firebase's database

// Appending items from firebase database
function bind(user) { "use strict"; // load user's data
	uRef.child(user).once('value').then(function(snapshot) { // user
		snapshot.child("play").forEach(function(list) { // user's playlists
			var date = "YYYY-MM-DD";
			//if (list.hasChild("chic")) { chic += "Recommended for everyone"; }
			if (list.hasChild("date")) { date = list.val().date.substring(0,4); }
			//if (list.hasChild("idea")) { mood = list.val().idea; }
			var key = user+"-"+list.key;
			var auth = snapshot.val().call;
			var icon = "draw/" + moods[0] + ".svg";
			var data = [key,auth,undefined,list.key,date,undefined,undefined,undefined,undefined,icon];
			var node = card(data,dropdown2,filters2,0,"playlist");
			items2.appendChild(node);
			make(data,0,node.lastChild,"playlist");
		});
	});
}

// Card view model for any item
function card(data,dropdown,filters,idea,tab) { "use strict";
	var node = document.createElement("article");
	node.setAttribute("class", "card-"+tab+"-"+idea);
	var main = document.createElement("div");
	main.setAttribute("class", "card-main");
	node.appendChild(main);
	var aside = document.createElement("aside"); // Hashtags
	aside.setAttribute("class", "hashtags");
	var year = data[DATE].substring(0,4);
	aside.textContent = "#"+topics[idea].toLowerCase()+" #"+year;
	if (!filters.includes(idea)) { filters[filters.length] = idea; }
	node.appendChild(aside);
	/* START: Card's text content */										  
	var link = document.createElement("a");
	var href = "#";
	if (tab==="media") { href = "javascript:mixing('"+data[_KEY]+"')"; } // jshint ignore:line
	link.setAttribute('href', href);
	var frame = document.createElement("div");
	if (tab!=="media") { frame.setAttribute("class","frame"); }
	link.appendChild(frame);
	var face, thumbnail;
	if (parseInt(data[ICON])>=0 && parseInt(data[ICON])<10) {
		if (data[_KEY]===uUid) { drawable = parseInt(data[ICON]); }
		face = "draw/av_face_"+data[ICON]+".svg"; }
	else { face = data[ICON]; }
	if (tab==="user") { thumbnail = document.createElement("object");
		thumbnail.type = "image/svg+xml";
		thumbnail.data = face; }						   
	else { thumbnail = document.createElement("img");
		 thumbnail.src = data[ICON]; }
	thumbnail.alt = "Thumbnail";
	thumbnail.setAttribute("class","small");
	frame.appendChild(thumbnail);
	var title = document.createElement("h3");
	title.textContent = data[CALL];
	link.appendChild(title);
	var subtitle = document.createElement("h4");
	var sub = "", version = "";
	switch(tab) {
		case "media":
			if (data[AUTH]!==undefined) { sub += data[AUTH]; }
			if (data[FEAT]!==undefined) { sub += " ft " + data[FEAT]; }
			if (data[EDIT]!==undefined) { version += data[EDIT]; }
			if (data[BEAT]!==undefined) { 
				if (version!=="") { version += " "; }
				version += from[lang]+" "+data[BEAT]; }
			if (data[HOME]!==undefined) {
				if (version!=="") { version += " "; }
				version += "("+data[HOME]+")"; }
			if (data[GEEK]!==undefined) {
	 			if (version!=="") { version += "; "; }
				version+=post[lang]+" "+data[GEEK]; }
			break;
		case "playlist":
			if (data[AUTH]!==undefined) { sub += "By " + data[AUTH]; }
			break;
		case "user": if (data[HOME]!==undefined) {
				sub += "From " + data[HOME]; }
			version = data[EDIT];
			if (data[_KEY]===uUid && drawable!==undefined) {
				var img = document.createElement("img");
				img.alt = "Arrow Button";
				img.id = "switch";
				img.src = "draw/ic_arrow_end.svg";
				img.addEventListener('click', function() { drawable++;
					if (drawable===10) { drawable=0; }
					var face = document.getElementById(tab+"-icon-"+data[_KEY]);
					face.value = String(drawable);
					thumbnail.data = "draw/av_face_"+drawable+".svg"; });
				node.appendChild(img); }				 
			break; }
	subtitle.textContent = sub;
	link.appendChild(subtitle);					
	link.appendChild(document.createTextNode(version));											 
	main.appendChild(link);
	/* END: Card's text content */
	var menu = document.createElement("aside");
	menu.setAttribute("class","options");
	var pen = document.createElement("embed");
	pen.alt = "Editing icon";
	pen.src = "draw/ic_pen.svg";
	pen.type = "image/svg+xml";
	var editing = document.createElement("div");
	editing.setAttribute("class","media-editing");
	node.appendChild(editing);
	pen.onload = function() { over(editing, pen, tab); };
	pen.setAttribute("class","icon");
	menu.appendChild(pen);
	if (!admin && !pro) { pen.style.height = "0"; }
	main.appendChild(menu);
	return node;
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

// Add item
function item(type) { "use strict"; // jshint ignore:line
	var link = "";
	if (type==="media") { link = document.getElementById('media-link').value; }
	if (link.includes("youtu")) { var trim = "be/";
		var list = link.includes("list=");
		if (list) { trim = "list="; }
		else if (link.includes("watch?v=")) { trim = "watch?v="; }
		var id = link.substring(link.indexOf(trim)+trim.length);
		if (id.includes("?")) { id = id.substring(0, id.indexOf('?')); }
		tRef.once('value', function(tube) { 
			if (tube.hasChild(id)) { alert("YouTube video already listed."); }
			else { ytRequest(id,list); } }); // jshint ignore:line
	} else { alert("Video must be hosted by YouTube."); }			
}

function kill(id, container, tab, update) { "use strict";
	var name, user;
	switch(tab) {
		case "media": tRef.child(id).remove();
			break;
		case "playlist": 
			user = id.substring(0,id.indexOf("-"));
			name = id.replace(user+"-", "");
			uRef.child(user).child("play").child(name).remove();
			break; }
	container.style.height = "0";
	container.style.opacity = "0";
	if (update!==undefined) { 
		switch(tab) {
			case "media": //
				break;
			case "playlist": 
				uRef.child(user).once('value').then(function(snapshot) {
					var date = "YYYY-MM-DD";
					var list = snapshot.child("play").child(update);
					if (list.hasChild("date")) { date = list.val().date.substring(0,4); }
					var key = user+"-"+list.key;
					var auth = snapshot.val().call;
					var icon = "draw/" + moods[0] + ".svg";
					var	data = [key,auth,undefined,list.key,date,undefined,undefined,undefined,undefined,icon];
					var node = card(data,dropdown2,filters2,0,"playlist");
					container.parentNode.parentNode.replaceChild(node, container.parentNode);
					make(data,0,node.lastChild,"playlist"); });
				break; } }
	else { container.parentNode.remove(); }
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
				tRef = firebase.database().ref('tubes'); // jshint ignore:line
				uRef = firebase.database().ref('users'); // jshint ignore:line
				/* [START loginlistener] */
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
				/* [END loginlistener] */
				/* [START authstatelistener] */
				firebase.auth().onAuthStateChanged(function(sign) { // jshint ignore:line
					items1.innerHTML = "";
					items2.innerHTML = "";
					items3.innerHTML = "";
					filters1 = [];
					filters2 = [];
					filters3 = [];
					var insert = document.getElementById("insert");	
					if (sign) { wired = true; /* START signinorup */
						var add = document.createElement("label");
						add.setAttribute("for","new-media");
						var icon = document.createElement("img");
						icon.src = "draw/ic_add.svg";
						icon.setAttribute("class", "icon");
						icon.alt = "Add icon";
						add.appendChild(icon);
						add.appendChild(document.createTextNode("Add media"));
						insert.appendChild(add);
						btSignIn.textContent="Sign out";
						btSignUp.style.display='none';
						//document.getElementById("user").checked = true;
        				uUid = sign.uid; // unique id of current user
						/* optional: user.email, user.displayName, user.emailVerified
        				 * user.photoURL, user.isAnonymous, user.providerData; */
						uRef.child(uUid).once('value').then(function(snap) {
							if (snap.hasChild("kind")) { switch (snap.val().kind) {
								case 1: pro = true;
									break;
								case 2: admin = true;
									break; } } });
						uRef.once('value', function(snapshot) {
  							if (!snapshot.hasChild(uUid)) { // create new user
								uRef.child(uUid).child("date").set(date());
								uRef.child(uUid).child("home").set(user.email);
								uRef.child(uUid).child("kind").set(0); } });
						uRef.child(uUid).child("join").set(true); // onlinse
						uRef.once('value').then(function(users) { // Load data of all users
							users.forEach(function(snap) { user(snap); });
						}); /* [END signinorup] */
					} else { wired = false; /* [START logout] */
						bind(uOff); // Offline data
						insert.innerHTML = "";
						btSignIn.textContent="Continue";
						btSignUp.style.display='inline';
						//document.getElementById("user").checked = false;
						   }
					tRef.once('value').then(function(snapshot) {
						snapshot.forEach(function(file) { tube(file); });
					});
					setTimeout(function() { filters3.sort(function(a, b) { return a-b; });
						/* pick(list1, dropdown1, "item", "-", "user", undefined, spinner2[lang]); // Spinner title
						for (var u = 0; u<filters1.length; u++) {
							pick(list1,dropdown1,"item",filters1[u],"user",undefined,topics[filters1[u]]); }
						pick(list2, dropdown2, "item", "-", "playlist", undefined, spinner2[lang]); // Spinner title
						for (var p = 0; p<filters2.length; p++) {
							pick(list2,dropdown2,"item",filters2[p],"playlist",undefined,topics[filters2[p]]); } */
						pick(list3, dropdown3, "item", "-", "media", undefined, spinner2[lang]); // Spinner title
						for (var m = 0; m<filters3.length; m++) {
							pick(list3,dropdown3,"item",filters3[m],"media",undefined,topics[filters3[m]]); }
						var found = document.getElementById("media-found"); // Insert media section
						make(["insert"],undefined,found,"media"); },2000);
					/* [END logout] */ });
					/* [END authstatelistener] */ } } };
	var script = document.getElementsByTagName('script')[0];
	script.parentNode.insertBefore(js, script);
}

function make(data,mood,node,tab) { "use strict";
	var key = data[_KEY];
	var header = document.createElement("header");
	header.setAttribute("class","controls");
	node.appendChild(header);
	var released = document.createElement("label");
	released.setAttribute("class","infos");
	released.id = tab+"-date-"+key;
	released.textContent = "Released: "+data[DATE];
	released.name = data[DATE];
	header.appendChild(released);
	switch(tab) {
		case "media":
			var dropdown = document.createElement("span");
			header.appendChild(dropdown);
			pick(node,dropdown,key,"-",tab,undefined,spinner1[lang]);
			for (var j = 1; j<topics.length; j++) { 
				pick(node,dropdown,key,j,tab,mood===j,topics[j]); }
			node.appendChild(read(data[CALL],tab+"-call-"+key,"Title","Name"));
			node.appendChild(read(data[AUTH],tab+"-auth-"+key,"Artist","Author"));
			node.appendChild(read(data[FEAT],tab+"-feat-"+key,"Featuring","Collabs"));
			node.appendChild(read(data[EDIT],tab+"-edit-"+key,"Mix","Version"));
			node.appendChild(read(data[BEAT],tab+"-beat-"+key,"DJ","Remixer"));					   
			node.appendChild(read(data[GEEK],tab+"-geek-"+key,"VJ","Videomix"));
			node.appendChild(read(data[HOME],tab+"-home-"+key,"Copyright owner","Label"));
			break;
		case "playlist":
			node.appendChild(read(data[CALL],tab+"-call-"+key,"Title","Name"));
			break;
		case "user":
			node.appendChild(read(data[CALL],tab+"-call-"+key,"Pseudonym","Name"));
			node.appendChild(read(data[HOME],tab+"-home-"+key,"Location","Home"));
			node.appendChild(read(data[ICON],tab+"-icon-"+key,"Avatar","Face"));
			break;  }
	if (tab!=="user" || data[_KEY]===uUid) {
		var button = document.createElement("button");
		button.id = tab+"-save-"+key;
		button.onclick = function() { save(node,key,tab); };
		button.textContent = "Save";
		node.lastChild.appendChild(button);
		if (tab!=="user" && key!=="insert") {
			var remove = document.createElement("button");
			remove.id = tab+"-kill-"+key;
			remove.onclick = function() { kill(key,node,tab,undefined); };
			remove.setAttribute("class","kill");
			remove.textContent = "Trash";
			node.lastChild.appendChild(remove);
		}
	}
}

// Expandable editor for pro users and admins
function over(div, embed, tab) { "use strict";
	var height;
	switch (tab) {
		case "media": height = "390px";
			break;
		case "playlist": height = "100px";
			break;
		case "user": height = "200px";
			break; }
	var clicked = false;
	var svg = embed.getSVGDocument().getElementsByTagName("svg")[0];
	svg.setAttribute("onmouseenter", "evt.target.style.fill='#0c0';");
	svg.setAttribute("onmouseleave", "evt.target.style.fill='#000';");
	svg.onclick = function() { if (clicked) {
			div.style.height = "0";
			div.style.opacity = "0";
			svg.setAttribute("onmouseenter", "evt.target.style.fill='#0c0';");
			svg.setAttribute("onmouseleave", "evt.target.style.fill='#000';"); }
		else { div.style.height = height;
			div.style.opacity = "1";
			svg.setAttribute("onmouseenter", "evt.target.style.fill='#c00';");
			svg.setAttribute("onmouseleave", "evt.target.style.fill='#00c';"); }
	clicked = !clicked; };
}

// Spinner options
function pick(container,dropdown,id,mood,section,selected,text) { "use strict";
	var filter = document.createElement("input");
	filter.setAttribute("id", "input-"+section+"-"+id+"-"+mood);
	filter.setAttribute("name", "filter-"+section+"-"+id);
	filter.setAttribute("class", "input-"+section+"-"+mood);
	filter.setAttribute("type", "radio");
	filter.checked = mood==="-"||selected;
	container.insertBefore(filter, container.childNodes[0]);
	var label = document.createElement("label");
	label.setAttribute("for", "input-"+section+"-"+id+"-"+mood);
	label.setAttribute("class", "label-"+section+"-"+mood);
	label.textContent = text;
	dropdown.appendChild(label);
}

// Editable item details
function read(body, id, placeholder, text) { "use strict";
	var div = document.createElement("div");
	div.setAttribute("class","details");
	var label = document.createElement("label");
	label.textContent = text;
	div.appendChild(label);
	var input = document.createElement("input");
	input.id = id;
	input.maxLength="50";
	input.placeholder = placeholder;
	input.type = "text";
	if (body!==undefined) { input.value = body; }
	div.appendChild(input);
	return div;
}

function save(container, id, tab) { "use strict";
	switch(tab) {
		case "media": var key = id; // editing video's id if not inserting
			if (id==="insert") { // get inserting video's id and exit form
				var insert = document.getElementById(tab+"-save-insert");
				key = insert.getAttribute("name");
				document.getElementById(tab+"-details").checked = false; }
			else { container.style.height = "0"; // exit editing
				container.style.opacity = "0"; }
			var video = tRef.child(key); // database ref to video infos
			// read strings and save			 
			var auth = document.getElementById(tab+"-auth-"+id).value;
			if (auth.length>0) { video.child("auth").set(auth); }
			var beat = document.getElementById(tab+"-beat-"+id).value;
			if (beat.length>0) { video.child("beat").set(beat); }
			var call = document.getElementById(tab+"-call-"+id).value;
			if (call.length>0) { video.child("call").set(call); } 
			if (id==="insert") { // Date is fixed for good when inserted
				var released = document.getElementById(tab+"-date-"+id);
				var date = released.getAttribute("name");
			if (date.length>0) { video.child("date").set(date); } }
			var edit = document.getElementById(tab+"-edit-"+id).value;
			if (edit.length>0) { video.child("edit").set(edit); }
			var feat = document.getElementById(tab+"-feat-"+id).value;
			if (feat.length>0) { video.child("feat").set(feat); }
			var geek = document.getElementById(tab+"-geek-"+id).value;
			if (geek.length>0) { video.child("geek").set(geek); }
			var home = document.getElementById(tab+"-home-"+id).value;
			if (home.length>0) { video.child("home").set(home); } 
			// music's genre from the moods spinner
			var mood = 0, spinner = "filter-"+tab+"-"+id;
			var genres = document.getElementsByName(spinner);
			for (var i = 0; i<genres.length; i++) {
    			if (genres[i].checked) { var code = genres[i].id;
					if (!code.endsWith("-")) { // undefined
					mood = parseInt(code.substr(code.length-1)); } } }
			video.child("mood").set(mood);
			/* [START userplaylist] */
			// create mock playlist with ref to media
			if (id==="insert") { var topic = topics[mood];
				if (topic.includes("-")) { // remove descriptive chars
					topic.substring(0,topic.indexOf("-")); }
				var list = uRef.child(uUid).child("vids").child(topic);
				list.child("kind").set("YouTube"); // only 1 kind, yet
				list.child("seed").child(key).set(true);
			tRef.child(key).once('value').then(function(t) { tube(t); });
			} /* [END userplaylist] */
			break;
		case "playlist":
			var user = id.substring(0,id.indexOf("-"));
			var name = id.replace(user+"-", "");
			var playlist = uRef.child(user).child("play").child(name);
			var rename = document.getElementById(tab+"-call-"+id).value;
			// The data ref is the list's name within the user's data
			if (rename.length>0 && rename!==name) { /* [START moving] */
				var move = uRef.child(user).child("play").child(rename);
				playlist.once('value').then(function(snapshot) {
					if (snapshot.hasChild("date")) {
						move.child("date").set(snapshot.val().date); }
					if (snapshot.hasChild("feed")) { // followers
						snapshot.child("feed").forEach(function(snap) {
							move.child("feed")
								.child(snap.key).set(true); }); }
					/* if (snapshot.hasChild("neat")) {
						move.child("neat").set(snapshot.val().neat); } */
					if (snapshot.hasChild("seed")) {
						snapshot.child("seed").child("tube")
							.forEach(function(snap) { move.child("seed")
							.child("tube").child(snap.key).set(true); });
						kill(id,container,tab,rename); } });
			} /* [END moving] */
			break;
		case "user": 
			var nick = document.getElementById(tab+"-call-"+id).value;
			var area = document.getElementById(tab+"-home-"+id).value;
			var face = document.getElementById(tab+"-icon-"+id).value;
			uRef.child(id).child("call").set(nick); // User's nickname
			uRef.child(id).child("home").set(area); // User's location
			uRef.child(id).child("icon").set(String(face)); // User's drawable
			break; }
}

function tube(file) { "use strict";
	var icon = "http://img.youtube.com/vi/"+file.key+"/0.jpg";
	var auth,beat,call,date="YYYY-MM-DD",edit,feat,geek,home,mood; 
	if (file.hasChild("auth")) { auth = file.val().auth; }				 
	if (file.hasChild("beat")) { beat = file.val().beat; }		 
	if (file.hasChild("call")) { call = file.val().call; }	
	if (file.hasChild("date")) { date = file.val().date; }
	if (file.hasChild("edit")) { edit = file.val().edit; }
	if (file.hasChild("home")) { home = file.val().home; }	 
	if (file.hasChild("feat")) { feat = file.val().feat; }
	if (file.hasChild("mood")) { mood = file.val().mood; }	
	if (file.hasChild("geek") && wired) { // Login required to read from uRef
		uRef.once('value', function(users) { geek = file.val().geek;
			if (users.hasChild(geek)) { geek = (users.child(geek)).val().name; }
			var data = [file.key,auth,beat,call,date,edit,feat,geek,home,icon];
			var node = card(data,dropdown3,filters3,mood,"media");
			items3.appendChild(node);
			make(data,mood,node.lastChild,"media"); });
	} else { var data = [file.key,auth,beat,call,date,edit,feat,geek,home,icon];
		var node = card(data,dropdown3,filters3,mood,"media");
		items3.appendChild(node);
		make(data,mood,node.lastChild,"media"); }
}

function user(snap) { "use strict";
	var online = "";
	if (snap.hasChild("join")) { var join = snap.val().join;
		if (join) { online = "Online"; }
		else { online = "Offline"; } }
	var home = snap.val().home;
	var call = snap.val().call || "";
	var date = snap.val().date || "YYYY-MM-DD"; 
	var icon = snap.val().icon || "0";
	var	data = [snap.key,"#",undefined,call,date,online,undefined,undefined,home,icon];
	var node = card(data,dropdown1,filters1,0,"user");
	/* <div id="map"></div>
	var map = document.createElement("div");
	area(map);
	//node.insertBefore(map,node.childNodes[0]);	 
	var div = document.createElement("div");
	div.style.background = "#ff0";
	div.height = "600px";
	div.width = "400px";
	//div.setAttribute("style","position:relative;");
	//node.appendChild(div);
	//node.insertBefore(div,node.childNodes[0]);
	*/			 
	items1.appendChild(node);
	make(data,0,node.lastChild,"user");
	bind(snap.key);
}