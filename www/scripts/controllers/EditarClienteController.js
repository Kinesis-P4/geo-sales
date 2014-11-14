'use strict';

angular.module('Geosales')
  .controller('EditarClienteController', ['$scope', '$rootScope', 'ClientesServices','$state','$stateParams', function ContentCtrl($scope, $rootScope, ClientesServices, $state, $stateParams) {
  	
  	$scope.cliente = {};
  	$scope.clienteLoaded = {};
  	$scope.$on('$viewContentLoaded', function(){
  		var Client = Parse.Object.extend('clients');
    	var query = new Parse.Query(Client);
	    query.get($stateParams.id, {
			success: function(responseClient) {
				console.log(responseClient);
				$scope.clienteLoaded = responseClient;
				$scope.cliente = responseClient.attributes;
			},
			error: function(object, error) {
				console.log('Ocurrió un error obteniendo cliente actual, con el codigo de error: ' + error.message);
			}
	    });
	  });

  	$scope.updateClient = function() {
      	var defaultPoint = new Parse.GeoPoint({latitude: 0, longitude: 0});
      	$scope.clienteLoaded.set('name', $scope.cliente.name);
		$scope.clienteLoaded.set('lastName', $scope.cliente.lastName);
		$scope.clienteLoaded.set('email', $scope.cliente.email);
		$scope.clienteLoaded.set('phone', $scope.cliente.phone+"");
		$scope.clienteLoaded.set('collectDate', $scope.cliente.collectDate);
		$scope.clienteLoaded.set('location', defaultPoint);
		$scope.clienteLoaded.set('user', Parse.User._currentUser);
		$scope.clienteLoaded.save({
			success: function(newClient){
				alert('El cliente fue actualizado correctamente.');
				window.history.back();
			}
		});
       
  	};  	

}]);