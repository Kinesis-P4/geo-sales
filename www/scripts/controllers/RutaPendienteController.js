'use strict';

angular.module('Geosales')
    .controller('RutaPendienteController', ['$scope','$ionicPlatform', '$location', '$ionicLoading',
    function($scope, $ionicPlatform, $location, $ionicLoading) {

  $scope.currentPosition = null;
  $scope.clientes = [];

  var map;
  var directionsDisplay;
  var directionsService;
  var stepDisplay;
  var markerArray = [];

  $scope.$on('$viewContentLoaded', function(){
    getCurrentPosition();
    $scope.updateClientes();
  });

  var initialize = function() {
    // Instantiate a directions service.
    directionsService = new google.maps.DirectionsService();
    var currentPos = new google.maps.LatLng($scope.currentPosition.latitude, $scope.currentPosition.longitude);
    var mapOptions = {
      zoom: 13,
      center: currentPos
    }
    map = new google.maps.Map(window.document.getElementById('map-canvas'), mapOptions);

      // Create a renderer for directions and bind it to the map.
      var rendererOptions = {
        map: map
      }
      directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions)

    // Instantiate an info window to hold step text.
    stepDisplay = new google.maps.InfoWindow();
    //calcRoute();
  };

  $scope.getClientDirections = function(cliente) {

    var lat = cliente.location.latitude;
    var lon = cliente.location.longitude;

    for (var i = 0; i < markerArray.length; i++) {
      markerArray[i].setMap(null);
    }

    markerArray = [];

    var start = $scope.currentPosition.latitude+','+$scope.currentPosition.longitude;
    
    var end = lat+','+lon;
    
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };

    // Route the directions and pass the response to a
    // function to create markers for each step.
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        showSteps(response);
      }
    });
  };

  var showSteps = function(directionResult) {
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
    google.maps.event.addListener(marker, 'click', function(e) {
      stepDisplay.setContent(text);
      stepDisplay.open(map, marker);
    });
  };

  var getCurrentPosition = function() {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        $scope.currentPosition = {latitude: position.coords.latitude, longitude: position.coords.longitude};
        initialize();
      }
    );
  };

  $scope.updateClientes = function() {

      var Client = Parse.Object.extend('clients');
      var query = new Parse.Query(Client);
      var clientsResults = [];

      query.equalTo('user', Parse.User._currentUser);
      query.ascending('name');
      query.find({
          success: function(results) {
              $scope.clientes = [];
              for (var i = 0; i < results.length; i++) {
                  results[i].attributes.id = results[i].id;
                  $scope.clientes.push(results[i].attributes);
              };
              $scope.$apply();
          }
      },{
          error: function(error) {
              console.log('Hubo un error con la conexion.');
          }
      });
  };

}]);