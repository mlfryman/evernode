(function(){
  'use strict';

  angular.module('evernode')
  .controller('NotesIndexCtrl', ['$scope', '$state', 'Note', function($scope, $state, Note){
    $scope.files = [];
    $scope.count = 0;
    $scope.pages = 0;
    $scope._ = _;

    Note.query($state.params.tag || '%', $state.params.page * 1 || 0).then(function(response){
      $scope.notes = response.data.notes;
    });

    Note.count().then(function(response){
      $scope.total = response.data.count * 1;
      $scope.pages = Math.ceil($scope.total / 5);
    });

    $scope.isCurrent = function(page){
      return page === $state.params.page * 1;
    };

    $scope.create = function(note){
      console.log('CLIENT INDEX MODEL - note.create 1: ', note);
      $scope.count = 0;
      Note.create(note).then(function(response){
      console.log('CLIENT INDEX MODEL - note.create 2: ', note);
        $scope.note = {};
        debugger;
        Note.upload(response.data.noteId, $scope.files);
      });
    };

    $scope.$on('upload', function(e, count){
      console.log('CLIENT INDEX MODEL - file upload @params(e, count): ', e, count);
      $scope.count = count;
      if($scope.count === $scope.files.length){
        $state.reload();
      }
    });
  }]);
})();
