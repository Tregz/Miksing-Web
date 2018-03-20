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
var dropdown1 = document.getElementById("dropdown1"); // Spinner of kinds of users
var dropdown2 = document.getElementById("dropdown2"); // Spinner of kinds of playlists
var dropdown3 = document.getElementById("dropdown3"); // Spinner of kinds of medias
var filters1, filters2, filters3; // Index numbers for the spinner's list of kinds
var items1 = document.getElementById('items1');
var items2 = document.getElementById('items2');
var items3 = document.getElementById('items3');
var list1 = document.getElementById("list1");
var list2 = document.getElementById("list2");
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
var vRef; // Database reference for all videos
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
		snapshot.child("tube").forEach(function(list) { // user's playlists
			var chic = "", kind=0, date = "YYYY-MM-DD";
			if (list.hasChild("chic")) { chic += "Recommended for everyone"; }
			if (list.hasChild("date")) { date = list.val().date.substring(0,4); }
			if (list.hasChild("idea")) { kind = list.val().idea; }
			var nail = "draw/" + moods[kind] + ".svg";
			items2.appendChild(card(dropdown2,nail,filters2,"#",kind,snapshot.val().name,list.key,"playlist",chic,date));
			list.child("seed").forEach(function(snap) { // listed files
				vRef.child("tube").child(snap.key).once('value').then(function(file) { // medias from playlists
					tube(file);
				});
			});
		});
	});
}

// Card view model for any item
function card(dropdown,flag,filters,href,idea,made,name,section,version,year) { "use strict";
	var node = document.createElement("article");
	node.setAttribute("class", "card-"+section+"-"+idea);
	var main = document.createElement("div");
	main.setAttribute("class", "card-main");
	node.appendChild(main);
	var aside = document.createElement("aside"); // Hashtags
	aside.setAttribute("class", "hashtags");
	aside.textContent = "#"+topics[idea].toLowerCase()+" #"+year;
	if (!filters.includes(idea)) { filters[filters.length] = idea; }
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
	link.appendChild(document.createTextNode(version));											 
	main.appendChild(link);
	/* END: Card's text content */
	var menu = document.createElement("aside");
	menu.setAttribute("class","options");
	var pen = document.createElement("embed");
	pen.src = "draw/ic_pen.svg";
	pen.type = "image/svg+xml";
	pen.alt = "Editing icon";
	var editing = document.createElement("div");
	editing.setAttribute("class","media-editing");
	node.appendChild(editing);
	pen.onload = function() { over(editing, pen); };
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

function edit(auth,boot,container,date,feat,home,id,idea,kind,name,prod) { "use strict";
	var header = document.createElement("header");
	header.setAttribute("class","controls");
	container.appendChild(header);
	var released = document.createElement("label");
	released.setAttribute("class","infos");
	released.id = "media-date-"+id;
	released.textContent = "Released: " + date;
	header.appendChild(released);
	var dropdown = document.createElement("span");
	header.appendChild(dropdown);
	pick(container,dropdown,id,"-","media",undefined,spinner1[lang]);
	for (var j = 1; j<topics.length; j++) { var selected = undefined;
		if (idea===j) { selected = true; }
		pick(container,dropdown,id,j,"media",selected,topics[j]); }
	container.appendChild(read("Undefined","media-name-"+id,"name","Title",name));
	container.appendChild(read("Artist","media-author-"+id,"auth","Author",auth));
	container.appendChild(read("Featuring","media-with-"+id,"with","Collabs",feat));
	container.appendChild(read("Mix","media-kind-"+id,"kind","Version",kind));
	container.appendChild(read("DJ","media-edit-"+id,"edit","Remixer",prod));
	container.appendChild(read("VJ","media-boot-"+id,"boot","Videomix",boot));
	container.appendChild(read("Copyright owner","media-home-"+id,"home","Label",home));
	var button = document.createElement("button");
	button.id = "media-save-"+id;
	button.onclick = function() { save(container,id,"media"); };
	button.setAttribute("class","button");
	button.textContent = "Save";
	container.lastChild.appendChild(button);
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
		vRef.child("tube").once('value', function(tube) { 
			if (tube.hasChild(id)) { alert("YouTube video already listed."); }
			else { ytRequest(id); } }); // jshint ignore:line
	} else { alert("Video must be hosted by YouTube."); }			
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
				uRef = firebase.database().ref('users'); // jshint ignore:line
				vRef = firebase.database().ref('video'); // jshint ignore:line
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
					items1.innerHTML = "";
					items2.innerHTML = "";
					items3.innerHTML = "";
					filters1 = [];
					filters2 = [];
					filters3 = [];
					var insert = document.getElementById("insert");
					if (user) { wired = true; /* START signinorup */
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
								btAvatar.style.display='none'; } }
							if (snapshot.hasChild("type")) { switch (snapshot.val().type) {
									case 1: pro = true;
										break;
									case 2: admin = true;
										break; } } });
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
								items1.appendChild(card(dropdown1,nail,filters1,"#",idea,made,name,"user",edit,year));
								bind(snap.key); });
						}); /* END signinorup */
					} else { wired = false; /* START logout */
						bind(uOff); // Offline data
						insert.innerHTML = "";
						btSignIn.textContent="Continue";
						btSignUp.style.display='inline';
						document.getElementById("user").checked = false; }
					setTimeout(function() { filters3.sort(function(a, b) { return a-b; });
						pick(list1, dropdown1, "item", "-", "user", undefined, spinner2[lang]); // Spinner title
						for (var u = 0; u<filters1.length; u++) {
							pick(list1,dropdown1,"item",filters1[u],"user",undefined,topics[filters1[u]]); }
						pick(list2, dropdown2, "item", "-", "playlist", undefined, spinner2[lang]); // Spinner title
						for (var p = 0; p<filters2.length; p++) {
							pick(list2,dropdown2,"item",filters2[p],"playlist",undefined,topics[filters2[p]]); }
						pick(list3, dropdown3, "item", "-", "media", undefined, spinner2[lang]); // Spinner title
						for (var m = 0; m<filters3.length; m++) {
							pick(list3,dropdown3,"item",filters3[m],"media",undefined,topics[filters3[m]]); }
						var found = document.getElementById("media-found"); // Insert media section
						edit(undefined,undefined,found,undefined,undefined,undefined,"insert",undefined,undefined,undefined,undefined); },1000);
					/* END logout */ });
					/* [END authstatelistener] */ } } };
	var script = document.getElementsByTagName('script')[0];
	script.parentNode.insertBefore(js, script);
}

// Expandable editor for pro users and admins
function over(div, embed) { "use strict";
	var clicked = false;
	var svg = embed.getSVGDocument().getElementsByTagName("svg")[0];
	svg.setAttribute("onmouseenter", "evt.target.style.fill='#0c0';");
	svg.setAttribute("onmouseleave", "evt.target.style.fill='#000';");
	svg.onclick = function() { if (clicked) {
			div.style.height = "0";
			div.style.opacity = "0";
			svg.setAttribute("onmouseenter", "evt.target.style.fill='#0c0';");
			svg.setAttribute("onmouseleave", "evt.target.style.fill='#000';"); }
		else { div.style.height = "400px";
			div.style.opacity = "1";
			svg.setAttribute("onmouseenter", "evt.target.style.fill='#c00';");
			svg.setAttribute("onmouseleave", "evt.target.style.fill='#00c';"); }
	clicked = !clicked; };
}

// Spinner options
function pick(container,dropdown,id,idea,section,selected,text) { "use strict";
	var filter = document.createElement("input");
	filter.setAttribute("id", "input-"+section+"-"+id+"-"+idea);
	filter.setAttribute("name", "filter-"+section+"-"+id);
	filter.setAttribute("class", "input-"+section+"-"+idea);
	filter.setAttribute("type", "radio");
	if (idea==="-"||selected!==undefined) { filter.checked = true; }
	container.insertBefore(filter, container.childNodes[0]);
	var label = document.createElement("label");
	label.setAttribute("for", "input-"+section+"-"+id+"-"+idea);
	label.setAttribute("class", "label-"+section+"-"+idea);
	label.textContent = text;
	dropdown.appendChild(label);
}

// Editable item details
function read(hint,id,name,text,val) { "use strict";
	var div = document.createElement("div");
	div.setAttribute("class","details");
	var label = document.createElement("label");
	label.textContent = text;
	div.appendChild(label);
	var input = document.createElement("input");
	input.id = id;
	input.maxLength="50";
	input.name = name;
	input.placeholder = hint;
	input.type = "text";
	if (val!==undefined) { input.value = val; }
	div.appendChild(input);
	return div;
}

function save(container, id, type) { "use strict"; // jshint ignore:line
	if (type==="media") { var key = id;
		if (id!=="insert") { container.style.height = "0";
			container.style.opacity = "0"; }
		else { key = document.getElementById("media-save-insert").getAttribute("name");
			document.getElementById("media-details").checked = false; }
		var video = vRef.child("tube").child(key);
		var auth = document.getElementById("media-author-"+id).value;
		if (auth.length>0) { video.child("auth").set(auth); }
		var boot = document.getElementById("media-boot-"+id).value;
		if (boot.length>0) { video.child("boot").set(boot); }
		video.child("chic").set(false);
		if (id==="insert") { // Date is fixed for good when inserted
		var date = document.getElementById("media-date-"+id).getAttribute("name");
		if (date.length>0) { video.child("date").set(date); } }
		var edit = document.getElementById("media-edit-"+id).value;
		if (edit.length>0) { video.child("edit").set(edit); }
		var home = document.getElementById("media-home-"+id).value;
		if (home.length>0) { video.child("home").set(home); } 
		var idea = 0; // Item's topic from the ideas spinner
		var genres = document.getElementsByName("filter-media-"+id);
		for (var i = 0; i<genres.length; i++) {
    		if (genres[i].checked) { var code = genres[i].id;
				if (!code.endsWith("-")) {
					idea = parseInt(code.substr(code.length - 1)); } } }
		video.child("idea").set(idea); 
		var kind = document.getElementById("media-kind-"+id).value;
		if (kind.length>0) { video.child("kind").set(kind); }
		var name = document.getElementById("media-name-"+id).value;
		if (name.length>0) { video.child("name").set(name); } 
		var feat = document.getElementById("media-with-"+id).value;
		if (feat.length>0) { video.child("with").set(feat); }
		var topic = topics[idea];
		if (topic.includes("-")) { topic.substring(0,topic.indexOf("-")); }
		uRef.child(uUid).child("tube").child(topic).child("seed").child(key).set(true);
		if (id==="insert") { vRef.child("tube").child(key).once('value').then(function(file) {
			tube(file); });
		}
	}
}

function tube(file) { "use strict";
	var flag = "http://img.youtube.com/vi/"+file.key+"/0.jpg";
	var href = "javascript:mixing('"+file.key+"')"; // jshint ignore:line
	var idea = 0, name = "", node;
	/* var chic: recommended */
	var auth, feat, made = "";
	if (file.hasChild("auth")) { auth = file.val().auth;
		made = auth;
		if (file.hasChild("with")) { feat = file.val().with;
			made += " ft " + feat; } }
	var date = "YYYY-MM-DD", year = "YYYY";
	if (file.hasChild("date")) { date = file.val().date;
		year = date.substring(0,4); }
	if (file.hasChild("idea")) { idea = file.val().idea; }
	if (file.hasChild("name")) { name = file.val().name; }
	/* START: file version infos followed by cardview creation */
	var boot, kind, prod, version = "";
	if (file.hasChild("kind")) { kind = file.val().kind;
		version += kind; }
	if (file.hasChild("edit")) { prod = file.val().edit;
	if (version!=="") { version += " "; }
		version += from[lang]+" "+prod; }
	var home;
	if (file.hasChild("home")) { home = file.val().home;
	if (version!=="") { version += " "; }
		version += "("+file.val().home+")"; }
	if (file.hasChild("boot") && wired) { // Login required to read from uRef
		if (version!=="") { version += "; "; }
		uRef.once('value', function(users) { 
			if (users.hasChild(file.val().boot)) {
				boot = (users.child(file.val().boot)).val().name; 
				version+=post[lang]+" "+boot; }
			else { boot = file.val().boot;
				version+=post[lang]+" "+file.val().boot; }
		node = card(dropdown3,flag,filters3,href,idea,made,name,"media",version,year);
		items3.appendChild(node);
		edit(auth,boot,node.lastChild,date,feat,home,file.key,idea,kind,name,prod); });
	} else { node = card(dropdown3,flag,filters3,href,idea,made,name,"media",version,year);
		items3.appendChild(node);
		edit(auth,boot,node.lastChild,date,feat,home,file.key,idea,kind,name,prod); }
	/* END: file version infos followed by cardview creation */
}