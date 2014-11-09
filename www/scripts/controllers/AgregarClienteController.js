'use strict';

angular.module('Geosales')
  .controller('AgregarClienteController', ['$scope', '$rootScope', 'ClientesServices','$state','$stateParams', function ContentCtrl($scope, $rootScope, ClientesServices, $state, $stateParams) {

	$scope.cliente = {name:'', lastName:'', email:'', phone:'', collectDate:15};

  	$scope.addClient = function() {
  		var Client = Parse.Object.extend('clients');
  		var newClient = new Client();
		var defaultPoint = new Parse.GeoPoint({latitude: 0, longitude: 0});

		newClient.set('name', $scope.cliente.name);
		newClient.set('lastName', $scope.cliente.lastName);
		newClient.set('email', $scope.cliente.email);
		newClient.set('phone', $scope.cliente.phone+"");
		newClient.set('collectDate', $scope.cliente.collectDate);
		newClient.set('location', defaultPoint);
		newClient.set('user', Parse.User._currentUser);

		newClient.save();

		//Redireccionar a la pantalla del cliente recien creado
  	};

}]);