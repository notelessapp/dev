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

$scope.note = {
    title:'',
    content:''
  };
$scope.popupNoteCreate = function() {

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

$scope.createNote = function() {
  NoteService.create($scope.note).then(function(msg) {
    $state.go('app.mynotes');
    var alertPopup = $ionicPopup.alert({
      title: 'Note created successfully!',
      template: msg
    });
  }, function(errMsg) {
    $state.go('app.mynotes');
    var alertPopup = $ionicPopup.alert({
      title: 'failed at creating note!',
      template: errMsg
    });
  });
};

  $scope.share = function(note) {
    alert('Share note: ' + note._id);
  };

  $scope.moveItem = function(note, fromIndex, toIndex) {
    $scope.notes.splice(fromIndex, 1);
    $scope.notes.splice(toIndex, 0, note);
  };


  $scope.onItemDelete = function(note) {
  $scope.notes.splice($scope.items.indexOf(note), 1);
  $scope.data.showDelete = false;
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






$scope.getList = function() {
  //getting the users notes from the API recievied in an object
  $http.get(API_ENDPOINT.url + '/notes')
      .then(function(result) {
       $scope.notess = result.data;
       console.log("nothing", $scope.notess);
     });
};

       //getting the users notes from the API recievied in an object
       $http.get(API_ENDPOINT.url + '/notes')
           .then(function(result) {
            $scope.notes = result.data;
          });


});
