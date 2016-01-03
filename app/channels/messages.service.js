angular
  .module('angularfireSlackApp')
  .factory('Messages',
    ['$firebaseArray', 'FirebaseUrl',
      function($firebaseArray, FirebaseUrl) {
        'use strict';

        var channelMessagesRef = new Firebase(FirebaseUrl + 'channelMessages');

        return {
          forChannel: function(channelId) {
            return $firebaseArray(channelMessagesRef.child(channelId));
          }
        };
      }
    ]
  );
