'use strict';

angular.module('Geosales')
  .controller('NavigationController', function ContentCtrl($scope, $ionicSideMenuDelegate) {
	$scope.showMenu = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
})
  .controller('InicioTabCtrl', function($scope) {
});