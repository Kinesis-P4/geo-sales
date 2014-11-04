'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('Geosales', ['ionic', 'config'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('tabs', {
      url: '/tab',
      abstract: true,
      templateUrl: 'tabs.html'
    })
    .state('tabs.inicio', {
      url: '/inicio',
      views: {
        'inicio-tab': {
          templateUrl: 'views/inicio.html',
          controller: 'InicioTabCtrl'
        }
      }
    })
    .state('tabs.clientes', {
      url: '/clientes',
      views: {
        'clientes-tab': {
          templateUrl: 'views/clientes.html',
          controller: 'ClientesController'
        }
      }
    })
    .state('tabs.cliente', {
      url: '/cliente/:id',
      views: {
        'clientes-tab': {
          templateUrl: 'views/cliente.html',
          controller: 'ClienteController'
        }
      }
    })
    .state('tabs.nuevo-cliente', {
      url: '/nuevo-cliente',
      views: {
        'clientes-tab': {
          templateUrl: 'views/nuevo-cliente.html',
          controller: 'ClienteController'
        }
      }
    })
    .state('tabs.agregar-credito', {
      url: '/cliente/:id/agregar-credito',
      views: {
        'clientes-tab': {
          templateUrl: 'views/agregar-credito.html',
          controller: 'AgregarCreditoController'
        }
      }
    })
    .state('tabs.pendientes', {
      url: '/pendientes',
      views: {
        'pendientes-tab': {
          templateUrl: 'views/pendientes.html'
        }
      }
    })
    .state('tabs.rutas', {
      url: '/rutas',
      views: {
        'rutas-tab': {
          templateUrl: 'views/rutas.html'
        }
      }
    })
    .state('tabs.estadisticas', {
      url: '/estadisticas',
      views: {
        'estadisticas-tab': {
          templateUrl: 'views/estadisticas.html'
        }
      }
    })
    .state('configuracion', {
      url: '/configuracion',
      templateUrl: 'views/configuracion.html'
    });


   $urlRouterProvider.otherwise('/tab/inicio');

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
})
.value('PARSE_CREDENTIALS',{
    APP_ID: 'MUkgfgcgeyIgpWaRU8AvHhBBI8eNKmvS9C4UBDZS',
    REST_API_KEY:'QWG8BMqxCIOarVhALZSa9xj5Y6aXZRs0N5lv14RK'
});
