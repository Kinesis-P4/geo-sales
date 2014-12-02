'use strict';

angular.module('Geosales')
    .controller('RutaPendienteController', ['$scope','$ionicPlatform', '$location',
    function($scope, $ionicPlatform, $location) {
    var map;
    var directionsDisplay;
    var directionsService;
    var stepDisplay;
    var markerArray = [];

$scope.$on('$viewContentLoaded', function(){
    setTimeout(initialize, 2000);
    initialize();
  });

var initialize = function() {
  // Instantiate a directions service.
  directionsService = new google.maps.DirectionsService();

  // Create a map and center it on San Jose.
  var sanJose = new google.maps.LatLng(9.942142, -84.104141);
  var mapOptions = {
    zoom: 13,
    center: sanJose
  }
  map = new google.maps.Map(window.document.getElementById('map-canvas'), mapOptions);

    // Create a renderer for directions and bind it to the map.
    var rendererOptions = {
      map: map
    }
    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions)

  // Instantiate an info window to hold step text.
  stepDisplay = new google.maps.InfoWindow();
  calcRoute();
};

var calcRoute = function() {

  // First, remove any existing markers from the map.
  for (var i = 0; i < markerArray.length; i++) {
    markerArray[i].setMap(null);
  }

  // Now, clear the array itself.
  markerArray = [];

  // Retrieve the start and end locations and create
  // a DirectionsRequest using WALKING directions.

  var start = "9.938405,-84.107623"; //getParameterByName("origen");
  var end = "9.906615,-84.023509"; //getParameterByName("destino");
  var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
  };

  // Route the directions and pass the response to a
  // function to create markers for each step.
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      var warnings = window.document.getElementById('warnings_panel');
      warnings.innerHTML = '<b>' + response.routes[0].warnings + '</b>';
      directionsDisplay.setDirections(response);
      showSteps(response);
    }
  });
};

var showSteps = function(directionResult) {
  // For each step, place a marker, and add the text to the marker's
  // info window. Also attach the marker to an array so we
  // can keep track of it and remove it when calculating new
  // routes.
  var myRoute = directionResult.routes[0].legs[0];

  for (var i = 0; i < myRoute.steps.length; i++) {
    var marker = new google.maps.Marker({
      position: myRoute.steps[i].start_location,
      map: map
    });
    attachInstructionText(marker, myRoute.steps[i].instructions);
    markerArray[i] = marker;
  }
};

var attachInstructionText = function(marker, text) {
  google.maps.event.addListener(marker, 'click', function() {
    // Open an info window when the marker is clicked on,
    // containing the text of the step.
    stepDisplay.setContent(text);
    stepDisplay.open(map, marker);
  });
};
}]);