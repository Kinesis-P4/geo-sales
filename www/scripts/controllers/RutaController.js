'use strict';

angular.module('Geosales')
    .controller('RutaController', ['$scope','$ionicPlatform', '$location',
    function($scope, $ionicPlatform, $location) {

	// init gps array
    $scope.listaClientes = [];
    $scope.whoiswhere = [];
    $scope.basel = { lat: 9.942142, lon: -84.104141 };
    $scope.$on('$viewContentLoaded', function(){
        $scope.updateClientes();
        //console.log("En el ON primero");
        //console.log($scope.listaClientes);
    });

    $scope.updateClientes = function() {
        
        
    };

    // check login code
    $ionicPlatform.ready(function() {   
        navigator.geolocation.getCurrentPosition(function(position) {
            $scope.position=position;
            var c = position.coords;
            $scope.gotoLocation(c.latitude, c.longitude);
            $scope.$apply();
            },function(e) { console.log("Error retrieving position " + e.code + " " + e.message) });
        $scope.gotoLocation = function (lat, lon) {
            if ($scope.lat != lat || $scope.lon != lon) {
                $scope.basel = { lat: lat, lon: lon };
                //if (!$scope.$$phase) $scope.$apply("alajuela");
            }
            };
            var Client = Parse.Object.extend('clients');
            var query = new Parse.Query(Client);
            var clientsResults = [];
            var clientLocation = {};
            query.equalTo('user', Parse.User._currentUser);
            query.find({
                success: function(results) {
                    for (var i = 0; i < results.length; i++) {
                        clientLocation = {};
                        clientLocation.name = (results[i].get('name') + ' ' +results[i].get('lastName'));
                        clientLocation.phone = results[i].get('phone');
                        clientLocation.lat = results[i].get('location').latitude;
                        clientLocation.lon = results[i].get('location').longitude;
                        $scope.listaClientes.push(clientLocation);
                    };
                    //console.log($scope.listaClientes);
                    $scope.whoiswhere = $scope.listaClientes;
                }
            },{
                error: function(error) {
                    console.log('Hubo un error con la conexion.');
                }
            });

            // some points of interest to show on the map
            // to be user as markers, objects should have "lat", "lon", and "name" properties
            /*$scope.whoiswhere = [
                { "name": "Juan Carlos", "lat": 9.99135, "lon": -84.1541403 },
                { "name": "Elver", "lat": 9.912141, "lon": -84.1741406 },
                { "name": "Juan", "lat": 9.922131, "lon": -84.1341409 },
                { "name": "Mariela", "lat": 9.932115, "lon": -84.18411 },
                { "name": "Angelica Maria", "lat": 9.942125, "lon": -84.12412 },
                { "name": "Mariana", "lat": 9.95213, "lon": -84.1941 },
                { "name": "Juanito", "lat": 9.96212, "lon": -84.114135 },
                { "name": "Jane", "lat": 9.982135, "lon": -84.164141 },
                ];*/
            
            //$scope.listaClientes = [];
            //$scope.updateClientes();

            //$scope.updateClientes();    
            });









    }]);