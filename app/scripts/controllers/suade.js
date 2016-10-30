'use strict';
// Microdata Reducer by Nandor Persanyi
/**
 * @ngdoc function
 * @name suadeApp.controller:SuadeController
 * @description
 * # LondonController
 * Controller of the suadeApp
 */
angular.module('suadeApp')
.controller('SuadeController', function ($rootScope,$scope) {
    $scope.chart = [];
    $scope.dataTable = [];

    $rootScope.dataMeta.identifiers.forEach(function(elem,index){
        $scope.chart[index] = {
            charttype: 'bar',
            chartid:'#chart' + index,
            chartkey:elem,
            xscale:'ordinal',
            xscalesort:null,
            xscaledomain:null,
            centerbar:null,
            event:'postRedraw',
            eventfunc:null,
            ticknum:null,
            tickswitchfunc:null,
            positionlabel:true,
            switchtitle:null,
            width:525,
            height:250
        };
    });

    $rootScope.dataMeta.identifiers.forEach(function(elem,index){
        $scope.dataTable[index] = {
            charttype: 'table',
            chartid:'#data-table' + index,
            chartkey:elem,
            xscale:null,
            xscalesort:null,
            xscaledomain:null,
            centerbar:null,
            event:null,
            eventfunc:null,
            ticknum:null,
            tickswitchfunc:null,
            positionlabel:null,
            switchtitle:null,
            width:525,
            height:250
        };
    });
});
