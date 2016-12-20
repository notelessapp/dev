angular.module('starter')
  //This is the controller for friends
  .controller('friendCtrl', function($scope, AuthService, $ionicPopup, $state, API_ENDPOINT, $http, FriendService, $filter,$state) {
    //This function is ready if we need to call notes from the db
    $scope.getFriends = function() {
      //getting the users notes from the API recievied in an object
      $http.get(API_ENDPOINT.url + '/memberinfo')
        .then(function(result) {
          $scope.friends = result.data.friendslist;

          $scope.numberOfFriends = $scope.friends.filter(function(friend){
            return (friend.status == "Accepted");
          });

          $scope.numberOfRequest = $scope.friends.filter(function(friend){
            return (friend.status == "Requested");
          });

          $scope.numberOfPending = $scope.friends.filter(function(friend){
            return (friend.status == "Pending");
          });

        });
      $scope.searchResult = {};
    };


    $scope.acceptFriend = function(friend) {
      //  console.log("hej", friend);
      $scope.friendslist = friend._id
      $scope.status = "Accepted";
      FriendService.updateFriendStatus($scope.friendslist, $scope.status).then(function(msg) {
        $scope.getFriends();
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

    $scope.declineFriend = function(friend) {
      //  console.log("hej", friend);
      $scope.friendslist = friend._id
      $scope.status = "Declined";
      FriendService.updateFriendStatus($scope.friendslist, $scope.status).then(function(msg) {
        $scope.getFriends();
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

    $scope.findFriends = function(friendName) {
      if(friendName == 0) {
        $scope.searchResult = {};
      }

      $http.get(API_ENDPOINT.url + '/friends/search/' + friendName)
        .then(function(result) {
          $scope.searchResult = result.data;
          $scope.user_id = result.data._id;

      });

    };

    $scope.addFriend = function(name) {
      $http.put(API_ENDPOINT.url + '/friends/' + name)
        .then(function(result) {
          $scope.getFriends();
          var alertPopup = $ionicPopup.alert({
            title: 'Friend message',
            template: 'A friend request was sent to ' + name
          });
        });
      document.getElementById('clearInput').value = null;
    }

  });
