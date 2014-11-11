'use strict';

angular.module('Geosales').controller('ClienteController', ['$scope', 'ClientesServices','$state','$stateParams', 
  	function ContentCtrl($scope, ClientesServices, $state, $stateParams) {

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

}]);