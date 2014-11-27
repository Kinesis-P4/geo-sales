'use strict';

angular.module('Geosales')
/**
 * Menu item click directive - intercept, hide menu and go to new location
 */
.directive('clickMenulink', function() {
    return {
        link: function(scope, element, attrs) {
            element.on('click', function() {
                scope.sideMenuController.toggleLeft();
            });
        }
    }
});