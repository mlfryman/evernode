(function(){
  'use strict';

  angular.module('evernode')
    .controller('NotesIndexCtrl', ['$scope', '$state', 'Note', function($scope, $state, Note){
      $scope.notes = [];

      getNotes();

      $scope.create = function(note){
        console.log('CLIENT INDEX CTRL - Note.create $scope.photos: ', $scope.photos);

        Note.create(note, $scope.photos).then(function(response){
          console.log('CLIENT INDEX CTRL - Note.create response: ', response);
          $scope.photos = undefined;
          // clears newNoteForm
          $scope.note = {};
          // retrieves recent notes
          getNotes();
        }, function(response){
          console.log('CLIENT INDEX CTRL - Note.create new note obj: ', response);
        });
      };

      $scope.viewNote = function(noteId){
        console.log('CLIENT INDEX CTRL - viewNote noteId: ', noteId);
        $state.go('notes.show', {noteId:noteId});
      };

      function getNotes(limit, offset, filter){
        console.log('CLIENT INDEX CTRL - getNotes [limit, offset, filter]: ', limit, offset, filter);
        Note.query(limit, offset, filter).then(function(response){
          console.log('CLIENT INDEX CTRL - getNotes query response: ', response);
          $scope.notes = response.data;
          console.log('CLIENT INDEX CTRL - getNotes $scope.notes = ', response.data);
        });
      }
    }]);
})();
