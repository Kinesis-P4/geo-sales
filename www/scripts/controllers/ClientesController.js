'use strict';

angular.module('Geosales')
  .controller('ClientesController', ['$scope', 'ClientesServices', '$stateParams', function ContentCtrl($scope, ClientesServices, $stateParams) {
	
  	$scope.clientes = [];

    $scope.$on('$viewContentLoaded', function(){
        //$scope.updateClientes();
    });

    $scope.updateClientes = function() {

        var Client = Parse.Object.extend('clients');
        var query = new Parse.Query(Client);
        var clientsResults = [];

        query.equalTo('user', Parse.User._currentUser);
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

    $scope.updateClientes();
    
}]);