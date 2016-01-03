angular
  .module('angularfireSlackApp')
  .controller('AuthCtrl',
    ['Auth', '$state',
      function(Auth, $state) {
        'use strict';

        var authCtrl = this;

        authCtrl.user = {
          email: '',
          password: ''
        };

        authCtrl.login = function() {
          Auth.$authWithPassword(authCtrl.user)
            .then(
              function(auth) {  //jshint ignore:line
                $state.go('home');
              },
              function(error) {
                authCtrl.error = error;
              }
            );
        };

        authCtrl.register = function() {
          Auth.$createUser(authCtrl.user)
            .then(
              function(user) {  //jshint ignore:line
                authCtrl.login();
              },
              function(error) {
                authCtrl.error = error;
              }
            );
        };

      }
    ]
  );
