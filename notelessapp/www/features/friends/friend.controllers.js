angular.module('starter')
//This is the controller for friends
.controller('friendCtrl', function($scope, AuthService, $ionicPopup, $state, API_ENDPOINT, $http, FriendService) {
  //This function is ready if we need to call notes from the db
  $scope.getFriends = function() {
    //getting the users notes from the API recievied in an object
    $http.get(API_ENDPOINT.url + '/memberinfo')
      .then(function(result) {
        $scope.friends = result.data.friendslist;
        console.log($scope.friends);
    });
  };
   $scope.acceptFriend = function(friendShipId){
     console.log(friendShipId);
     
     FriendService.accept($)
   }
});
