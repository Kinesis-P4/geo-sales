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
    $scope.getTransactions();
    //$scope.getBalance();
  });

  $scope.getClient = function() {
    var query = new Parse.Query(Client);
    query.get($stateParams.id, {
      success: function(responseClient) {
        $scope.cliente = responseClient;
        $scope.getTransactions();
        $scope.getCreditLines();
      },
      error: function(object, error) {
        console.log('Ocurrió un error obteniendo cliente actual, con el codigo de error: ' + error.message);
      }
    });
  };

  $scope.getTransactions = function() {
		var Log = Parse.Object.extend('account_log');
		var query = new Parse.Query(Log);
		query.ascending('updatedAt');
    query.include('client');
		query.include('debit');
		query.include('credit');
    query.include('createdAt');
    query.equalTo('client', $scope.cliente);
		query.find({
			success: function(logs) {
				$scope.transactions = logs;
        $scope.$apply();
			},
			error: function() {
				console.log('Error getting the transaction logs');
			}
		});
  };

  $scope.getCreditLines = function(credit) {
    var Lines = Parse.Object.extend('credit_lines');
    var query = new Parse.Query(Lines);
    query.equalTo('credit', credit);
    query.find({
      success: function(lines) {
        $scope.creditLines = lines;
        $scope.$apply();
      },
      error: function() {
        console.log('Error getting the transaction logs');
      }
    });
  };


  $scope.getTime = function(date) {
    return date.getTime();
  };

  $scope.getSaldo = function() {
    var saldo = 0;

    for (var i = 0; i < $scope.transactions.length; i++) {
      if($scope.transactions[i].get('transaction_kind') == 'credit'){
        saldo += $scope.transactions[i].get('amount');
      } else {
        saldo -= $scope.transactions[i].get('amount');
      }
    };

    return saldo;
  };



	var submitDebit = function() {
		addDebit($scope.cliente);
	};

	var addDebit = function (client) {
		if($scope.data.deposit > 0) {
			var newDebit = new Debit();
			newDebit.set('client', client);
			newDebit.set('amount', $scope.data.deposit);
			newDebit.save(null, {
				success: function(newDebit) {
          $scope.getTransactions();
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