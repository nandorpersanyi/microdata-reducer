'use strict';
// Microdata Reducer by Nandor Persanyi
/**
 * @ngdoc function
 * @name suadeApp.directive:pageLoading
 * @description
 * # pageLoading
 * Directive of the suadeApp
 */
angular.module('suadeApp')
.directive('pageLoading', function ($rootScope) {
	return {
		restrict: 'E',
		scope: true,
		link: function (scope, elem, attrs) {
			$rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
				elem.removeClass("pageloaded");
			});
			$rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {
				elem.addClass("pageloaded");
			});
		}
	}
})