'use strict';
// Microdata Reducer by Nandor Persanyi
/**
 * @ngdoc function
 * @name suadeApp.controller:DashboardController
 * @description
 * # DashboardController
 * Controller of the suadeApp
 */
angular.module('suadeApp')
.controller('DashboardController', function ($scope,$rootScope,$state,Upload,Papa) {
	$rootScope.dataMeta = {};
	// upload on file select or drop
    $scope.upload = function (file) {
    	Papa.parse(file, {
    		header: true,
			complete: function(results) {
				$rootScope.dataMeta.identifiers = Object.keys(results.data[0]);
				$rootScope.dataMeta.crossFilterData = crossfilter(results.data);
				if($rootScope.dataMeta.crossFilterData !== undefined)
					$state.go("suade");
			}
		});
    };
});
