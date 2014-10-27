'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('Geosales', ['ionic', 'config'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "tabs.html"
    })
    .state('tabs.inicio', {
      url: "/inicio",
      views: {
        'inicio-tab': {
          templateUrl: "inicio.html",
          controller: 'InicioTabCtrl'
        }
      }
    })
    .state('tabs.clientes', {
      url: "/clientes",
      views: {
        'clientes-tab': {
          templateUrl: "clientes.html"
        }
      }
    })
    .state('tabs.pendientes', {
      url: "/pendientes",
      views: {
        'pendientes-tab': {
          templateUrl: "pendientes.html"
        }
      }
    })
    .state('tabs.rutas', {
      url: "/rutas",
      views: {
        'rutas-tab': {
          templateUrl: "rutas.html"
        }
      }
    })
    .state('tabs.estadisticas', {
      url: "/estadisticas",
      views: {
        'estadisticas-tab': {
          templateUrl: "estadisticas.html"
        }
      }
    })
    .state('configuracion', {
      url: '/configuracion',
      templateUrl: 'configuracion.html'
    });


   $urlRouterProvider.otherwise("/tab/inicio");

})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});
