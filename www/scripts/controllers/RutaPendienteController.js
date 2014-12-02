'use strict';

angular.module('Geosales')
    .controller('RutaPendienteController', ['$scope','$ionicPlatform', '$location', '$ionicLoading', '$compile',
    function($scope, $ionicPlatform, $location, $ionicLoading, $compile) {

  $scope.currentPosition = null;
  $scope.clientes = [];

  var map;
  var directionsDisplay;
  var directionsService;
  var stepDisplay;
  var infowindow = new google.maps.InfoWindow({content: ''});
  var markerArray = [];

  $scope.$on('$viewContentLoaded', function(){
    getCurrentPosition();
  });

  var initialize = function() {
    // Instantiate a directions service.
    directionsService = new google.maps.DirectionsService();
    var currentPos = new google.maps.LatLng($scope.currentPosition.latitude, $scope.currentPosition.longitude);
    var mapOptions = {
      zoom: 13,
      center: currentPos,
      streetViewControl: false,
      scaleControll: true,
      overviewMapControl: true,
      navigationControl: true,
      panControl: false,
      disableDefaultUI: true,
      mapTypeControl: true,
      mapMaker: true
    }
    map = new google.maps.Map(window.document.getElementById('map-canvas'), mapOptions);

    var rendererOptions = {
      map: map
    };
    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions)

    stepDisplay = new google.maps.InfoWindow();
    $scope.updateClientes();
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
      addMarker(marker, myRoute.steps[i].instructions);
      markerArray[i] = marker;
    }
  };

  var addMarker = function(marker, text) {
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
                  addClientToMap(results[i]);
              };
              $scope.$apply();
          }
      },{
          error: function(error) {
              console.log('Hubo un error con la conexion.');
          }
      });
  };

  var addClientToMap = function(cliente) {


    var currentPos = new google.maps.LatLng(cliente.get('location').latitude, cliente.get('location').longitude);

    var link = 'http://maps.google.com/?saddr=' + $scope.currentPosition.latitude + ',' + $scope.currentPosition.longitude + '&daddr=' + cliente.get('location').latitude + ',' + cliente.get('location').longitude;

    var contentString = '<div style="width:100px">' +
      '<p style="margin:0;"><strong>'+ cliente.get('name') + ' ' + cliente.get('lastName')+'</strong></p>'+
      '<a href="" ng-click="openGoogleMaps(\''+link+'\')" class="icon ion-model-s" style="color: #145fd7; font-size: 30px; margin-right: 10px;"></a>'+
      '<a href="tel:'+ cliente.get('phone') +'" class="icon ion-ios7-telephone" style="color: #145fd7; font-size: 30px;"></a>'+
      //Se debe de agregar la funcionalidad de agregar abono
      //'<a ng-click="openGoogleMaps()" class="icon ion-model-s" style="color: #145fd7; font-size: 30px;"></a>'+
    '</div>';

    var compiled = $compile(contentString)($scope);

    var marker = new google.maps.Marker({
      position: currentPos,
      map: map,
      title: (cliente.get('name') + ' ' + cliente.get('lastName'))
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(compiled[0]);
      infowindow.open(map,marker);
      //close other info windows
    });
  };

  $scope.openGoogleMaps = function(link) {
    window.open(link, '_blank', 'location=yes');
  };

}]);