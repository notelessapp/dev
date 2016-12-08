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
   $scope.acceptFriend = function(friend){
    //  console.log("hej", friend);
     $scope.friendslist = friend._id
     console.log("her", $scope.friendslist);
   }

  //  $scope.updateNote = function() {
  //    $scope.friend.id = friend._id;
  //    NoteService.updateNote($scope.friend.id).then(function(msg) {
  //      $scope.getFriends();
  //    }, function(errMsg) {
  //      $state.go('app.friends');
  //      //If any errors appear during the note update the user will be notified
  //      var alertPopup = $ionicPopup.alert({
  //        title: 'An error occured',
  //        template: errMsg
  //      });
  //    });
  //  };
});
