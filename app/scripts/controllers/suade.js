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

    $rootScope.dataMeta.identifiers.forEach(function(elem,index){
        var chartId = 'chart' + index;
        $scope[chartId] = {
            charttype: 'bar',
            chartid:'#' + chartId,
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
            switchtitle:null
        };
    });

    $rootScope.dataMeta.identifiers.forEach(function(elem,index){
        var chartId = 'dataTable' + index;
        $scope[chartId] = {
            charttype: 'table',
            chartid:'#' + chartId,
            chartkey:$rootScope.dataMeta.identifiers[index],
            xscale:null,
            xscalesort:null,
            xscaledomain:null,
            centerbar:null,
            event:null,
            eventfunc:null,
            ticknum:null,
            tickswitchfunc:null,
            positionlabel:null,
            switchtitle:null
        };
    });
});
