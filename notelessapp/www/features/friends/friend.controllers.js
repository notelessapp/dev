angular.module('starter')
  //This is the controller for friends
  .controller('friendCtrl', function($scope, AuthService, $ionicPopup, $state, API_ENDPOINT, $http, FriendService, $filter,$state, $ionicListDelegate) {
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

          $scope.friendsName = result.data.friendslist; // get data from json
              angular.forEach($scope.friendsName, function(friend){
                  $scope.friendsName = friend.friendId
               });
            });
      $scope.searchResult = {};
    };


    $http.get(API_ENDPOINT.url + '/users', $scope.friendName)
      .then(function(result) {
        $scope.avatar = result.data
        angular.forEach($scope.avatar, function(obj){
            $scope.avatar = obj.avatar
            console.log($scope.avatar);
         });
      });

      $scope.view = function(friend) {
        //Defining $scope.note in the popup, so title and content can be shown
        // $scope.note = {
        //   title: note.title,
        //   content: note.content
        // };
        // $scope.note.id = note._id;

        //Ionic popup function, to display the note in popup-view
        var alertPopup = $ionicPopup.alert({
          scope: $scope,
          title: (friend.friendId),
          template: (friend.friendName),
          buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
            text: 'Cancel',
            type: 'button-assertive',
            onTap: function(e) {
              $scope.note = {
                title: '',
                content: ''
              };
            }
          }, {
            text: 'Save',
            type: 'button-balanced',
            // onTap is running the $scope.updateNote function.
            onTap: console.log("do something")
          }]
        });

      };

//Delete function for deleting friends
$scope.delete = function(friend) {
  console.log("remove", friend.friendId);
//Prepare remove from friendlist function here
};

//This function moves items from the view
$scope.moveItem = function(friend, fromIndex, toIndex) {
  $scope.notes.splice(fromIndex, 1);
  $scope.notes.splice(toIndex, 0, friend);
};

//This function re-order the list after delete
$scope.onItemDelete = function(friend) {
  $scope.notes.splice($scope.items.indexOf(friend), 1);
  $scope.data.showDelete = false;
};

    $scope.acceptFriend = function(friend) {
      //  console.log("hej", friend);
      $scope.friendslist = friend._id
      $scope.status = "Accepted";
      FriendService.updateFriendStatus($scope.friendslist, $scope.status).then(function(msg) {
        $scope.getFriends();
        // $scope.getFriendsStatus(); (This should be added so the friendStatus view will be updated)
        $state.go('app.friends');
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
        $state.go('app.friends');
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
          // We could maybe add a return statement here, to check if searchResult is already Accepted, Requested or Declined,
          // then remove object from the searchResult or greyout the add button as an indicator.
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
