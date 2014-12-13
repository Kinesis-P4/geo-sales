'use strict';

angular.module('Geosales')
  .controller('EstadisticasController', ['$scope', function ContentCtrl($scope) {
    $scope.reporte = {usoSistema:false, clientesMorosos:false, clientesAlDia:false, todosClientes:false};
    $scope.generarReporte = function(){
        var emailBody = null;
        var emailSubject = "Reporte de clientes";
  
        $scope.obtenerTodosClientes();
         if($scope.reporte.usoGeneral){
            emailBody = "<p>Reporte de sistema:</p>";            
            emailBody += "<p>Cantidad de clientes: " + $scope.clientes.length + "</p>";
        //     emailBody += obtenerCantidadTotalVentas();
        //     emailBody += obtenerCantidadClientesSaldoPendiente()

        }
        if($scope.reporte.clientesTodos){
            emailBody += "<br>";
            emailBody += "<p>Clientes creados:</p>";
            if ($scope.clientes.length > 0){
                emailBody += "<table>";
                for(var i = 0; i < $scope.clientes.length; i++){
                    emailBody += "<tr><td>" + (i + 1) + "</td><td>" + $scope.clientes[i].name + " " + $scope.clientes[i].lastName + "</td></tr>";
                }                
                emailBody += "</table>";
            }else{
                emailBody += "<p>No hay clientes en el sistema.</p>";
            }
        }
        if($scope.reporte.morosos){
            emailBody += "<br>";
            emailBody += "<p>Clientes morosos:</p>";
            $scope.obtenerClientesMorosos();
            if ($scope.clientesPendientes.length > 0){
                emailBody += "<table>";
                for(var i = 0; i < $scope.clientesPendientes.length; i++){
                    emailBody += "<tr><td>" + (i + 1) + "</td><td>" + $scope.clientesPendientes[i].name + " " + $scope.clientesPendientes[i].lastName + "</td></tr>";
                }                
                emailBody += "</table>";
            }else{
                emailBody += "<p>No hay clientes morosos en el sistema.</p>";
            }
            
        }
        if($scope.reporte.aldia){
            emailBody += "<br>";
            emailBody += "<p>Clientes al día:</p>";
            
            $scope.obtenerClientesAlDia();
            if ($scope.clientesAlDia.length > 0){
                emailBody += "<table>";
                for(var i = 0; i < $scope.clientesAlDia.length; i++){
                    emailBody += "<tr><td>" + (i + 1) + "</td><td>" + $scope.clientesAlDia[i].name + " " + $scope.clientesAlDia[i].lastName + "</td></tr>";
                }                
                emailBody += "</table>";
            }else{
                emailBody += "<p>No hay clientes al día en el sistema.</p>";
            }
            
        }

        enviarCorreo(emailBody, emailSubject, "ljblanco@gmail.com");
    }

    $scope.clientes = [];
    $scope.clientesPendientes = [];
    $scope.clientesAlDia = [];

    $scope.obtenerTodosClientes = function(){
        var Client = Parse.Object.extend('clients');
        var query = new Parse.Query(Client);
        var clientsResults = [];

        query.equalTo('user', Parse.User._currentUser);
        query.ascending('name');
        query.find({
            success: function(results) {
                $scope.clientes = [];
                for (var i = 0; i < results.length; i++) {
                    results[i].attributes.id = results[i].id;
                    $scope.clientes.push(results[i].attributes);
                };
                //$scope.$apply();
            }
        },{
            error: function(error) {
                console.log('Hubo un error con la conexion.');
            }
        });
    }
    function obtenerCantidadVentasUltimos30Dias()
    {
        return 0;
    }
    function obtenerCantidadTotalVentas()
    {
        return 0;
    }
    function obtenerCantidadClientesSaldoPendiente()
    {
        return 0;
    }
    $scope.obtenerClientesMorosos = function()
    {
        var Client = Parse.Object.extend('clients');
        var query = new Parse.Query(Client);
        var clientsResults = [];
        var limitDate = new Date().getTime();
        limitDate -= (Parse.User._currentUser.get('collectFrequency')*24*60*60*1000);

        query.equalTo('user', Parse.User._currentUser);
        query.find({
            success: function(results) {
                $scope.clientesPendientes = [];

                for (var i = 0; i < results.length; i++) {

                    if(limitDate > results[i].get('lastCollectDate').getTime()) {
                        results[i].attributes.id = results[i].id;
                        $scope.clientesPendientes.push(results[i].attributes);
                    }
                };
            }
        },{
            error: function(error) {
                console.log('Hubo un error con la conexion.');
            }
        });
    }
    $scope.obtenerClientesAlDia = function()
    {
        var Client = Parse.Object.extend('clients');
        var query = new Parse.Query(Client);
        var clientsResults = [];
        var limitDate = new Date().getTime();
        limitDate -= (Parse.User._currentUser.get('collectFrequency')*24*60*60*1000);

        query.equalTo('user', Parse.User._currentUser);
        query.find({
            success: function(results) {
                
                $scope.clientesAldia = [];

                for (var i = 0; i < results.length; i++) {
                    if(limitDate <= results[i].get('lastCollectDate').getTime()) {
                        results[i].attributes.id = results[i].id;
                        $scope.clientesAlDia.push(results[i].attributes);
                    }

                };
            }
        },{
            error: function(error) {
                console.log('Hubo un error con la conexion.');
            }
        });
    }
    function clientesSinCompras30Dias()
    {
        var Client = Parse.Object.extend('creditLines');
        var query = new Parse.Query(Client);
        query.greaterThan("createdAt", "");
        var clientsResults = [];
        var limitDate = new Date().getTime();
        limitDate -= (Parse.User._currentUser.get('collectFrequency')*24*60*60*1000);
        var clientesPendientes = [];

        query.equalTo('user', Parse.User._currentUser);
        query.find({
            success: function(results) {
                
                $scope.clientes = [];
                $scope.clientesPendientes = [];
                $scope.clientesAldia = [];

                for (var i = 0; i < results.length; i++) {

                    if(limitDate > results[i].get('lastCollectDate').getTime()) {
                        results[i].attributes.id = results[i].id;
                        clientesPendientes.push(results[i].attributes);
                    }

                    if(limitDate <= results[i].get('lastCollectDate').getTime()) {
                        results[i].attributes.id = results[i].id;
                        clientesAldia.push(results[i].attributes);
                    }

                };
                
                //$scope.$apply();
            }
        },{
            error: function(error) {
                console.log('Hubo un error con la conexion.');
            }
        });
        return 0;
    }
    function obtenerClientesSinCompras6Meses()
    {
        return 0;
    }
    function enviarCorreo(subject, body, toUser){
    
    
    if(window.plugins && window.plugins.emailComposer) {
            window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
                console.log("Response -> " + result);
            },
            subject, // Subject
            body,                      // Body
            [toUser],    // To
            null,                    // CC
            null,                    // BCC
            true,                   // isHTML
            null,                    // Attachments
            null);                   // Attachment Data
        }
  };
    
}]);