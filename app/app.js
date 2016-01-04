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
      //home page
      .state('home', {
        url: '/',
        templateUrl: 'home/home.html',
        resolve: {
          requireNoAuth: function($state, Auth) {
            //if user is authenticted, send them to channels page
            return Auth.$requireAuth().then(
              function(auth) {  //jshint ignore:line
                $state.go('channels');
              },
              function(error) { //jshint ignore:line
                return;
              }
            );
          }
        }
      })
      //login page
      .state('login', {
        url: '/login',
        templateUrl: 'auth/login.html',
        resolve: {
          requireNoAuth: requireNoAuth
        },
        controller: 'AuthCtrl as authCtrl'
      })
      //registration page
      .state('register', {
        url: '/register',
        templateUrl: 'auth/register.html',
        resolve: {
          requireNoAuth: requireNoAuth
        },
        controller: 'AuthCtrl as authCtrl'
      })
      //profile page
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
      })
      //channels page
      .state('channels', {
        url: '/channels',
        templateUrl: 'channels/index.html',
        resolve: {
          channels: function(Channels) {
            return Channels.$loaded();
          },
          profile: function($state, Auth, Users) {
            return Auth.$requireAuth().then(
              function(auth) {
                //user is authenticated, get profile
                return Users.getProfile(auth.uid).$loaded().then(
                  function(profile) {
                    //if user has no displayName, send them to profile page
                    if (profile.displayName) {
                      return profile;
                    } else {
                      $state.go('profile');
                    }
                  },
                  function(error) {}  //jshint ignore:line
                );
              },
              function(error) { //jshint ignore:line
                //user is not authenticted, go home
                $state.go('home');
              }
            );
          }
        },
        controller: 'ChannelsCtrl as channelsCtrl'
      })
      //create channel page
      .state('channels.create', {
        url: '/create',
        templateUrl: 'channels/create.html',
        controller: 'ChannelsCtrl as channelsCtrl'
      })
      //channel messages page
      .state('channels.messages', {
        url: '/{channelId}/messages',
        templateUrl: 'channels/messages.html',
        resolve: {
          messages: function($stateParams, Messages) {
            return Messages.forChannel($stateParams.channelId).$loaded();
          },
          channelName: function($stateParams, channels) {
            return '#' + channels.$getRecord($stateParams.channelId).name;
          }
        },
        controller: 'MessagesCtrl as messagesCtrl'
      })
      //direct messages page
      .state('channels.direct', {
        url: '/{uid}/messages/direct',
        templateUrl: 'channels/messages.html',
        resolve: {
          messages: function($stateParams, Messages, profile) {
            return Messages.forUsers($stateParams.uid, profile.$id).$loaded();
          },
          channelName: function($stateParams, Users) {
            return Users.all.$loaded().then(function() {
              return '@' + Users.getDisplayName($stateParams.uid);
            });
          }
        },
        controller: 'MessagesCtrl as messagesCtrl'
      });

    $urlRouterProvider.otherwise('/');
  })
  .constant('FirebaseUrl', 'https://zslack.firebaseio.com/');
