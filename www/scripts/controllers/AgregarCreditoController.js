'use strict';

angular.module('Geosales')
  .controller('AgregarCreditoController', ['$scope', 'ClientesServices', 'CreditosServices','$state','$stateParams', '$location', function ContentCtrl($scope, ClientesServices, CreditosServices, $state, $stateParams, $location) {

    var Client = Parse.Object.extend('clients');
    var Debit = Parse.Object.extend('debits');
    var Credit = Parse.Object.extend('credits');
    var Line = Parse.Object.extend('credit_lines');

  	$scope.credit = {deposit:0};
  	$scope.lines = [{credit: '', name:'', quantity:'', price:''}];

  	$scope.addLine = function() {
  		$scope.lines.push({credit: '', name:'', quantity:'', price:''});
  	};

  	$scope.removeLine = function(line) {
  		$scope.lines.splice($scope.lines.indexOf(line), 1);
  	};

  	$scope.getTotal = function() {
  		var total = 0;

  		for (var i = 0; i < $scope.lines.length; i++) {
  			total += ($scope.lines[i].quantity * $scope.lines[i].price);
  		};

  		return total;
  	};

    $scope.submitCredit = function() {
      var query = new Parse.Query(Client);
      query.get($stateParams.id, {
        success: function(responseClient) {
          addCredit(responseClient);
          alert('El crédito fue agregado correctamente.');
          window.history.back();
        },
        error: function(object, error) {
          console.log('Ocurrió un error obteniendo cliente actual, con el codigo de error: ' + error.message);
        }
      });
    };

    var addCredit = function (client) {
      //Creating the new Credit
      var newCredit = new Credit();
      newCredit.set('client', client);
      newCredit.set('amount', $scope.getTotal());
      newCredit.save(null, {
        success: function(newCredit) {
          addCreditLines(newCredit);
          addDebit(client);
        },
        error: function(newCredit, error) {
          console.log('Ocurrió un error salvando el nuevo credito, con el codigo de error: ' + error.message);
        }
      });
    };

    var addCreditLines = function (newCredit) {
      //Creating each credit line
      var creditLine;
      for (var i = 0; i < $scope.lines.length; i++) {
        creditLine = new Line();
        creditLine.set('credit', newCredit);
        creditLine.set('name', $scope.lines[i].name);
        creditLine.set('quantity', $scope.lines[i].quantity);
        creditLine.set('price', $scope.lines[i].price);
        creditLine.save(null, {
          success: function(creditLine) {
            //console.log('New creditLine created with objectId: ' + creditLine.id);
          },
          error: function(creditLine, error) {
            console.log('Ocurrió un error salvando la nueva linea de credito, con el codigo de error: ' + error.message);
          }
        });
      };
    };

    var addDebit = function (client) {
      if($scope.credit.deposit > 0) {
        var newDebit = new Debit();
        newDebit.set('client', client);
        newDebit.set('amount', $scope.credit.deposit);
        newDebit.save(null, {
          success: function(newDebit) {
            //console.log('New newDebit created with objectId: ' + newDebit.id);
          },
          error: function(newDebit, error) {
            console.log('Ocurrió un error salvando el abono, con el codigo de error: ' + error.message);
          }
        });
      }
    };

}]);