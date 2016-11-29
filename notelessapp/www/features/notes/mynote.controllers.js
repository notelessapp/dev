angular.module('starter')

.controller('MyCtrl', function($scope, $ionicPopup, NoteService, API_ENDPOINT, $http, $state, $ionicListDelegate) {



  $scope.onReorder = function (fromIndex, toIndex) {
      var moved = $scope.contacts.splice(fromIndex, 1);
      $scope.contacts.splice(toIndex, 0, moved[0]);
  };


$scope.delete = function(note) {

  $http.delete(API_ENDPOINT.url + '/notes/' + note._id).success(function(resolve) {
    console.log('Successfully deleted', note._id);
    $scope.notes.splice($scope.notes.indexOf(note), 1);
    $ionicListDelegate.closeOptionButtons();

    });
}

  $scope.data = {
    showDelete: false
  };

  $scope.edit = function(item) {

    var alertPopup = $ionicPopup.alert({
      title: 'This is the title of the note!',
      template: '<textarea rows="40" type="text" ng-model="notetext" id="thisIsTheText">'
    });

  };


$scope.popupNoteCreate = function() {
  $scope.note = {};
  var alertPopup = $ionicPopup.alert({
    title:'Create a new note',
    templateUrl: 'features/notes/createNoteTemplate.html',
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
   onTap: $scope.createNote
   }]
  });
}


  //Function for signing up new users.
  $scope.createNote = function() {
    NoteService.create($scope.note).then(function(msg) {
      $state.go('app.mynotes');
      var alertPopup = $ionicPopup.alert({
        title: 'Note Created!',
        template: msg
      });
    }, function(errMsg) {
      console.log(errMsg);
      $state.go('app.mynotes');


    });
  };


  $scope.share = function(item) {
    alert('Share Item: ' + item.id);
  };

  $scope.moveItem = function(item, fromIndex, toIndex) {
    $scope.items.splice(fromIndex, 1);
    $scope.items.splice(toIndex, 0, item);
  };

  $scope.onItemDelete = function(item) {
  $scope.items.splice($scope.items.indexOf(item), 1);
    };

  // hold function 3 secs
  var didUserHoldForThreeSeconds = 0;
  $scope.hold = function(event) {
    didUserHoldForThreeSeconds = event.timestamp;
  };
  $scope.release = function (event) {
    if (event.timestamp - didUserHoldForThreeSeconds > 1000) {
      console.log('Hooray! They held for 3 seconds')
    } else {
    //  $scope.moveItem();
      console.log('nothing happened');
    }
    didUserHoldForThreeSeconds = 0; // reset after each release
  };


     $http.get(API_ENDPOINT.url + '/notes')
         .then(function(result) {
           console.log(result);
           $scope.notes = result.data;
           $scope.title = result.data.title;
          //  $scope.note = {};
          });



});
