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
            var limitDate = new Date().getTime();
            limitDate -= (Parse.User._currentUser.get('collectFrequency')*24*60*60*1000);
            query.equalTo('user', Parse.User._currentUser);
            query.find({
                success: function(results) {
                    for (var i = 0; i < results.length; i++) {
                    if(limitDate < results[i].get('lastCollectDate').getTime()){
                        clientLocation = {};
                        clientLocation.name = (results[i].get('name') + ' ' +results[i].get('lastName'));
                        clientLocation.phone = results[i].get('phone');
                        clientLocation.lat = results[i].get('location').latitude;
                        clientLocation.lon = results[i].get('location').longitude;
                        $scope.listaClientes.push(clientLocation);
                    }
                    };
                    //console.log($scope.listaClientes);
                    $scope.whoiswhere = $scope.listaClientes;
                    $scope.$apply();
                }
            },{
                error: function(error) {
                    console.log('Hubo un error con la conexion.');
                }
            });
        });
        $scope.getTransactions = function() {
            var Log = Parse.Object.extend('account_log');
            var query = new Parse.Query(Log);
            query.ascending('updatedAt');
            query.include('client');
            query.include('debit');
            query.include('credit');
            query.include('createdAt');
            query.equalTo('client', $scope.cliente);
            query.find({
                success: function(logs) {
                    $scope.transactions = logs;
            $scope.$apply();
                },
                error: function() {
                    console.log('Error getting the transaction logs');
                }
            });
      };
    }]);