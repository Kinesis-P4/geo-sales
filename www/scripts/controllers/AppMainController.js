'use strict';

angular.module('Geosales')
.controller('AppMainController', function($scope) {
  ionic.Platform.ready(function() {
    ionic.Platform.fullScreen();
    // document.body.classList.add('platform-ios7');
    // document.body.classList.add('status-bar-hide');
    //.platform-ios7.status-bar-hide
  });
});