'use strict';

angular.module('Geosales')
  .controller('AgregarClienteController', ['$scope', '$rootScope', 'ClientesServices','$state','$stateParams', '$ionicPopup', '$location', function ContentCtrl($scope, $rootScope, ClientesServices, $state, $stateParams, $ionicPopup, $location) {

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
		newClient.save({
		      success: function(newClient){
		            
		            $ionicPopup.show({
			              template: 'El cliente fue guardado exitosamente.',
			              title: 'Cliente',              
			              buttons: [
			                { 
			                  text: 'Continuar',
			                  
			                  onTap: function(e) { $location.path("tab/cliente/" + newClient.id); } 
			                }
			              ]
			              }).then(function(res) {
			                console.log('Tapped!', res);
			              }, function(err) {
			                console.log('Err:', err);
			              }, function(msg) {
			                console.log('message:', msg);
		              });
		      }
		});

		// $ionicPopup.show({
		//      title: 'Cliente guardado',
		//      template: 'El cliente fue guardado correctamente.'
		//    });
		
		
		

		//Redireccionar a la pantalla del cliente recien creado
  	};  	

}]);