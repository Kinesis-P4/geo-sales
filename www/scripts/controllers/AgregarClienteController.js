'use strict';

angular.module('Geosales')
  .controller('AgregarClienteController', ['$scope', '$rootScope', 'ClientesServices','$state','$stateParams', '$ionicPopup', '$location', '$ionicLoading', 
  	function ContentCtrl($scope, $rootScope, ClientesServices, $state, $stateParams, $ionicPopup, $location, $ionicLoading) {

	$scope.showLoading = function() {
		$ionicLoading.show({template: 'Cargando...'});
	};

	$scope.hideLoading = function() {
		$ionicLoading.hide();
	};

  	$scope.currentPosition = {};
	$scope.cliente = {name:'', lastName:'', email:'', phone:'', collectDate:15};

  	$scope.$on('$viewContentLoaded', function(){
	    getCurrentLocation();
	});

	var getCurrentLocation = function() {
  		navigator.geolocation.getCurrentPosition(function(position) {
  			$scope.currentPosition = position.coords;
  			$scope.$apply();
      	});
  	};

  	$scope.addClient = function() {
  		$scope.showLoading();
  		var Client = Parse.Object.extend('clients');
  		var newClient = new Client();
  		var defaultPoint = new Parse.GeoPoint({latitude: null, longitude: null});
  		if($scope.cliente.saveLocation){
      		defaultPoint = new Parse.GeoPoint({latitude: $scope.currentPosition.latitude, longitude: $scope.currentPosition.longitude});
  		}
		newClient.set('name', $scope.cliente.name);
		newClient.set('lastName', $scope.cliente.lastName);
		newClient.set('email', $scope.cliente.email);
		newClient.set('phone', $scope.cliente.phone+"");
		newClient.set('lastCollectDate', new Date());
		newClient.set('collectDate', $scope.cliente.collectDate);
		newClient.set('location', defaultPoint);
		newClient.set('user', Parse.User._currentUser);
		newClient.save({
			success: function(newClient){
				alert('El cliente fue agregado correctamente.');
				$scope.hideLoading();
				window.history.back();
			}
		});
  	};  	

}]);