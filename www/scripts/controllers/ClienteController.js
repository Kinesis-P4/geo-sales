'use strict';

angular.module('Geosales').controller('ClienteController', ['$scope', 'ClientesServices', '$ionicPopup', '$state','$stateParams', 
	function ($scope, ClientesServices, $ionicPopup, $state, $stateParams) {

  	$scope.transactions = [];

  	$scope.getTransactions = function() {
		var Log = Parse.Object.extend('account_log');
		var query = new Parse.Query(Log);
		query.descending("createdAt");
		query.include("client");
		query.include("debit");
		query.include("credit");
		query.find({
			success: function(logs) {
				$scope.transactions = logs;
			},
			error: function() {
				console.log('Error getting the transaction logs');
			}
		});
  	};

	var Client = Parse.Object.extend('clients');
		var Debit = Parse.Object.extend('debits');
		$scope.data = {deposit:0};

		var submitDebit = function() {
		var query = new Parse.Query(Client);
		query.get($stateParams.id, {
			success: function(responseClient) {
				addDebit(responseClient);
			},
			error: function(object, error) {
				console.log('Ocurrió un error obteniendo cliente actual, con el codigo de error: ' + error.message);
			}
		});
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