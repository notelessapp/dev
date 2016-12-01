angular.module('starter')
//This will provide the user with a token
.service('NoteService', function($q, $http, API_ENDPOINT) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var isAuthenticated = false;
  var authToken;

  var create = function(note) {
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

  var updateNote = function(note) {
    return $q(function(resolve, reject) {
      $http.put(API_ENDPOINT.url + '/notes/:id', note).then(function(result) {
        if (result.data.success) {
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };

  return {
    create: create,
    updateNote: updateNote
  };

})
