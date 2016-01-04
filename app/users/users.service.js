angular
  .module('angularfireSlackApp')
  .factory('Users',
    ['$firebaseArray', '$firebaseObject', 'FirebaseUrl',
      function($firebaseArray, $firebaseObject, FirebaseUrl) {
        'use strict';

        var usersRef = new Firebase(FirebaseUrl + 'users');
        var users = $firebaseArray(usersRef);

        var Users = {
          all: users,
          getProfile: function(uid) {
            return $firebaseObject(usersRef.child(uid));
          },
          getDisplayName: function(uid) {
            return users.$getRecord(uid).displayName;
          },
          getGravatar: function(uid) {
            return '//www.gravatar.com/avatar/' + users.$getRecord(uid).emailHash;
          }
        };

        return Users;
      }
    ]
  );
