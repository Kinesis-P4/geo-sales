'use strict';

angular.module('Geosales')
  .controller('ConfigurationController', ['$scope', function ($scope) {
  $scope.user = Parse.User._currentUser.attributes;
  //{name:'', lastName:'', email:'',phone:'',collectFrequency:0 ,emailNotification:true};

  $scope.addSettings = function () {
    Parse.User._currentUser.set('name', $scope.user.name);
    Parse.User._currentUser.set('lastName', $scope.user.lastName);
    Parse.User._currentUser.set('email', $scope.user.email);
    Parse.User._currentUser.set('phone', $scope.user.phone);
    Parse.User._currentUser.set('collectFrequency', $scope.user.collectFrequency);
    Parse.User._currentUser.set('emailNotification', $scope.user.emailNotification);                                          
    Parse.User._currentUser.save(null, {
      success: function(user){
        window.alert('Su configuración ha sido actualizada.');
      },
      error: function(user, error) {
        console.log('Ocurrió un error al actualizar su configuración, con el codigo de error: ' + error.message);
      }
    });
  };
}]);