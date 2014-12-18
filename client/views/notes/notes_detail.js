(function(){
  'use strict';

  angular.module('evernode2')
  .controller('NotesDetailCtrl', ['$scope', '$state', 'Note', function($scope, $state, Note){
    $scope.moment = moment;

    Note.show($state.params.noteId).then(function(response){
      $scope.note = response.data;
    });

  }]);
})();
