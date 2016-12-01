angular.module('starter')

.controller('NoteController', function($scope, $ionicPopup, NoteService, API_ENDPOINT, $http, $state, $ionicListDelegate, $window) {


  //Note reordering, is not implemented at this point
  // $scope.onReorder = function (fromIndex, toIndex) {
  //     var moved = $scope.contacts.splice(fromIndex, 1);
  //     $scope.contacts.splice(toIndex, 0, moved[0]);
  // };

  //Delete function for deleting notes
  $scope.delete = function(note) {

    $http.delete(API_ENDPOINT.url + '/notes/' + note._id).success(function(resolve) {
      console.log('Note', note._id, 'was deleted');
      $scope.notes.splice($scope.notes.indexOf(note), 1); //This function reorder the view after delete
      $ionicListDelegate.closeOptionButtons(); //This close the delete-swipe after delete
    });
  }

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
          //  e.preventDefault(); <-- activate this if we need it be prevented
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
      //When note is updated the user will be redirected to a refreshed note-view
      $state.go('app.mynotes');
      $window.location.reload(true);
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
    NoteService.create($scope.note).then(function(msg) {
      $state.go('app.mynotes');
      $window.location.reload(true);

    }, function(errMsg) {
      $state.go('app.mynotes');
      var alertPopup = $ionicPopup.alert({
        title: 'failed at creating note!',
        template: errMsg
      });
    });
  };

  //The $scope.share is the function that enable sharing notes between users (Not functionally at this point)
  $scope.share = function(note) {
    alert('Share note: ' + note._id);
  };

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
      });
  };

});
