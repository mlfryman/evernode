(function(){
  'use strict';

  angular.module('evernode')
    .factory('Note', ['$http', '$upload', function($http, $upload){
      function create(note, files){
        var noteData = {
            url: '/notes',
            method: 'POST',
            data: note,
            file: files,
            // this links to (ng-file-model='photos') in the newNoteForm
            fileFormDataName: 'photos'
        };

        return $upload.upload(noteData);
      }

      // set default limit, offset, & filter values
      function query(limit, offset, filter){
        limit  = limit  || 10;
        offset = offset || 0;
        filter = filter || '';

        return $http.get('/notes?limit=' + limit + '&offset=' + offset + '&filter=' + filter);
      }

      function findOne(noteId){
        return $http.get('/notes/' + noteId);
      }

      return {create:create, query:query, findOne:findOne};
    }]);
})();
