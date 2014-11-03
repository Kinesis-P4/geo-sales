'use strict';

angular.module('Geosales')
  .controller('AgregarCreditoController', ['$scope', 'ClientesServices', 'CreditosServices','$state','$stateParams', function ContentCtrl($scope, ClientesServices, CreditosServices, $state, $stateParams) {

    ClientesServices.get($stateParams.id).success(function(data){
        $scope.cliente=data;
    });

}]);