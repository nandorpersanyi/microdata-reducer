'use strict';
// Microdata Reducer by Nandor Persanyi
/**
 * @ngdoc overview
 * @name suadeApp
 * @description
 * # suadeApp
 *
 * Main module of the application.
 */
angular
.module('suadeApp', [
    'ui.router',
    'ngResource',
    'ngTouch',
    'ngFileUpload',
    'ngPapaParse'
])
.run(function($rootScope, $state) {
    $rootScope.$state = $state;
})
.config(function ($stateProvider,$urlRouterProvider) {
    $stateProvider
    .state('dashboard', {
        url: '/',
        controller: 'DashboardController',
        templateUrl: 'views/dashboard.html'
    })
        .state('suade', {
        parent: 'dashboard',
        url: 'suade',
        controller: 'SuadeController',
        templateUrl: 'views/suade.html',
        })
    $urlRouterProvider.otherwise('/');
});
