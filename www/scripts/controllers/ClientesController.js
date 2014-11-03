'use strict';

angular.module('Geosales')
  .controller('ClientesController', ['$scope', 'ClientesServices', function ContentCtrl($scope, ClientesServices) {

  	$scope.clientes = [];

    ClientesServices.getAll().success(function(data){
        $scope.clientes=data.results;
    });

}]);