angular
  .module('angularfireSlackApp')
  .controller('MessagesCtrl', [
    'profile', 'channelName', 'messages',
    function(profile, channelName, messages) {
      'use strict';

      var messagesCtrl = this;

      messagesCtrl.messages = messages;
      messagesCtrl.channelName = channelName;
      messagesCtrl.message = '';

      messagesCtrl.sendMessage = function() {
        if (messagesCtrl.message.length > 0) {
          messagesCtrl.messages.$add({
            profileId: profile.$id,
            body: messagesCtrl.message,
            timestamp: Firebase.ServerValue.TIMESTAMP
          }).then(function() {
            messagesCtrl.message = '';
          });
        }
      };
      
    }
  ]
);