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

   $scope.acceptFriend = function(friend) {
  //  console.log("hej", friend);
  $scope.friendslist = friend._id
  $scope.status = "Accepted";
  console.log("her", $scope.friendslist, $scope.status);
  FriendService.updateFriendStatus($scope.friendslist, $scope.status).then(function(msg) {

    // $scope.getFriendsStatus(); (This should be added so the friendStatus view will be updated)
  }, function(errMsg) {
    $state.go('app.friends');
    //If any errors appear during the note update the user will be notified
    var alertPopup = $ionicPopup.alert({
      title: 'An error occured',
      template: errMsg
    });
  });

}


   $scope.findFriends = function(friendName){
     $http.get(API_ENDPOINT.url + '/friends/search/' + friendName)
        .then(function(result) {
          $scope.searchResult = result.data;
          $scope.user_id = result.data._id;
          console.log($scope.searchResult);
        });
   };

   $scope.addFriend = function(name) {
     $http.put(API_ENDPOINT.url + '/friends/' + name)
     .then(function(result) {
       console.log(name);
     });
   }

});
