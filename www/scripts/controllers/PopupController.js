'use strict';

angular.module('Geosales')
.controller('PopupController', function($scope, $ionicPopup, $timeout) {
 // Triggered on a button click, or some other target
 $scope.showPopup = function() {
   $scope.data = {}

   // An elaborate, custom popup
   var myPopup = $ionicPopup.show({
     template: '<input type="tel number" ng-model="data.wifi">',
     title: 'Agregar abono',
     subTitle: 'Ingrese el monto a abonar',
     scope: $scope,
     buttons: [
       { text: 'Cancelar' , type: 'button-positive' },
       { text: 'Acreditar', type: 'button-positive',
         onTap: function(e) {
           if (!$scope.data.wifi) {
             //don't allow the user to close unless he enters wifi password
             e.preventDefault();
           } else {
             return $scope.data.wifi;
           }
         }
       },
     ]
   });
   myPopup.then(function(res) {
     console.log('Tapped!', res);
   });
   $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
   }, 3000);
  };
});