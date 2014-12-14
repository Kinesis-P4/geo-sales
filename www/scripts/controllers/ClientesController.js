'use strict';

angular.module('Geosales')
  .controller('ClientesController', ['$scope', 'ClientesServices', '$stateParams', '$ionicLoading', function ContentCtrl($scope, ClientesServices, $stateParams, $ionicLoading) {
	
  	$scope.clientes = [];
    
    $scope.showLoading = function() {
        $ionicLoading.show({template: 'Cargando...'});
    };

    $scope.hideLoading = function() {
        $ionicLoading.hide();
    };

    $scope.$on('$viewContentLoaded', function(){
        $scope.showLoading();
    });

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
                $scope.hideLoading();
            }
        },{
            error: function(error) {
                console.log('Hubo un error con la conexion.');
            }
        });
    };

    $scope.updateClientes();
    
}]);