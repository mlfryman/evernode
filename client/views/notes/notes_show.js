(function(){
  'use strict';

  angular.module('evernode')
  .controller('NotesShowCtrl', ['$scope', '$state', 'Note', function($scope, $state, Note){
    $scope.moment = moment;

    Note.show($state.params.noteId).then(function(response){
      $scope.note = response.data;
    });

    $scope.nuke = function(note){
      Note.nuke(note).then(function(response){
        $state.go('notes.index');
        // $state.reload();
      });
    };
  }]);
})();
