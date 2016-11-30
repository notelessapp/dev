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

  return {
    create: create
  };

})

.factory('datfactory', function ($http, $q, API_ENDPOINT){

    this.getlist = function(){
        return  $http.get(API_ENDPOINT.url + '/notes')
            .then(function(response) {
              console.log(response); //I get the correct items, all seems ok here
              return response.data.itemsToReturn;
            });
    }
    return this;
});
