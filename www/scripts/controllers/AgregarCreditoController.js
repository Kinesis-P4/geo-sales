'use strict';

angular.module('Geosales')
  .controller('AgregarCreditoController', ['$scope', 'ClientesServices', 'CreditosServices','$state','$stateParams', function ContentCtrl($scope, ClientesServices, CreditosServices, $state, $stateParams) {

  	$scope.credit = {};
  	$scope.lines = [{credit: '', name:'', quantity:'', price:''}];
  	$scope.deposit = 0;

  	$scope.addLine = function() {
  		$scope.lines.push({credit: '', name:'', quantity:'', price:''});
  	};

  	$scope.removeLine = function(line) {
  		$scope.lines.splice($scope.lines.indexOf(line), 1);
  	};

  	$scope.getTotal = function() {
  		var total = 0;

  		for (var i = 0; i < $scope.lines.length; i++) {
  			total += ($scope.lines[i].quantity * $scope.lines[i].price);
  		};

  		return total;
  	};

    ClientesServices.get($stateParams.id).success(function(data){
        $scope.cliente=data;
    });

}]);