'use strict';

/**
 * @ngdoc overview
 * @name angularfireSlackApp
 * @description
 * # angularfireSlackApp
 *
 * Main module of the application.
 */

//Helper function:
//for use with pages where authentication is not required.
//if user is authenticted, redirect them to home.
//else silent fail on authenication and display page.
var requireNoAuth = function($state, Auth) {
  return Auth.$requireAuth()
    .then(
      function(auth) {  //jshint ignore:line
        $state.go('home');
      },
      function(error) { //jshint ignore:line
        return;
      }
    );
};

//Main angular init
angular
  .module('angularfireSlackApp', [
    'firebase',
    'angular-md5',
    'ui.router'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'home/home.html'
      })
      .state('login', {
        url: '/login',
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'auth/login.html',
        resolve: {
          requireNoAuth: requireNoAuth
        }
      })
      .state('register', {
        url: '/register',
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'auth/register.html',
        resolve: {
          requireNoAuth: requireNoAuth
        }
      });

    $urlRouterProvider.otherwise('/');
  })
  .constant('FirebaseUrl', 'https://zslack.firebaseio.com/');
