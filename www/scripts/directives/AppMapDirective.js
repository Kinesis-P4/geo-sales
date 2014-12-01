'use strict';

angular.module('Geosales')
/**
 * Handle Google Maps API V3+
 */
// - Documentation: https://developers.google.com/maps/documentation/
.directive("appMap", function ($window, $ionicPopup) {

    return {
        restrict: "E",
        replace: true,
        template: "<div></div>",
        scope: {
            center: "=",        // Center point on the map (e.g. <code>{ latitude: 10, longitude: 10 }</code>).
            markers: "=",       // Array of map markers (e.g. <code>[{ lat: 10, lon: 10, name: "hello" }]</code>).
            width: "@",         // Map width in pixels.
            height: "@",        // Map height in pixels.
            zoom: "@",          // Zoom level (one is totally zoomed out, 25 is very much zoomed in).
            mapTypeId: "@",     // Type of tile to show on the map (roadmap, satellite, hybrid, terrain).
            panControl: "@",    // Whether to show a pan control on the map.
            zoomControl: "@",   // Whether to show a zoom control on the map.
            scaleControl: "@"   // Whether to show scale control on the map.
        },
        link: function (scope, element, attrs) {
            var toResize, toCenter;
            var map;
            var pos;
            var infowindow;
            var currentMarkers;
   	        var callbackName = 'InitMapCb';
			$window[callbackName] = function() {
				createMap();
				updateMarkers();
				};
			if (!$window.google || !$window.google.maps ) {
				loadGMaps();
			}
			else
			{
				createMap();
			}
			function loadGMaps() {
				var script = $window.document.createElement('script');
				script.type = 'text/javascript';
				script.src = 'http://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&callback=InitMapCb';
				$window.document.body.appendChild(script);
			}
			function createMap(position) {
				navigator.geolocation.getCurrentPosition(function(position) {
			      pos = new google.maps.LatLng(position.coords.latitude,
			                                       position.coords.longitude);
			      var infowindow = new google.maps.InfoWindow({
			        map: map,
			        position: pos,
			        content: 'Su ubicación'
			      });
			      map.setCenter(pos);
			    });
				var mapOptions = {
					zoom: 13, 
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					panControl: true,
					zoomControl: true,
					mapTypeControl: true,
					scaleControl: false,
					streetViewControl: false,
					navigationControl: true,
					disableDefaultUI: true,
					overviewMapControl: true
					};
				if (!(map instanceof google.maps.Map)) {
					map = new google.maps.Map(element[0], mapOptions);
          			google.maps.event.addDomListener(element[0], 'tapdown', function(e) {
	            		e.preventDefault();
	            		return false;
            		});
					infowindow = new google.maps.InfoWindow(); 
				}
			}
			scope.$watch('markers', function() {
				updateMarkers();
			});
			function markerCb(marker, member, location) {
			    return function() {
					var hrefGM ="http://maps.google.com/?saddr=" +member.lat + "," + member.lon + "&daddr=" + pos.k + "," + pos.B;
					var tagLinkGoogleMaps = '<p><a href="#"  class="btn btn-lg btn-success" onClick="window.open(\'' + hrefGM + '\', \'_blank\', \'location=yes\');return false;">Google Maps</a></p>';
					var hrefW="http://waze://?ll=" +member.lat + "," + member.lon + "&navigate=yes";
					var tagLinkWaze = '<p><a href="' + hrefW + '">' + 'Waze' + '</a></p>';
					var myPopup = $ionicPopup.show({
        				templateUrl: 'popupRuta.html',
        				title: 'Visitar a ' + member.name + ' usando:',
        				subTitle: tagLinkGoogleMaps + tagLinkWaze,
        				buttons: [
	          				{ text: 'Cancelar' , type: 'button-positive' }
        				]
      				});
				};
			}
			function updateMarkers() {
				if (map && scope.markers) {
					currentMarkers = [];
					var markers = scope.markers;
					if (angular.isString(markers)){
						markers = scope.$eval(scope.markers);
					}
					for (var i = 0; i < markers.length; i++) {
						var m = markers[i];
						var loc = new google.maps.LatLng(m.lat, m.lon);
						var mm = new google.maps.Marker({ position: loc, map: map, title: m.name });
						google.maps.event.addListener(mm, 'click', markerCb(mm, m, loc));
						currentMarkers.push(mm);
					}
				}
			}
			function getLocation(loc) {
				if (loc == null) return new google.maps.LatLng(40, -73);
				if (angular.isString(loc)) loc = scope.$eval(loc);
				return new google.maps.LatLng(loc.lat, loc.lon);
				}

			} // end of link:
	}; // end of return
});