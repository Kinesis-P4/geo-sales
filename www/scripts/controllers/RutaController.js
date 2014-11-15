'use strict';

angular.module('Geosales')
	.controller('RutaController', ['$scope','$ionicPlatform', '$location',
	function($scope, $ionicPlatform, $location) {

	// init gps array
    $scope.whoiswhere = [];
    $scope.basel = { lat: 9.942142, lon: -84.104141 };

    // check login code
	$ionicPlatform.ready(function() {	navigator.geolocation.getCurrentPosition(function(position) {
		    $scope.position=position;
	        var c = position.coords;
	        $scope.gotoLocation(c.latitude, c.longitude);
		    $scope.$apply();
		    },function(e) { console.log("Error retrieving position " + e.code + " " + e.message) });
	    $scope.gotoLocation = function (lat, lon) {
	        if ($scope.lat != lat || $scope.lon != lon) {
	            $scope.basel = { lat: lat, lon: lon };
	            if (!$scope.$$phase) $scope.$apply("alajuela");
				}
			};

		    // some points of interest to show on the map
		    // to be user as markers, objects should have "lat", "lon", and "name" properties
		    $scope.whoiswhere = [
		        { "name": "My Marker", "lat": $scope.basel.lat, "lon": $scope.basel.lon },
				];
			});
	}]);


