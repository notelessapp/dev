angular.module('starter')
//This will provide the user with a token
.service('NoteService', function($q, $http, API_ENDPOINT) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var isAuthenticated = false;
  var authToken;

  var createNote = function(note) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/notes', note).then(function(result) {
        if (result.data.success) {
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };

  var updateNote = function(noteid, note) {
    return $q(function(resolve, reject) {

      $http.put(API_ENDPOINT.url + '/notes/'+ noteid, note).then(function(result) {
        if (result.data.success) {
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };



  var deleteNote = function(note) {
    return $q(function(resolve, reject) {
      $http.delete(API_ENDPOINT.url + '/notes/'+ note).then(function(result) {
        if (result.data.success) {
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };

  var shareNote = function(noteId, shared) {
    return $q(function(resolve, reject) {
      console.log("noteId", noteId);
      console.log("shared", shared);

      $http.put(API_ENDPOINT.url + '/notes/'+ noteId, {shared: shared}).then(function(result) {
        if (result.data.success) {
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };

  return {
    createNote: createNote,
    updateNote: updateNote,
    deleteNote: deleteNote,
    shareNote: shareNote
  };

})
