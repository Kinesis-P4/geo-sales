'use strict';

angular.module('Geosales')
  .controller('ClienteController', ['$scope', 'ClientesServices','$state','$stateParams', function ContentCtrl($scope, ClientesServices, $state, $stateParams) {

    ClientesServices.get($stateParams.id).success(function(data){
        $scope.cliente=data;
    });

}]);