'use strict';

angular.module('Geosales')
  .controller('PendientesController', ['$scope', 'ClientesServices', '$stateParams', 
    function ContentCtrl($scope, ClientesServices, $stateParams) {
	
  	$scope.clientes = [];

    $scope.$on('$viewContentLoaded', function(){
        $scope.updateClientesPendientes();
    });

    $scope.updateClientesPendientes = function() {

        var Client = Parse.Object.extend('clients');
        var query = new Parse.Query(Client);
        var clientsResults = [];
        var limitDate = new Date().getTime();
        limitDate -= (Parse.User._currentUser.get('collectFrequency')*24*60*60*1000);

        query.equalTo('user', Parse.User._currentUser);
        query.find({
            success: function(results) {
                $scope.clientes = [];
                for (var i = 0; i < results.length; i++) {
                    if(limitDate > results[i].get('lastCollectDate').getTime()){
                        results[i].attributes.id = results[i].id;
                        $scope.clientes.push(results[i].attributes);
                    }
                };
                $scope.$apply();
            }
        },{
            error: function(error) {
                console.log('Hubo un error con la conexion.');
            }
        });
    };

    $scope.updateClientesPendientes();
    
}]);