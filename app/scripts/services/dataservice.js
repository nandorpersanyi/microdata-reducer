'use strict';
// Microdata Reducer by Nandor Persanyi
/**
* @ngdoc function
* @name suadeApp.service:dataService
* @description
* # dataService
* Directive of the suadeApp
*/
angular.module('suadeApp')
.factory('dataService', ['$http','$state','authService','$cookieStore', function($http,$state,authService,$cookieStore){
    var dataService={};
    dataService.getData = function(filename){
        return $http.get(filename)
        .then(function(response){
            return response.data;
        },function error(msg) {
            authService.user=undefined;
            $cookieStore.remove('londoncrime-dashboard-user');
            sessionStorage.clear();
            $state.go("login");
        });
    };
    return dataService;
}])