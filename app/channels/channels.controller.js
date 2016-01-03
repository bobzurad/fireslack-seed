angular
  .module('angularfireSlackApp')
  .controller('ChannelsCtrl',
    ['$state', 'Auth', 'Users', 'channels', 'profile',
      function($state, Auth, Users, channels, profile) {
          'use strict';

          var channelsCtrl = this;

          channelsCtrl.channels = channels;
          channelsCtrl.profile = profile;
          channelsCtrl.getDisplayName = Users.getDisplayName;
          channelsCtrl.getGravatar = Users.getGravatar;

          channelsCtrl.logout = function() {
            Auth.$unauth();
            $state.go('home');
          };

          channelsCtrl.newChannel = {
            name: ''
          };

          channelsCtrl.createChannel = function() {
            //clear out new channel name after adding new one
            channelsCtrl.channels.$add(channelsCtrl.newChannel).then(
              function() {
                channelsCtrl.newChannel = {
                  name: ''
                };
              }
            );
          };

      }
    ]
  );
