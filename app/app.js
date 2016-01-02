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
        templateUrl: 'auth/login.html',
        resolve: {
          requireNoAuth: requireNoAuth
        },
        controller: 'AuthCtrl as authCtrl'
      })
      .state('register', {
        url: '/register',
        templateUrl: 'auth/register.html',
        resolve: {
          requireNoAuth: requireNoAuth
        },
        controller: 'AuthCtrl as authCtrl'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'users/profile.html',
        //resolve these dependencies before the controller instanciates
        resolve: {
          //if user is not authenticated, redirect them to home
          auth: function($state, Users, Auth) {
            return Auth.$requireAuth().catch(function() {
              $state.go('home');
            });
          },
          //authenticate user, then load their profile
          profile: function(Users, Auth) {
            return Auth.$requireAuth().then(function(auth) {
              return Users.getProfile(auth.uid).$loaded();
            });
          }
        },
        controller: 'ProfileCtrl as profileCtrl'
      });

    $urlRouterProvider.otherwise('/');
  })
  .constant('FirebaseUrl', 'https://zslack.firebaseio.com/');
