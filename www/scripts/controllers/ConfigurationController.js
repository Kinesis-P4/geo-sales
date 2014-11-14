'use strict';

angular.module('Geosales')
  .controller('ConfigurationController', ['$scope', function ($scope) {
  $scope.user = {username:'',password:'',name:'', lastName:'', email:'',phone:'',collectFrequency:0 ,emailNotification:0};

  var User = Parse.Object.extend('user');

   var addSettings = function (user) {
    if($scope.data.deposit > 0) {
      var newUser = new Debit();
      newUser.set('username', $scope.user.username);
      newUser.set('password', $scope.user.password);
      newUser.set('name', $scope.user.name);
      newUser.set('lastName', $scope.user.lastName);
      newUser.set('email', $scope.user.email);
      newUser.set('phone', $scope.user.phone);
      newUser.set('collectFrequency', $scope.user.collectFrequency);
      newUser.set('emailNotification', $scope.user.emailNotification);                                          


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
}]);