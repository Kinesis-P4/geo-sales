'use strict';

angular.module('Geosales')
  .controller('SideMenuController', function ContentCtrl($scope, $ionicSideMenuDelegate) {
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
});