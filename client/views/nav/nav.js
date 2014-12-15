(function(){
  'use strict';

  angular.module('hapi-auth')
    .controller('NavCtrl', ['$rootScope', '$scope', '$state', 'User', function($rootScope, $scope, $state, User){
      $scope.logout = function(){
        User.logout().then(function(){
          $rootScope.rootuser = null;
          $state.go('home');
        });
      };
    }]);
})();
