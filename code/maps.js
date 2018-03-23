/** JavaScript Document
 * Google Maps (JSON)
 * Created by Jerome Robbins on 18-02-19.
 */ /*jshint esversion: 6 */

var mapReady = false;

var js = document.createElement('script');
var key = "AIzaSyBjNTscuOcDgc3iMVlQ519mS6yC-2V4px0";
js.src = "https://maps.googleapis.com/maps/api/js?key="+key+"&callback=init"; // +"&callback=area(document.getElementById('map'))"
var script = document.getElementsByTagName('script')[0];
script.parentNode.insertBefore(js, script);

function area(div) { "use strict"; // jshint ignore:line
	if (mapReady) { //alert("map");
	var map = new google.maps.Map(div, { zoom: 10, disableDefaultUI: true }); // jshint ignore:line
	fetch('code/gmaps.json').then(res => res.json()).then((out) => { map.setOptions({styles: out});});
	setTimeout(function () {(find(new google.maps.Geocoder(), map))},1000); // jshint ignore:line
	} else { setTimeout(function () { area(div); },1000); }
}

function init() { "use strict";
	mapReady=true;
}

function find(geocoder, resultsMap) { "use strict";
	var address = document.getElementById("location").value || 'Trois-Rivières';
    geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') { resultsMap.setCenter(results[0].geometry.location);
    	new google.maps.Marker({ map: resultsMap, position: results[0].geometry.location }); // jshint ignore:line
    } else { alert('Geocode was not successful for the following reason: ' + status); } });
}