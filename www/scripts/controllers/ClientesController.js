'use strict';

angular.module('Geosales')
  .controller('ClientesController', ['$scope', 'ClientesServices', function ContentCtrl($scope, ClientesServices) {

  	$scope.daysList = [
		{ text: "Lunes", checked: false },
	    { text: "Martes", checked: false },
	    { text: "Miércoles", checked: false },
	    { text: "Jueves", checked: false },
	    { text: "Viernes", checked: false },
	    { text: "Sábado", checked: false },
	    { text: "Domingo", checked: false }
	];
	$scope.hoursList = [
		{ text: "Mañana", checked: false },
	    { text: "Tarde", checked: false },
	    { text: "Noche", checked: false },	    
	];
	
  	$scope.clientes = [];

    ClientesServices.getAll().success(function(data){
        $scope.clientes=data.results;
    });



}]);