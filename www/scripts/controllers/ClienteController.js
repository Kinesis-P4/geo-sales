'use strict';

angular.module('Geosales').controller('ClienteController', ['$scope', 'ClientesServices', '$ionicPopup', '$state','$stateParams', 'PARSE_CREDENTIALS', 
	function ($scope, ClientesServices, $ionicPopup, $state, $stateParams, PARSE_CREDENTIALS) {

  var Client = Parse.Object.extend('clients');
  var Debit = Parse.Object.extend('debits');

  $scope.data = {deposit:''};
  $scope.transactions = [];
  $scope.creditLines = [];
  $scope.balance = 0;

  $scope.cliente = {};
  $scope.clienteLoaded = {};

  $scope.enviarCorreo = function(){
    
    var comprasHTML = "Estado de Cuenta \n \n"
    comprasHTML += "A continuacion el estado de cuenta a la fecha " + $scope.getFecha(new Date()) + " para el cliente " + $scope.cliente.attributes.name + " " + $scope.cliente.attributes.lastName + ". \n \n";
    for(var i = 0; i < $scope.transactions.length; i++){
      if($scope.transactions[i].attributes.transaction_kind === "credit"){
        comprasHTML += "- Compra: " + $scope.transactions[i].attributes.amount + "\n";
        comprasHTML += "Fecha: " + $scope.getFecha(new Date($scope.transactions[i].attributes.credit.createdAt)) + "\n \n";
      }else if($scope.transactions[i].attributes.transaction_kind === "debit"){
        comprasHTML += "- Abono: " + $scope.transactions[i].attributes.amount + "\n";
        comprasHTML += "Fecha: " + $scope.getFecha(new Date($scope.transactions[i].attributes.debit.createdAt)) + "\n \n";
      }
    }
    comprasHTML += "- Saldo: " + $scope.getSaldo() + "\n";
    if(window.plugins && window.plugins.emailComposer) {
            window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
                console.log("Response -> " + result);
            },
            "Estado de Cuenta", // Subject
            comprasHTML,                      // Body
            [$scope.cliente.attributes.email],    // To
            null,                    // CC
            null,                    // BCC
            false,                   // isHTML
            null,                    // Attachments
            null);                   // Attachment Data
        }
  };

  $scope.eliminarCliente = function(){
    var saldoClienteEliminar = $scope.getSaldo();
    if(saldoClienteEliminar > 0) {
      alert("No se puede borrar un cliente que tenga saldo pendiente.");
    } else {
      var myPopup = $ionicPopup.show({
        templateUrl: 'popupRuta.html',
        title: 'Eliminar al cliente ' + $scope.cliente.attributes.name + ' ' + $scope.cliente.attributes.lastName + '?',
        buttons: 
        [{   
          text: 'Sí',
          type: 'button-positive',
          onTap: function(e) {
            $scope.cliente.destroy({
                success: function(){
                alert("El cliente fue eliminado correctamente.");
                window.history.back();
              },
              error: function(cliente, error){
                alert("Ocurrió un error eliminando el cliente. " + error.message);
              }
            });
          }
        },
        {   text: 'No',
          type: 'button-positive',
          onTap: function(e) {
           //Do nothing
          }
        }]
      });      
    }
  };
  $scope.navegarACliente = function() 
  {
    var pos;
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);     
    });

    var hrefGM ="http://maps.google.com/?saddr=" +pos.k + "," + pos.B + "&daddr=" + $scope.cliente.attributes.location.latitude + "," + $scope.cliente.attributes.location.longitude;
    var tagLinkGoogleMaps = '<p><a href="#" onClick="window.open(\'' + hrefGM + '\', \'_blank\', \'location=yes\');return false;">Google Maps</a></p>';
    var hrefW="http://waze://?ll=" +$scope.cliente.attributes.location.latitude + "," + $scope.cliente.attributes.location.longitude + "&navigate=yes";
    var tagLinkWaze = '<p><a href="' + hrefW + '">' + 'Waze' + '</a></p>';
    var myPopup = $ionicPopup.show({
      templateUrl: 'popupRuta.html',
      title: 'Visitar a ' + $scope.cliente.attributes.name + ' ' + $scope.cliente.attributes.lastName + ' usando:',
      subTitle: tagLinkGoogleMaps + tagLinkWaze,

      buttons: [
      { 
        text: 'Google Maps',
        type: 'button-positive',
        onTap: function(e) {
          $window.open(hrefGM);
          //return scope;
        }
      },
      {   
        text: 'Waze',
        type: 'button-positive',
        onTap: function(e) {
          $window.open(hrefW);
          //return scope;
        }
      },
      { text: 'Cancelar' , type: 'button-positive' }
      ]
    });

  }

  $scope.$on('$viewContentLoaded', function(){
    $scope.getClient();
  });

  $scope.getFecha = function(date){
    var fecha = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
    return fecha;
  }

  $scope.getClient = function() {
    var query = new Parse.Query(Client);
    query.get($stateParams.id, {
      success: function(responseClient) {
        $scope.cliente = responseClient;
        $scope.getTransactions();
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
        $scope.getCreditLines();
        $scope.$apply();
			},
			error: function() {
				console.log('Error getting the transaction logs');
			}
		});
  };

  $scope.getCreditLines = function() {
    var Lines = Parse.Object.extend('credit_lines');
    var query = new Parse.Query(Lines);
    query.find({
      success: function(lines) {
        $scope.creditLines = lines;
        $scope.$apply();
      },
      error: function() {
        console.log('Error getting the transaction logs');
      }
    }).then(function() {
       setTransactionDetail();
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

  var setTransactionDetail = function() {
    for (var i = 0; i < $scope.transactions.length; i++) {
      if($scope.transactions[i].get('transaction_kind') == 'credit') {
        $scope.transactions[i].attributes.detail = getCreditDetail($scope.transactions[i].get('credit'));
        $scope.$apply();
      }
    };
    $scope.$apply();
  };

  var getCreditDetail = function(credit) {
    var detail = '';
    for (var i = 0; i < $scope.creditLines.length; i++) {
      if ($scope.creditLines[i].get('credit').id == credit.id) {
        detail += ($scope.creditLines[i].get('quantity') + " " + $scope.creditLines[i].get('name') + " ");
      }
    }
    $scope.$apply();
    return detail;
  };

	var submitDebit = function() {
		addDebit($scope.cliente);
	};

	var addDebit = function (client) {
		if($scope.data.deposit > 0) {
			var newDebit = new Debit();
			newDebit.set('client', client);
			newDebit.set('amount', $scope.data.deposit);
      newDebit.set('isRefund', $scope.data.isRefund);
      if ($scope.data.isRefund) {
        newDebit.set('isRefund', $scope.data.isRefund);
        newDebit.set('detail', $scope.data.detail);
      }
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

	$scope.showPopup = function(payAll, isRefund){
    var popUpTemplate = 'popupCredito.html';

    $scope.data.deposit = '';
    $scope.data.detail = '';
    $scope.data.isRefund = false;

    if(payAll) {
      $scope.data.deposit = $scope.getSaldo();
    }

    if (isRefund) {
      popUpTemplate = 'popupRefund.html';
      $scope.data.isRefund = true;
    }

    if(payAll && $scope.data.deposit<0) {
      window.alert('El cliente no tiene saldos pendientes.');
    } else {
      var myPopup = $ionicPopup.show({
        templateUrl: popUpTemplate,
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
    }
	};
}]);