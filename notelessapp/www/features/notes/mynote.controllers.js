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
    // console.log("note object", note.owner);
    $scope.note.id = note._id
      NoteService.deleteNote($scope.note.id).then(function(msg) {
        $scope.notes.splice($scope.notes.indexOf(note), 1); //This function reorder the view after delete
        $ionicListDelegate.closeOptionButtons(); //This close the delete-swipe after delete
      },
    function(errMsg) {
      console.log($scope.note.id);
        $state.go('app.mynotes');
        //If any errors appear during the note update the user will be notified
        var alertPopup = $ionicPopup.alert({
          buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
            text: 'Request admin privilege on this note',
            type: 'button-assertive',
            onTap: function(e) {
              //Add function that gives admin rights to delete notes
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
      templateUrl: 'features/notes/editNoteTemplate.html',
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
      templateUrl: 'features/notes/createNoteTemplate.html',
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

  //The $scope.share is the function that enable sharing notes between users (Not functionally at this point)
  // $scope.share = function(note) {
  //
  //   var alertPopup = $ionicPopup.alert({
  //     title: 'failed at creating note!'
  //   });
  //
  //   alert('Share note: ' + note._id);
  // };




  $scope.share = function(note) {
    $http.get(API_ENDPOINT.url + '/memberinfo')
      .then(function(result) {
        console.log('note++ ', note);
        $scope.friends = result.data.friendslist;
        if($scope.friends && note.shared){
          $scope.friends.forEach(function(friend){
            friend.shared = note.shared.indexOf(friend._id) > -1;
          });
        }

        });
  $scope.data = {};
  console.log(note._id);
  $scope.note.id = note._id;
  console.log("test",$scope.note.id);



  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({

    templateUrl: 'features/notes/shareNoteTemplate.html',
    title: 'Mark for sharing!',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Share</b>',
        type: 'button-positive',
          onTap: $scope.shareNote
      }
    ]
  });
 };


 $scope.shareNote = function() {
    $scope.friends.forEach(function(friend){
     if(friend.shared){
       $scope.friendshare.push(friend._id);
     }
   });
   NoteService.shareNote($scope.note.id, $scope.friendshare).then(function(msg) {
     $scope.getList();
     $scope.friendshare = [];
   }, function(errMsg) {
     $state.go('app.mynotes');
     //If any errors appear during the note update the user will be notified
     var alertPopup = $ionicPopup.alert({
       title: 'An error occured',
       template: errMsg
     });
   });
 };


$scope.friendshare = [];
$scope.sharelist = function(friend) {
  console.log('a friend', friend);
  if(friend.shared){
    var index =   $scope.friendshare.indexOf(friend._id);    // <-- Not supported in <IE9
    if (index !== -1) {
        $scope.friendshare.splice(index, 1);
    }
  }
  else{
    $scope.friendshare.push( friend._id);
  }
  console.log("fd", $scope.friendshare);
}

 // $scope.shareNote = function(friend, note) {
 //   $scope.friendId = friend._id;
 //
 //   console.log(friend);
 //  //  NoteService.shareNote($scope.friendId, $scope.note).then(function(msg) {
 //  //    $scope.getList();
 //  //  }, function(errMsg) {
 //  //    $state.go('app.mynotes');
 //  //    //If any errors appear during the note update the user will be notified
 //  //    var alertPopup = $ionicPopup.alert({
 //  //      title: 'An error occured',
 //  //      template: errMsg
 //  //    });
 //  //  });
 //
 //
 // }

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
