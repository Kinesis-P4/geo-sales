'use strict';

angular.module('Geosales')
  .controller('AgregarClienteController', ['$scope', '$rootScope', 'ClientesServices','$state','$stateParams', function ContentCtrl($scope, $rootScope, ClientesServices, $state, $stateParams) {

	var point = new Parse.GeoPoint({latitude: 0, longitude: 0});

	//{ "id": "p38txDyfsu", "created_at": "2014-11-02T21:27:32Z", "updated_at": "2014-11-04T03:15:04Z", "collectDate": 13, "email": "ljblanco@gmail.com", "lastName": "Blanco", "location": { "__type": "GeoPoint", "latitude": 0, "longitude": 0 }, "name": "Luis", "phone": "34128549", "user": [ "_User", "Yi697lxWcF" ] }
	var user = $rootScope.loggedUser.relation('_User');

  	$scope.cliente = {name:'', lastName:'', email:'', phone:'', location:point, user:user, collectDate:15};

  	$scope.addClient = function() {
  		ClientesServices.create($scope.cliente).success(function(data){
	    	$state.go('/clientes');
	    });
  	};

}]);