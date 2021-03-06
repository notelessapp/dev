angular.module('starter')
//This will provide the user with a token
.service('FriendService', function($q, $http, API_ENDPOINT) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var isAuthenticated = false;
  var authToken;

  var updateFriendStatus = function(friendShipId, status) {
    return $q(function(resolve, reject) {
      $http.put(API_ENDPOINT.url + '/friends/status/'+ friendShipId + '/' + status).then(function(result) {
        if (result.data.success) {
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };



  return {
    updateFriendStatus: updateFriendStatus
    //decline: decline
  };

})
