(function(){
  'use strict';

  angular.module('evernode')
    .controller('NotesShowCtrl', ['$scope', '$state', 'Note', function($scope, $state, Note){

      Note.findOne($state.params.noteId).then(function(response){
        console.log('CLIENT SHOW CTRL - note.findOne response: ', response);
        $scope.note = response.data[0];
        console.log('CLIENT SHOW CTRL - note.findOne $scope.note = ', response.data);
      });

      $scope.nuke = function(noteId){
        Note.nuke(noteId).then(function(response){
        $state.reload();
        });
      };
    }]);
})();
