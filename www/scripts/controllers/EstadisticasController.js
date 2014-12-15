'use strict';

angular.module('Geosales')
  .controller('EstadisticasController', ['$scope', '$ionicLoading', 
    function ContentCtrl($scope, $ionicLoading) {

    $scope.showLoading = function() {
        $ionicLoading.show({template: 'Cargando...'});
    };

    $scope.hideLoading = function() {
        $ionicLoading.hide();
    };

    $scope.reporte = {usoSistema:false, clientesMorosos:false, clientesAlDia:false, todosClientes:false};

    $scope.clientes = [];
    $scope.clientesPendientes = [];
    $scope.clientesAlDia = [];
    $scope.emailBody = "";
    var emailSubject = "Reporte Geo-Sales";
    
    $scope.generarReporte = function(){
        $scope.emailBody = "Reporte de sistema Geo-Sales generado a la fecha " + $scope.getFecha(new Date()) + ".";
        var emailSubject = "Reporte Geo-Sales";
  
        // if($scope.reporte.usoGeneral){
        //     $scope.obtenerDatosSistema();
        // }else 
        $scope.showLoading();

        if($scope.reporte.todosClientes){        
            $scope.obtenerTodosClientes();
        }else if($scope.reporte.clientesMorosos){            
            $scope.obtenerClientesMorosos();
        }else if($scope.reporte.clientesAlDia){
            $scope.obtenerClientesAlDia();            
        }

        //enviarCorreo(emailBody, emailSubject, "beto.ldas@gmail.com");
    }
    $scope.getFecha = function(date){
        var fecha = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
        return fecha;
    }
    $scope.obtenerDatosSistema = function(){
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

                var creditCounter = 0;
                var Client = Parse.Object.extend('clients');
                var queryCli = new Parse.Query(Client);
                queryCli.include('credits');
                queryCli.equalTo('user', Parse.User._currentUser);
                queryCli.find({
                    success: function(resulClients) {
                        for (var i = 0; i < resulClients.length; i++) {
                            var Credit = Parse.Object.extend('credits');
                            var queryCre = new Parse.Query(Credit);
                            queryCre.equalTo('client', resulClients[i].get('objectId'));
                            queryCre.find({
                                success: function(resulCredits){
                                    var d = new Date();
                                    d.setDate(d.getDate()-15);
                                    //var limitDate = Date.today().add({days:-30});
                                    for (var k = 0; k < resulCredits.length; k++) {
                                        if(d < resulCredits[k].get('createdAt')){
                                            creditCounter ++;
                                        };
                                    }
                                    $scope.emailBody += "\n\n"
                                    $scope.emailBody = "- Reporte de sistema:\n";            
                                    $scope.emailBody += "   - Cantidad de clientes: " + $scope.clientes.length + "\n";
                                    $scope.emailBody += "   - Cantidad de compras en los últimos 30 días: " + creditCounter + "\n";
                                    
                                    // Llamar a las funciones para generar los demas reportes
                                    if ($scope.reporte.clientesTodos)
                                    {
                                        $scope.obtenerTodosClientes();
                                    }
                                    else if($scope.reporte.clientesMorosos)
                                    {
                                        $scope.obtenerClientesMorosos();
                                    }
                                    else if($scope.reporte.aldia)
                                    {
                                        $scope.obtenerClientesAlDia();
                                    }
                                    else
                                    {
                                        $scope.hideLoading();
                                        enviarCorreo($scope.emailBody, emailSubject, "beto.ldas@gmail.com");
                                    }                            
                                }
                            },{
                                error: function(error) {
                                console.log('Hubo un error con la conexion.');
                                }
                            })
                        };
                    }
                },{
                    error: function(error) {
                        console.log('Hubo un error con la conexion.');
                    }
                });
            }
        },{
            error: function(error) {
                console.log('Hubo un error con la conexion.');
            }
        });
    }
    $scope.obtenerTodosClientes = function(){
        if ($scope.clientes.length > 0) 
        {
            $scope.emailBody += "\n\n"
            $scope.emailBody += "- Clientes creados:\n";
            if ($scope.clientes.length > 0){
                for(var i = 0; i < $scope.clientes.length; i++){
                    $scope.emailBody += "   " + (i + 1) + " - " + $scope.clientes[i].name + " " + $scope.clientes[i].lastName + "\n";
                }                
            }else{
                $scope.emailBody += "   - No hay clientes en el sistema. \n";
            }
            // Llamar a las funciones para generar los demas reportes
            if($scope.reporte.clientesAlDia)
            {
                $scope.obtenerClientesAlDia();
            }
            else if($scope.reporte.clientesMorosos)
            {
                $scope.obtenerClientesMorosos();
            }
            else
            {
                $scope.hideLoading();
                enviarCorreo($scope.emailBody, emailSubject, "beto.ldas@gmail.com");
            }
        }
        else
        {
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
                    $scope.emailBody += "\n\n"
                    $scope.emailBody += "- Clientes creados:\n";
                    if ($scope.clientes.length > 0){
                        for(var i = 0; i < $scope.clientes.length; i++){
                            $scope.emailBody += "   " + (i + 1) + " - " + $scope.clientes[i].name + " " + $scope.clientes[i].lastName + "\n";
                        }                
                    }else{
                        $scope.emailBody += "   - No hay clientes en el sistema. \n";
                    }
                    // Llamar a las funciones para generar los demas reportes
                    if($scope.reporte.clientesAlDia)
                    {
                        $scope.obtenerClientesAlDia();
                    }
                    else if($scope.reporte.clientesMorosos)
                    {
                        $scope.obtenerClientesMorosos();
                    }
                    else
                    {
                        $scope.hideLoading();
                        enviarCorreo($scope.emailBody, emailSubject, "beto.ldas@gmail.com");
                    }
                    //$scope.$apply();
                }
            },{
                error: function(error) {
                    console.log('Hubo un error con la conexion.');
                }
            });
        }
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
                $scope.emailBody += "\n\n";
                $scope.emailBody += "- Clientes morosos:\n";
                
                if ($scope.clientesPendientes.length > 0){
                    for(var i = 0; i < $scope.clientesPendientes.length; i++){
                        $scope.emailBody += "   " + (i + 1) + " - " + $scope.clientesPendientes[i].name + " " + $scope.clientesPendientes[i].lastName + "\n";
                    }                
                }else{
                    $scope.emailBody += "   - No hay clientes morosos en el sistema.\n";
                }
                // Llamar a las funciones para generar los demas reportes
                $scope.hideLoading();
                enviarCorreo($scope.emailBody, emailSubject, "beto.ldas@gmail.com");
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
                $scope.emailBody += "\n\n";
                $scope.emailBody += "- Clientes al día:\n";
                
                
                if ($scope.clientesAlDia.length > 0){
                    for(var i = 0; i < $scope.clientesAlDia.length; i++){
                        $scope.emailBody += "   " + (i + 1) + " - " + $scope.clientesAlDia[i].name + " " + $scope.clientesAlDia[i].lastName + "\n";
                    }
                }else{
                    $scope.emailBody += "   - No hay clientes al día en el sistema.\n";
                }
                
                if($scope.reporte.clientesMorosos)
                {
                    $scope.obtenerClientesMorosos();
                }
                else
                {
                    $scope.hideLoading();
                    enviarCorreo($scope.emailBody, emailSubject, "beto.ldas@gmail.com");
                }                

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
    function enviarCorreo(body, subject, toUser){
    
    body += "\n\n";
    body += "- Geo-Sales app -";

    var link = "mailto:" + toUser
             + "?subject=" + escape(subject)
             + "&body=" + escape(body)
    ;
    
    window.open(link, '_system', 'location=yes');
    return false;
    
    // window.location.href = link;
    // if(window.plugins && window.plugins.emailComposer) {
    //         window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
    //             console.log("Response -> " + result);
    //         },
    //         subject, // Subject
    //         body,                      // Body
    //         [toUser],    // To
    //         null,                    // CC
    //         null,                    // BCC
    //         false,                   // isHTML
    //         null,                    // Attachments
    //         null);                   // Attachment Data
    //     }
  };
    
}]);