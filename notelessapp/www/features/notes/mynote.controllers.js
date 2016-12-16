angular.module('starter')

.controller('NoteController', function($scope, $ionicPopup, NoteService, API_ENDPOINT, $http, $state, $ionicListDelegate) {


  //Note reordering, is not implemented at this point
  // $scope.onReorder = function (fromIndex, toIndex) {
  //     var moved = $scope.contacts.splice(fromIndex, 1);
  //     $scope.contacts.splice(toIndex, 0, moved[0]);
  // };


  $scope.updateNote = function() {
    NoteService.updateNote($scope.note.id, $scope.note).then(function(msg) {
      $scope.getList();
    }, function(errMsg) {
      $state.go('app.mynotes');
      //If any errors appear during the note update the user will be notified
      var alertPopup = $ionicPopup.alert({
        title: 'An error occured',
        template: errMsg
      });
    });
  };


  //Delete function for deleting notes
  $scope.delete = function(note) {

    $scope.note.id = note._id
    NoteService.deleteNote($scope.note.id).then(function(msg) {
        $scope.notes.splice($scope.notes.indexOf(note), 1); //This function reorder the view after delete
        $ionicListDelegate.closeOptionButtons(); //This close the delete-swipe after delete
      },
      function(errMsg) {
        $state.go('app.mynotes');
        //If any errors appear during the note update the user will be notified
        var alertPopup = $ionicPopup.alert({
          buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
            text: 'Request admin privilege on this note',
            type: 'button-assertive',
            onTap: function(e) {
              $ionicListDelegate.closeOptionButtons(); //This close the delete-swipe
            }
          }],
          title: 'Message',
          template: errMsg
        });
      });
  };

  //This is the function that edits notes
  $scope.edit = function(note) {
    //Defining $scope.note in the popup, so title and content can be shown
    $scope.note = {
      title: note.title,
      content: note.content
    };
    $scope.note.id = note._id;

    //Ionic popup function, to display the note in popup-view
    var alertPopup = $ionicPopup.alert({
      scope: $scope,
      templateUrl: 'features/notes/noteTemplate.html',
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
        onTap: $scope.updateNote
      }]
    });

  };

  //This function is adding $scope.note.id and $scope.note object into the NoteService.UpdateNote
  $scope.updateNote = function() {
    NoteService.updateNote($scope.note.id, $scope.note).then(function(msg) {
      $scope.getList();
    }, function(errMsg) {
      $state.go('app.mynotes');
      //If any errors appear during the note update the user will be notified
      var alertPopup = $ionicPopup.alert({
        title: 'An error occured',
        template: errMsg
      });
    });
  };

  //Define note to empty, making the $scope.note ready for input
  $scope.note = {
    title: '',
    content: ''
  };

  //Create a notefunction
  $scope.popupNoteCreate = function() {

    var alertPopup = $ionicPopup.alert({
      title: 'Create a new note',
      //With templateUrl we get a html template in the popup
      templateUrl: 'features/notes/noteTemplate.html',
      //scope allow us to send/get the data from another view
      scope: $scope,
      buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
        text: 'Cancel',
        type: 'button-default',
        onTap: function(e) {
          //  e.preventDefault(); <-- activate this if we need it be prevented
        }
      }, {
        text: 'Save',
        type: 'button-positive',
        // onTap is running the $scope.createNote function.
        onTap: $scope.createNote
      }]
    });
  }

  //This function is adding $scope.note object into the NoteService.CreateNote
  $scope.createNote = function() {
    NoteService.createNote($scope.note).then(function(msg) {
      $scope.getList();
    }, function(errMsg) {
      $state.go('app.mynotes');
      var alertPopup = $ionicPopup.alert({
        title: 'failed at creating note!',
        template: errMsg
      });
    });
  };


  //fucntion for note Sharing, this outputs the note and who has its currently shared with.
  $scope.share = function(note) {
    $http.get(API_ENDPOINT.url + '/memberinfo')
      .then(function(result) {
        $scope.friends = result.data.friendslist;
        if ($scope.friends && note.shared) {
          $scope.friends.forEach(function(friend) {
            friend.shared = note.shared.indexOf(friend.friendId) > -1;
          });
        }



      });
    $scope.note.id = note._id;



    // An elaborate, custom popup
    if(note.shared.length == 0) {
      var myPopup = $ionicPopup.show({

        templateUrl: 'features/notes/shareNoteTemplate.html',
        title: 'Check for sharing!',
        scope: $scope,

        buttons: [{
          text: 'Cancel',
          onTap: $ionicListDelegate.closeOptionButtons() //This close the delete-swipe after delete
        }, {
          text: '<b>Find a friend!</b>',
          type: 'button-positive',
          //When click on button "Share note", the $scope.shareNote function is executed
          onTap: function(e) {
            $ionicListDelegate.closeOptionButtons()
            $state.go('app.friends');
        }

        }]
      });

    }
    else {
    var myPopup = $ionicPopup.show({

      templateUrl: 'features/notes/shareNoteTemplate.html',
      title: 'Check for sharing!',
      scope: $scope,

      buttons: [{
        text: 'Cancel',
        onTap: $ionicListDelegate.closeOptionButtons() //This close the delete-swipe after delete
      }, {
        text: '<b>Share note</b>',
        type: 'button-positive',
        //When click on button "Share note", the $scope.shareNote function is executed
        onTap: $scope.shareNote
      }]
    });
  }};

  $scope.closePopup = function() {
    $ionicListDelegate.closeOptionButtons();
    Popup.close();

  };
  //shareNote function starts checking if the users already are shared, then adding the shared users to the object $scope.friendshare
  $scope.shareNote = function() {
    $scope.friends.forEach(function(friend) {
      if (friend.shared) {
        $scope.friendshare.push(friend.friendId);
      }
    });
    //NoteService.Sharenote will be given 2 objects, note.id and frendshare,
    //to perform a put/update note with users the note is shared with
    NoteService.shareNote($scope.note.id, $scope.friendshare).then(function(msg) {
      $scope.getList();
      //empty the array with friendshare after the shareUpdate has been executed
      $scope.friendshare = [];
      var alertPopup = $ionicPopup.alert({
        title: 'Shared with',
        template: msg
      });
      $ionicListDelegate.closeOptionButtons(); //This close the swipe
    }, function(errMsg) {
      $state.go('app.mynotes');
      //If any errors appear during the note update the user will be notified
      var alertPopup = $ionicPopup.alert({
        title: 'An error occured',
        template: errMsg
      });
    });
  };

  //preparing an empty array to get pushed with users to be shared with.
  $scope.friendshare = [];
  $scope.sharelist = function(friend) {
    if (friend.shared) {
      var index = $scope.friendshare.indexOf(friend.friendId); // <-- Not supported in <IE9
      if (index !== -1) {
        $scope.friendshare.splice(index, 1);
      }
    } else {
      $scope.friendshare.push(friend.friendId);
    }
  }


  //This function moves items from the view
  $scope.moveItem = function(note, fromIndex, toIndex) {
    $scope.notes.splice(fromIndex, 1);
    $scope.notes.splice(toIndex, 0, note);
  };

  //This function re-order the list after delete
  $scope.onItemDelete = function(note) {
    $scope.notes.splice($scope.items.indexOf(note), 1);
    $scope.data.showDelete = false;
  };

  //This function is ready if we need to call notes from the db
  $scope.getList = function() {
    //getting the users notes from the API recievied in an object
    $http.get(API_ENDPOINT.url + '/notes')
      .then(function(result) {
        $scope.notes = result.data;
        $scope.note = {
          title: '',
          content: ''
        };
      });
  };
});
