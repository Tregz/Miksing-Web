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
var plus = ["Insert", "Insérer"]; // Audio remixer
var post = ["video edit by", "edit vidéo par"]; // When video was re-edited in post-prod
var spinner1 = ["Undefined genre", "Genre non-défini"]; // Spinner's default text
var spinner2 = ["All music genres", "Tous genres musicaux"]; // Spinner's default text
var spinner3 = ["All users", "Tous les utilisateurs"]; // Spinner's default text

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
var filters1, filters2, // selected item's list
	filters3; // Index numbers for the spinner's list of kinds
var items1 = document.getElementById('items1');
var items2 = document.getElementById('items2');
var items3 = document.getElementById('items3');
var list1 = document.getElementById("list1");
//var list2 = document.getElementById("list2");
var list3 = document.getElementById("list3");
var page = "media"; // Current tab
var pages = ["user","playlist","media"];
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
var kinds = [spinner3[lang],"Pros","Admins"];
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

// Ref for position in item's data array
// Strings
var _KEY = 0;  // Item id
var AUTH = 1;  // Media's author/ User's authentication email
var BORN = 2;  // Media's release date / User's anniversary
var CALL = 3;  // User's name / Media's title
var DATE = 4;  // Registration date YYYY-MM-DD
var EDIT = 5;  // Media's mix version / User's gender
var FEAT = 6;  // Media's collabs
var GEEK = 7;  // Video's editor
var HOME = 8;  // User's location / Media's label
var ICON = 9;  // Item's image
var JOCK = 10; // Media's producer/DJ/remixer
// Integers
var KIND = 11; // Access rules
var LANG = 12; // Language
var MOOD = 13; // Music's main genre
var NICE = 14;
// Booleans
var OMNI = 15;
var PLUG = 16;
// Arrays
var QUID = 17;
var ROOM = 18;
var SEED = 19; 

// Firebase
var config = {
    apiKey: "AIzaSyBjNTscuOcDgc3iMVlQ519mS6yC-2V4px0",
    authDomain: "miksing-3bb36.firebaseapp.com",
    databaseURL: "https://miksing-3bb36.firebaseio.com",
    projectId: "miksing-3bb36",
    storageBucket: "miksing-3bb36.appspot.com",
    messagingSenderId: "616604964223" };
var firebaseReady, authReady, dataReady, storageReady; // Booleans
var tRef; // Database reference for all videos
var uRef; // Database reference for all users
var uUid; // String id of current user
/* Readable offline data from pro user named Tremenz.
 * The content is recommended for everyone. */
var wired = false;
var pro, admin;
var firebasejs = 'https://www.gstatic.com/firebasejs/4.9.1/firebase-';
var firebaseApp = firebasejs+'app.js';
var firebaseAuth = firebasejs+'auth.js';
var firebaseData = firebasejs+'database.js';	
var firebaseStock = firebasejs+'storage.js';
load(firebaseApp); // Initialize Google's Firebase 
load(firebaseAuth); // Initialize Firebase's authentication
load(firebaseData); // Initialize Firebase's database
load(firebaseStock); // Initialize Firebase's storage
var storageRef;

function arch() { "use strict";
	var head = document.createElement("header");
	var left = document.createElement("div");
	var main = document.createElement("div");
	var side = document.createElement("div");
	head.setAttribute("class","details");
	left.setAttribute("class","left");
	main.setAttribute("class","main");
	side.setAttribute("class","side");
	head.appendChild(left);
	head.appendChild(main);
	head.appendChild(side);
	return [head,left,main,side];
}

// Medias of playlist
function bill(div, embed, id, tab) { "use strict";
	div.setAttribute("class","editing");
	embed.alt = "Insert into list";
	embed.src = "draw/ic_insert.svg";
	var rows;						
	uRef.child(uUid).once('value').then(function(current) { switch(tab) {
		case "media": if (current.hasChild("seed")) {
			current.child("seed").forEach(function(snap) {
				var box = document.createElement("input");
				box.type = "checkbox";
				box.setAttribute("class","selection");
				var channel = uRef.child(uUid).child("seed")
					.child(snap.key).child("seed").child("tube");
				channel.once('value').then(function(chan) {
					if (chan.hasChild(id)) { box.checked = true; }
					box.addEventListener( 'change', function() {
						if(this.checked) { channel.child(id).set(true); }
						else { channel.child(id).remove(); } }); });
				var list = document.createTextNode(snap.val().call);
				var head = arch();
				head[2].appendChild(box);
				head[2].appendChild(list);
				div.appendChild(head[0]);	 });
				rows = current.child("seed").numChildren();
				embed.onload = function() { edit(div,embed,rows,tab); }; }
			break;
		case "playlist":
			var maker = id.substring(0,id.indexOf("-"));
			var title = id.replace(maker+"-", "");
			if (!current.hasChild("seed") || (current.hasChild("seed") &&
				!current.child("seed").hasChild(title))) { 
				uRef.child(maker).child("seed").child(title)
					.child("seed").child("tube").once('value').then(function(seed) {
					rows = seed.numChildren();
					seed.forEach(function(snap) {
						tRef.child(snap.key).once('value').then(function(t) {
							var link = document.createElement("div");
							link.onmouseover = link.style.cursor = "pointer";
							link.textContent = t.val().call + " ";
							var head = arch();
							head[2].appendChild(link);
							div.appendChild(head[0]); }); });
					embed.onload = function() {
						edit(div,embed,rows,tab); }; });
			} else { embed.style.display = "none"; }
			break; } });
}

// Card view model for any item
function card(data,dropdown,filters,idea,tab) { "use strict";
	var node = document.createElement("article");
	node.setAttribute("class", "card-"+tab+"-"+idea);
	var aside = document.createElement("aside"); // Hashtags
	aside.setAttribute("class", "hashtags");
	var year = data[DATE].substring(0,4);
	if (tab==="media" && !filters.includes(idea)) { 
		filters[filters.length] = idea; }
	switch(tab) {
		case "media": var topic = topics[idea].toLowerCase();
			aside.textContent = "#"+topic+" #"+year;
			break;
		case "playlist": aside.textContent = "#"+year;
			break;
		case "user": var tag = "";
			if (idea>0) { tag = "#"+kinds[idea].toLowerCase()+" "; } 
			aside.textContent = tag+"#"+year;
			break; }
	var main = document.createElement("div");
	main.setAttribute("class", "card-main");  
	var frame = document.createElement("div");		   
	var thumbnail = document.createElement("img");
	thumbnail.alt = "Thumbnail";			   
	thumbnail.setAttribute("class","small");
	thumbnail.id = tab+"-icon-"+data[_KEY];
	switch(tab) {
		case "media": frame.setAttribute("class","frame media");
			thumbnail.src = data[ICON];
			break;
		case "playlist": frame.setAttribute("class","frame playlist");
			thumbnail.src = "draw/" + moods[data[ICON]] + ".svg";
			break;
		case "user": frame.setAttribute("class","frame user");
			if (parseInt(data[ICON])>=0 && parseInt(data[ICON])<10) {
			if (data[_KEY]===uUid) { drawable = parseInt(data[ICON]); }
				thumbnail.src = "draw/av_face_"+data[ICON]+".svg"; }
			else { thumbnail.src = data[ICON]; }
			break; }
	/* START: Card's text content */   
	var content = document.createElement("div");
	content.setAttribute("class", "content");  
	var link;
	switch(tab) {
		case "media":
			link = document.createElement("a");
			link.href = "javascript:mixing('"+data[_KEY]+"');"; // jshint ignore:line
			break;
		case "playlist":
			link = document.createElement("div");
			link.onmouseover = link.style.cursor = "pointer";
			link.onclick = function() { filters2 = [];
				var items = document.getElementById("items3");
				for (var i=0; i<data[SEED].length; i++) {
					filters2[filters2.length] = data[SEED][i]; }
				document.getElementById("tab3").checked = true;
				wake(pages[2]); 
				items.insertBefore(nail(data[CALL],2),items.childNodes[0]); };
			break;
		case "user": 
			link = document.createElement("div");
			link.onmouseover = link.style.cursor = "pointer";
			link.onclick = function() { filters1 = [];
				var items = document.getElementById("items2");
				for (var i=0; i<data[SEED].length; i++) {
					filters1[filters1.length] = data[SEED][i]; }
				if (filters1.length>0) {
					document.getElementById("tab2").checked = true;
					wake(pages[1]); 
					items.insertBefore(nail(data[CALL],1),items.childNodes[0]);
				} else { alert("User does not have any playlist"); } };
			break; }
	link.setAttribute("class","card-link");
	var title = document.createElement("h3");
	title.textContent = data[CALL];
	var subtitle = document.createElement("h4");
	var sub = "", version = "";
	var map, gradient;
	switch(tab) {
		case "media":
			if (data[AUTH]!==undefined) { sub += data[AUTH]; }
			if (data[FEAT]!==undefined) { sub += " ft " + data[FEAT]; }
			if (data[EDIT]!==undefined) { version += data[EDIT]; }
			if (data[JOCK]!==undefined) { 
				if (version!=="") { version += " "; }
				version += from[lang]+" "+data[JOCK]; }
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
		case "user":
			if (data[HOME]!==undefined) {
				sub += "From " + data[HOME]; }
			/* START: backgroundmap */
			if (data[HOME]!==undefined && data[HOME]!=="") {
				map = document.createElement("div");
				gradient = document.createElement("div");
				map.setAttribute("class","map");
				gradient.setAttribute("class","linear-opacity");
				area(data[HOME],map,items3.clientWidth); // jshint ignore:line
				content.appendChild(map);
				content.appendChild(gradient);
			} /* END: backgroundmap */
			version = data[PLUG];
			break; }
	subtitle.textContent = sub;
	/* END: Card's text content */
	var menu = document.createElement("aside");
	menu.setAttribute("class","options");
	var pen = document.createElement("embed");
	pen.alt = "Editing icon";
	pen.src = "draw/ic_pen.svg";
	pen.type = "image/svg+xml";
	var editing = document.createElement("div");
	editing.setAttribute("class","editing");
	pen.onload = function() { edit(editing, pen, undefined, tab); };
	pen.setAttribute("class","icon");
	var play, next;
	var inserting = document.createElement("div");
	var insert = document.createElement("embed");				   
	if (tab!=="user") {
		next = document.createElement("embed");
		next.alt = "Play next icon";
		next.src = "draw/ic_queue.svg"; }	   
	switch(tab) {
		case "media":
			play = document.createElement("embed");
			play.alt = "Play icon";
			play.src = "draw/ic_play.svg";
			play.type = "image/svg+xml";
			play.onload = function() { over(play).onclick = function() {
				mixing(data[_KEY]); }; }; // jshint ignore:line
			if (!admin && !pro) { pen.style.height = "0"; }
			if (wired) { bill(inserting, insert, data[_KEY], tab); }
			next.onload = function() { over(next,false).onclick = function() {
				playlst[playlst.length] = data[_KEY]; // jshint ignore:line
				join(); }; };
			menu.appendChild(play);	
			menu.appendChild(next);	
			break;
		case "playlist": 
			if (!admin && data[_KEY].substring(0,data[_KEY].indexOf("-"))!==uUid) {
				pen.style.height = "0";	}
			if (wired) { bill(inserting, insert, data[_KEY], tab); }
			next.onload = function() { over(next,false).onclick = function() {
				data[SEED].forEach( function(item) {
					playlst[playlst.length] = item; }); // jshint ignore:line
				join(); }; };
			menu.appendChild(next);
			break;
		case "user": if (uUid!==data[_KEY] && !admin) { pen.style.height = "0"; }
			break; }
	node.appendChild(main);
	/**/ main.appendChild(frame);
	/*--*/ frame.appendChild(thumbnail);			   
	/**/ main.appendChild(content);
	/*--*/ content.appendChild(link);
	/*----*/ link.appendChild(title);
	/*----*/ link.appendChild(subtitle);
	/*----*/ link.appendChild(document.createTextNode(version));					   
	node.appendChild(aside);
	/**/ main.appendChild(menu);
	/*--*/ menu.appendChild(pen);
	/*--*/ menu.appendChild(insert); 
	node.appendChild(inserting);
	node.appendChild(editing);
	return node;
}

// Format to YYYY-MM-DD
function date() { "use strict";
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date();
  return [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate())].join('-');
}

// Expandable editor for pro users and admins
function edit(div, embed, rows, tab) { "use strict";
	var height;
	if (rows!==undefined) {	height = String((rows*30)+10)+"px"; }
	else switch (tab) {
		case "media": height = "390px";
			break;
		case "playlist": height = "100px";
			break;
		case "user": height = "200px";
			break; }
	var clicked = false;
	over(embed,false).onclick = function() { if (clicked) {
			div.style.height = "0";
			div.style.opacity = "0";
			over(embed,false); }
		else { div.style.height = height;
			div.style.opacity = "1";
			over(embed,true); }
	clicked = !clicked; };
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

// Collapsed form for new items
function hide(page) { "use strict";
	var add = document.createElement("label");
	add.setAttribute("for","new-"+page);
	var icon = document.createElement("img");
	if (page==="media") { icon.src = "draw/ic_youtube_search.svg"; }
	else { icon.src = "draw/ic_add.svg"; }
	icon.setAttribute("class", "icon");
	icon.alt = "Add icon";
	add.appendChild(icon);
	add.appendChild(document.createTextNode(plus[lang]));
	document.getElementById("insert-"+page).appendChild(add);
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
			
function join() { "use strict";
	var prepare = document.getElementById("prepare");
	prepare.innerHTML = "";
	playlst.forEach(function(media) { // jshint ignore:line
	var head = arch();
	tRef.child(media).once('value').then(function(t) {
		tube(t, function(data) { head[2].textContent = data[CALL]; }); });
	prepare.appendChild(head[0]); });
}

// Remove or update item
function kill(id, container, tab, update) { "use strict";
	var maker, title;
	switch(tab) {
		case "media": /**/
			break;
		case "playlist": 
			maker = id.substring(0,id.indexOf("-"));
			title = id.replace(maker+"-", "");
			//uRef.child(maker).child("seed").child(title).remove();
			break;
		case "user": /**/
			break; }
	container.style.height = "0";
	container.style.opacity = "0";
	if (update!==undefined) { var data, node;
		switch(tab) {
			case "media": tRef.child(id).once('value').then(function(t) { tube(t, function(data) {
					var node = card(data,dropdown3,filters3,data[MOOD],"media");
					container.parentNode.parentNode.replaceChild(node,container.parentNode);
					make(data,data[MOOD],node.lastChild,"media"); }); });
				break;
			case "playlist": 
				uRef.child(maker).once('value').then(function(snapshot) {
					var list = snapshot.child("seed").child(update);
					var auth = snapshot.val().call;
					data = vibe(list,maker,auth);					
					node = card(data,dropdown2,undefined,0,tab);
					container.parentNode.parentNode.replaceChild(node,container.parentNode);
					make(data,0,node.lastChild,tab); });
				break;
			case "user":
				uRef.child(id).once('value').then(function(snapshot) {
					data = user(snapshot);
					node = card(data,dropdown1,undefined,0,"user");
					container.parentNode.parentNode.replaceChild(node,container.parentNode);
					make(data,0,node.lastChild,tab); });
				break; } }
	else { switch(tab) {
		case "media": tRef.child(id).remove();
			break;
		case "playlist": /**/
			break;
		case "user": uRef.child(id).remove();
			var auth = firebase.auth().currentUser;	// jshint ignore:line
			auth.delete().then(function() { /* User deleted. */ })
				.catch(function(error) { alert("An error happened."); }); // jshint ignore:line
			break; }
		container.parentNode.remove(); }
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
			else if (src===firebaseStock) { storageReady = true; }
			if (firebaseReady && authReady && dataReady && storageReady) { // Scripts loaded
				firebase.initializeApp(config);	// jshint ignore:line
				/* [START animatedlogo] */
				storageRef = firebase.storage().ref(); // jshint ignore:line
				var file = "Miksing_Logo-Animated";
				var video = document.getElementsByTagName('video')[0];
				var source1 = document.createElement("source");
				source1.type = "video/mp4";
				var source2 = document.createElement("source");
				source2.type = "video/webm";
				storageRef.child("anim/"+file+".mp4")
					.getDownloadURL().then(function(url){
					source1.src = url; }).then(function(){
				storageRef.child("anim/"+file+".webm")
					.getDownloadURL().then(function(url){
					source2.src = url;
					video.appendChild(source1);
					video.appendChild(source2);
    				video.load();
					video.play(); }); });
				video.style.height = "auto";
				video.style.opacity = "1";
				/* [END animatedlogo] */
				tRef = firebase.database().ref('tubes'); // jshint ignore:line
				uRef = firebase.database().ref('users'); // jshint ignore:line
				/* [START loginlistener] */
				btSignIn.addEventListener('click', function() {
					if (firebase.auth().currentUser) { // jshint ignore:line
						uRef.child(uUid).child("plug").set(false);
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
					// reset access authorisations
					admin = false;
					pro = false;
					// reset current data
					dropdown1.innerHTML = ""; // user types
					dropdown2.innerHTML = ""; // unused.
					dropdown3.innerHTML = ""; // menu item: topic spinners
					filters1 = []; // selected users
					filters2 = []; // selected playlists
					filters3 = []; // media topics from list of items
					items1.innerHTML = ""; // users
					items2.innerHTML = ""; // playlists
					items3.innerHTML = ""; // medias
					if (sign) { wired = true; /* START signinorup */
						hide("media");
						hide("playlist");
						var found = document.getElementById("media-found"); // Insert media section
						make(["insert"],undefined,found,"media");
						var add = document.getElementById("add-playlist"); // Insert media section
						make(["insert"],undefined,add,"playlist");
						btSignIn.textContent="Sign out";
						btSignUp.style.display='none';
						//document.getElementById("user").checked = true;
        				uUid = sign.uid; // unique id of current user
						/* optional: user.email, user.displayName, user.emailVerified
        				 * user.photoURL, user.isAnonymous, user.providerData; */
						uRef.once('value').then(function(users) { // Load data of all users
							if (!users.hasChild(uUid)) { // create new user
								uRef.child(uUid).child("auth").set(sign.email);
								uRef.child(uUid).child("date").set(date());
								uRef.child(uUid).child("kind").set(0); } }).then(function() {
							uRef.child(uUid).child("plug").set(true); // online
							uRef.child(uUid).once('value').then(function(snap) {
								if (snap.hasChild("kind")) { switch (snap.val().kind) {
									case 1: pro = true; // current user is pro
										break;
									case 2: admin = true; // current user is admin
										break; } } }).then(function() { wake(page); });
						}); /* [END signinorup] */
					} else { wired = false; /* [START logout] */
						btSignIn.textContent="Continue";
						btSignUp.style.display='inline';
						/* remove menu items: add playlist/media */
						document.getElementById("insert-playlist").innerHTML = "";
						document.getElementById("insert-media").innerHTML = "";
						/* Set current user to pro user Tremenz
						 * who has readable data for unregistered user */
						uUid = "rlOUlYo89IUDNgzKELT9F0Yg0rg1";
						wake(page); }
					/* [END logout] */ });
				/* [END authstatelistener] */
				/* [START pagelistener] */
				var input1 = document.getElementById("tab1");
				var input2 = document.getElementById("tab2");
				var input3 = document.getElementById("tab3");
				input1.addEventListener( 'change', function() {
					if(this.checked) { page = "user";
						wake(page); } });
				input2.addEventListener( 'change', function() {
					if(this.checked) { page = "playlist";
						wake(page); } });
				input3.addEventListener( 'change', function() {
    				if(this.checked) { page = "media";
						wake(page); } });
				/* [END pagelistener] */ } } };
	var script = document.getElementsByTagName('script')[0];
	script.parentNode.insertBefore(js, script);
}

function make(data,mood,node,tab) { "use strict";
	var id = data[_KEY], key = data[_KEY];
	var header = document.createElement("header");
	header.setAttribute("class","controls");
	var since;
	switch (tab) {
		case "media": since = ["Released: ", "Publication: "];
			node.appendChild(header);
			break;
		case "playlist": break;
		case "user": since = ["Registered: ", "Inscription: "];
			node.appendChild(header);
			break; }
	if (tab!=="playlist") {
	var released = document.createElement("label");
	released.setAttribute("class","infos");
	released.id = tab+"-date-"+key;
	released.textContent = since[lang]+data[DATE];
	released.name = data[DATE];
	header.style.marginBottom = "10px";
	header.appendChild(released); }
	var rows = [];
	switch(tab) {
		case "media":
			var dropdown = document.createElement("span");
			header.appendChild(dropdown);
			pick(node,dropdown,key,"-",tab,undefined,spinner1[lang]);
			for (var j = 1; j<topics.length; j++) { 
				pick(node,dropdown,key,j,tab,mood===j,topics[j]); }
			rows[0] = read(data[CALL],tab+"-call-"+key,"Name","Title");
			rows[1] = read(data[AUTH],tab+"-auth-"+key,"Author","Artist");
			rows[2] = read(data[FEAT],tab+"-feat-"+key,"Collabs","Featuring");
			rows[3] = read(data[EDIT],tab+"-edit-"+key,"Version","Mix");
			rows[4] = read(data[JOCK],tab+"-jock-"+key,"Remixer","DJ");
			rows[5] = read(data[GEEK],tab+"-geek-"+key,"Videomix","VJ");
			rows[6] = read(data[HOME],tab+"-home-"+key,"Label","Copyright owner");
			break;
		case "playlist":
			id = data[_KEY].substring(0,data[_KEY].indexOf("-"));
			rows[0] = read(data[CALL],tab+"-call-"+key,"Name","Title");
			if (key!=="insert") {
			rows[1] = read(data[ICON],tab+"-mood-"+key,"Image","Thumbnail");
			if (admin || id===uUid) { var arrow = document.createElement("img");
				arrow.alt = "Arrow Button";
				arrow.setAttribute("class","switch");
				arrow.src = "draw/ic_arrow_end.svg";
				arrow.addEventListener('click', function() { data[ICON]++;
					if (data[ICON]===10) {data[ICON]=0; }
					var mood = document.getElementById(tab+"-mood-"+data[_KEY]);
					mood.value = data[ICON];
					var icon = document.getElementById(tab+"-icon-"+data[_KEY]);
					icon.src = "draw/" + moods[data[ICON]] + ".svg"; });
				rows[1].appendChild(arrow); } }
			break;
		case "user":
			rows[0] = read(data[CALL],tab+"-call-"+key,"Name","Pseudonym");
			rows[1] = read(data[HOME],tab+"-home-"+key,"Home","Location");
			rows[2] = read(data[ICON],tab+"-face-"+key,"Face","Avatar");
			if (admin || data[_KEY]===uUid && drawable!==undefined) {
				var img = document.createElement("img");
				img.alt = "Arrow Button";
				img.setAttribute("class","switch");
				img.src = "draw/ic_arrow_end.svg";
				img.addEventListener('click', function() { drawable++;
					if (drawable===10) { drawable=0; }
					var face = document.getElementById(tab+"-face-"+data[_KEY]);
					face.value = String(drawable);
					var icon = document.getElementById(tab+"-icon-"+data[_KEY]);
					icon.src = "draw/av_face_"+drawable+".svg"; });
				rows[2].appendChild(img); }
			break;  }
	if (key!=="insert" && (admin || id===uUid)) {
		var remove = document.createElement("button");
		remove.id = tab+"-kill-"+key;
		remove.onclick = function() { kill(key,node,tab,undefined); };
		remove.setAttribute("class","kill");
		remove.textContent = "Trash";
		rows[rows.length-2].appendChild(remove); }
	if (key==="insert" || admin || id===uUid) {
		var update = document.createElement("button");
		update.id = tab+"-save-"+key;
		update.onclick = function() { save(node,key,tab); };
		update.textContent = "Save";
		rows[rows.length-1].appendChild(update); }			   
	for (var i=0; i<rows.length; i++) { node.appendChild(rows[i]); }						   
}

function nail(name,tab) { "use strict";
	var include = document.createElement("label");
	include.textContent = name;	
	var start = document.createElement("div");
	start.setAttribute("class","selection left");
	start.appendChild(include);
									   
	var space = document.createElement("div");
	space.setAttribute("class","main");
				
	var checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.setAttribute("class","selection");
	checkbox.checked = true;
	checkbox.addEventListener( 'change', function() {
    if(!this.checked) {
		switch (pages[tab]) {
			case "media": filters2 = [];
				break;
			case "playlist": filters1 = [];
				break;
			case "user": //
				break; }
		wake(pages[tab]); } });	
	var label = document.createElement("label");
	checkbox.setAttribute("class","selection");
	label.textContent = name;	
	var right = document.createElement("div");
	right.setAttribute("class","selection right");
	right.appendChild(checkbox);
	right.appendChild(label);
									   
	var enthusiast = document.createElement("header");
	enthusiast.setAttribute("class","controls");
	//enthusiast.appendChild(start);
	enthusiast.appendChild(space);
	enthusiast.appendChild(right);
	return enthusiast;
}

// Fill color of embeded svg
function over(embed,exit) { "use strict";
	var enter = "#0c0";
	var leave = "#000";
	if (exit) { 
		enter = "#c00";
		leave = "#00c"; }				   
	var svg = embed.getSVGDocument().getElementsByTagName("svg")[0];
	svg.setAttribute("onmouseenter", "evt.target.style.fill='"+enter+"';");
	svg.setAttribute("onmouseleave", "evt.target.style.fill='"+leave+"';");
	return svg;
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
function read(content, id, name, placeholder) { "use strict";
	var div = document.createElement("div");
	div.setAttribute("class","details");
	var label = document.createElement("label");
	label.textContent = name;
	div.appendChild(label);
	var input = document.createElement("input");
	input.id = id;
	input.maxLength="50";
	input.placeholder = placeholder;
	input.type = "text";
	if (content!==undefined) { input.value = content; }
	div.appendChild(input);
	return div;
}

function save(container, id, tab) { "use strict";
	var call, key;
	switch(tab) {
		case "media": key = id; // editing video's id if not inserting
			if (id==="insert") { // get inserting video's id and exit form
				var insert = document.getElementById(tab+"-save-insert");
				key = insert.getAttribute("name");
				document.getElementById("new-"+tab).checked = false;
				document.getElementById(tab+"-details").checked = false; }
			else { container.style.height = "0"; // exit editing
				container.style.opacity = "0"; }
			var video = tRef.child(key); // database ref to video infos
			// read strings and save			 
			var auth = document.getElementById(tab+"-auth-"+id).value;
			if (auth.length>0) { video.child("auth").set(auth); }
			call = document.getElementById(tab+"-call-"+id).value;
			if (call.length>0) { video.child("call").set(call); } 
			if (id==="insert") { // Date is fixed for good when inserted
				var released = document.getElementById(tab+"-date-"+id);
				var calendar = released.getAttribute("name");
			if (calendar.length>0) { video.child("date").set(calendar); } }
			var edit = document.getElementById(tab+"-edit-"+id).value;
			if (edit.length>0) { video.child("edit").set(edit); }
			var feat = document.getElementById(tab+"-feat-"+id).value;
			if (feat.length>0) { video.child("feat").set(feat); }
			var geek = document.getElementById(tab+"-geek-"+id).value;
			if (geek.length>0) { video.child("geek").set(geek); }
			var home = document.getElementById(tab+"-home-"+id).value;
			if (home.length>0) { video.child("home").set(home); }
			var jock = document.getElementById(tab+"-jock-"+id).value;
			if (jock.length>0) { video.child("jock").set(jock); }
			// music's genre from the moods spinner
			var mood = 0, spinner = "filter-"+tab+"-"+id;
			var genres = document.getElementsByName(spinner);
			for (var i = 0; i<genres.length; i++) {
    			if (genres[i].checked) { var code = genres[i].id;
					if (!code.endsWith("-")) { // undefined
					mood = parseInt(code.substr(code.length-1)); } } }
			video.child("mood").set(mood);
			/* [START userplaylist] */ // mock playlist with ref to media
			if (id==="insert") { var topic = topics[mood];
				if (topic.includes("-")) { // remove descriptive chars
					topic.substring(0,topic.indexOf("-")); }
				var list = uRef.child(uUid).child("seed").child(topic);
				list.child("kind").set("YouTube"); // only 1 kind, yet
				list.child("seed").child(key).set(true);
				/* [END userplaylist] */
				tRef.child(key).once('value').then(function(t) { tube(t, function(data) { 
					var node = card(data,dropdown3,filters3,data[MOOD],"media");
					items3.appendChild(node);
					make(data,data[MOOD],node.lastChild,"media"); }); });
			} else { kill(key,container,tab,"update"); }
			break;
		case "playlist": var user;
			call = document.getElementById(tab+"-call-"+id).value;
			if (id==="insert") { user = uUid;
				key = uRef.child(user).child("seed").push().key;
				document.getElementById("new-"+tab).checked = false; }
			else { user = id.substring(0,id.indexOf("-"));
				key = id.replace(user+"-", "");
				container.style.height = "0"; // exit editing
				container.style.opacity = "0"; }
			var playlist = uRef.child(user).child("seed").child(key);
			if (id==="insert") { var username;
				playlist.child("call").set(call);
				playlist.child("date").set(date());
				uRef.child(uUid).once('value').then(function(snap) {
					username = snap.val().call; }).then(function() {
					playlist.once('value').then(function(list) {
						var data = vibe(list,user,username);
						var node = card(data,dropdown2,undefined,0,"playlist");
						items2.appendChild(node);
						make(data,0,node.lastChild,"playlist"); }); }); }
			else { var name, rename = false; 
				playlist.once('value').then(function(snap) { 
					name = snap.val().call;
					alert(call+" "+name);
					if (call!==name) { rename = true;
						playlist.child("call").set(call); }
					var icon = "0", image = document.getElementById(tab+"-mood-"+id);
					if (id!=="insert") { icon = image.value; }
					playlist.child("icon").set(icon);
					if (rename) { kill(id,container,tab,key); } }); }
			break;
		case "user": 
			container.style.height = "0"; // exit editing
			container.style.opacity = "0";
			var nick = document.getElementById(tab+"-call-"+id).value;
			var area = document.getElementById(tab+"-home-"+id).value;
			var face = document.getElementById(tab+"-face-"+id).value;
			uRef.child(id).child("call").set(nick); // User's nickname
			uRef.child(id).child("home").set(area); // User's location
			uRef.child(id).child("icon").set(String(face)); // User's drawable
			kill(id,container,tab,"update");
			break; }
}

// YouTube video infos from database
function tube(snap, callback) { "use strict";
	var data = [snap.key];
	data[AUTH] = snap.val().auth;
	data[CALL] = snap.val().call;
	data[DATE] = snap.val().date || "YYYY-MM-DD";
	data[EDIT] = snap.val().edit;
	data[FEAT] = snap.val().feat;
	data[HOME] = snap.val().home;
	data[ICON] = "http://img.youtube.com/vi/"+snap.key+"/0.jpg";
	data[JOCK] = snap.val().jock;
	data[MOOD] = snap.val().mood || 0;
	if (snap.hasChild("geek") && wired) { // Login required to read from uRef
		uRef.once('value', function(users) { 
			data[GEEK] = snap.val().geek;
			if (users.hasChild(data[GEEK])) { 
				data[GEEK] = (users.child(data[GEEK])).val().call; }
			callback(data); });
	} else { callback(data); }
}

// Users infos from database
function user(snap) { "use strict";
	var data = [snap.key];
	data[CALL] = snap.val().call || "";
	data[DATE] = snap.val().date || "YYYY-MM-DD"; 
	data[HOME] = snap.val().home;
	data[ICON] = snap.val().icon || "0";
	if (snap.hasChild("plug")) { var online = snap.val().plug;
		if (online) { data[PLUG] = "Online"; }
		else { data[PLUG] = "Offline"; } }
	data[KIND] = snap.val().kind || 0;
	data[SEED] = [];
	if (snap.hasChild("seed")) { snap.child("seed").forEach(function(seed){
			data[SEED][data[SEED].length] = snap.key+"-"+seed.key;
		});
	}			 
	return data;		 
}

// Playlist info from database
function vibe(snap,user,username) { "use strict";
	var data = [user+"-"+snap.key];
	data[AUTH] = username;
	data[CALL] = snap.val().call;
	if (snap.hasChild("date")) {
		data[DATE] = snap.val().date.substring(0,4); }
	else { data[DATE] = "YYYY"; }
	data[ICON] = snap.val().icon || 0;
	var videos = [];		   
	snap.child("seed").child("tube").forEach(function(seed){
		videos[videos.length] = seed.key; });
	data[SEED] = videos;
	return data;
}

function wake(tab) { "use strict";
	switch(tab) {
		case "media":
			items3.innerHTML = "";
			dropdown3.innerHTML = "";
			filters3 = [];
			tRef.once('value').then(function(snapshot) {
			var medias = snapshot.numChildren(), i = 0;
			snapshot.forEach(function(t) { tube(t, function(data) { i++;
				if (filters2.length===0 || filters2.includes(data[_KEY])) {
					var node = card(data,dropdown3,filters3,data[MOOD],"media");
					items3.appendChild(node);
					make(data,data[MOOD],node.lastChild,"media"); }
				if (i===medias) { filters3.sort(function(a, b) { return a-b; });
				pick(list3,dropdown3,"item","-","media",undefined,spinner2[lang]); // Spinner title
				for (var m = 0; m<filters3.length; m++) {
				pick(list3,dropdown3,"item",filters3[m],"media",undefined,topics[filters3[m]]); } } });
				});
			});
			break;
		case "playlist": // User's playlists
			items2.innerHTML = "";
			dropdown2.innerHTML = "";
			uRef.once('value').then(function(users) {
				//var population = users.numChildren(), i = 0;
				users.forEach(function(snap) { //i++;
					snap.child("seed").forEach(function(list) { // user's playlists
						var data = vibe(list,snap.key,snap.val().call);
						if (filters1.length===0 || filters1.includes(data[_KEY])) {
							var node = card(data,dropdown2,undefined,0,"playlist");
							items2.appendChild(node);
							make(data,0,node.lastChild,"playlist"); } });
					
					/* if... * ...no dropdown yet
					pick(list2, dropdown2, "item", "-", "playlist", undefined, spinner2[lang]); // Spinner title
					for (var p = 0; p<filters2.length; p++) {
					pick(list2,dropdown2,"item",filters2[p],"playlist",undefined,topics[filters2[p]]); } */
				});
			});
			break;
		case "user": 
			items1.innerHTML = "";
			dropdown1.innerHTML = "";
			uRef.once('value').then(function(snapshot) { // Load data of all users
			var users = snapshot.numChildren(), i = 0;
			snapshot.forEach(function(snap) { i++;
				var data = user(snap);
				var node = card(data,dropdown1,undefined,data[KIND],"user");
				items1.appendChild(node);
				make(data,0,node.lastChild,"user");
				wake("playlist",snap.key);
				if (i===users) { 
					pick(list1,dropdown1,"item","-","user",undefined,spinner3[lang]); // Spinner title
						for (var u = 1; u<kinds.length; u++) {
							pick(list1,dropdown1,"item",u,"user",undefined,kinds[u]); } } });
			});
			break;
	}
}

// TODO: copy playlist
			//if (rename.length>0 && rename!==name) { /* [START moving] */
				//var move = uRef.child(user).child("seed").child(rename); 
				/*var move = uRef.child(user).child("seed").child(push);
				move.child("call").set(rename);
				
				playlist.once('value').then(function(snapshot) {
					if (snapshot.hasChild("date")) {
						move.child("date").set(snapshot.val().date); }
					if (snapshot.hasChild("room")) { // followers
						snapshot.child("room").forEach(function(snap) {
							move.child("room").child(snap.key).set(true); }); }
					move.child("icon").set(icon);
					if (snapshot.hasChild("seed")) {
						snapshot.child("seed").child("tube")
							.forEach(function(snap) { move.child("seed")
							.child("tube").child(snap.key).set(true); });
						kill(id,container,tab,rename); } }); /* [END moving] */ /* */