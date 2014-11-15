'use strict';

angular.module('Geosales').controller('ClienteController', ['$scope', 'ClientesServices', '$ionicPopup', '$state','$stateParams', 'PARSE_CREDENTIALS', 
	function ($scope, ClientesServices, $ionicPopup, $state, $stateParams, PARSE_CREDENTIALS) {

  var Client = Parse.Object.extend('clients');
  var Debit = Parse.Object.extend('debits');

  $scope.data = {deposit:0};
  $scope.transactions = [];
  $scope.creditLines = [];
  $scope.balance = 0;

  $scope.cliente = {};
  $scope.clienteLoaded = {};

  $scope.$on('$viewContentLoaded', function(){
    $scope.getClient();
    //$scope.getBalance();
  });

  $scope.getClient = function() {
    var query = new Parse.Query(Client);
    query.get($stateParams.id, {
      success: function(responseClient) {
        $scope.client = responseClient;
        console.log($scope.client);
      },
      error: function(object, error) {
        console.log('Ocurrió un error obteniendo cliente actual, con el codigo de error: ' + error.message);
      }
    }).then(function(){
      $scope.getTransactions();
      $scope.getCreditLinesFor();
    });
  };





  $scope.getTransactions = function() {
		var Log = Parse.Object.extend('account_log');
		var query = new Parse.Query(Log);
		query.ascending("createdAt");
    query.include("client");
		query.include("debit");
		query.include("credit");
    query.include("createdAt");
    query.equalTo("client", $scope.cliente);
		query.find({
			success: function(logs) {
				$scope.transactions = logs;
        console.log($scope.transactions);
			},
			error: function() {
				console.log('Error getting the transaction logs');
			}
		});
  };

  $scope.getCreditLinesFor = function() {
    var Lines = Parse.Object.extend('credit_lines');
    var query = new Parse.Query(Lines);
    query.equalTo('client', $scope.cliente);
    query.find({
      success: function(lines) {
        $scope.creditLines = lines;
        console.log($scope.creditLines);
      },
      error: function() {
        console.log('Error getting the transaction logs');
      }
    });
  };








	var submitDebit = function() {
		addDebit($scope.clienteLoaded);
	};

	var addDebit = function (client) {
		if($scope.data.deposit > 0) {
			var newDebit = new Debit();
			newDebit.set('client', client);
			newDebit.set('amount', $scope.data.deposit);
			newDebit.save(null, {
				success: function(newDebit) {
					window.alert('El débito fué acreditado correctamente.');
					$scope.data.deposit = 0;
				},
				error: function(newDebit, error) {
					console.log('Ocurrió un error salvando el abono, con el codigo de error: ' + error.message);
				}
			});
		}else{
			window.alert('El monto debe ser mayor a cero.');
		}
	};

	$scope.showPopup = function(){
		var myPopup = $ionicPopup.show({
			templateUrl: 'popupCredito.html',
			title: 'Agregar abono',
			subTitle: 'Ingrese el monto a abonar',
			scope: $scope,
			buttons: [
				{ text: 'Cancelar' , type: 'button-positive' },
				{ text: 'Acreditar', type: 'button-positive',
					onTap: function(e) {
						submitDebit();
					}
				}
			]
		});
	};
}]);