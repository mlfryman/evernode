// (function(){
//   'use strict';
//
//   angular.module('evernode')
//   .controller('NotesCtrl', ['$rootScope', '$scope', '$state', 'Note', function($rootScope, $scope, $state, Note){
//     $scope.note = {};
//
//     function getRecent(){
//       Note.recent().then(function(response){
//         $scope.notes = response.data.notes;
//       });
//     }
//
//     getRecent();
//
//     $scope.create = function(note){
//       Note.create(note).then(function(response){
//         $scope.note = {};
//         getRecent();
//       });
//     };
//   }]);
// })();
