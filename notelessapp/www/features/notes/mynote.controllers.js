angular.module('starter')

.controller('MyCtrl', function($scope, $ionicPopup, AuthService, API_ENDPOINT, $http, $state) {



  $scope.onReorder = function (fromIndex, toIndex) {
      var moved = $scope.contacts.splice(fromIndex, 1);
      $scope.contacts.splice(toIndex, 0, moved[0]);
  };




  $scope.data = {
    showDelete: false
  };

  $scope.edit = function(item) {

    var alertPopup = $ionicPopup.alert({
      title: 'This is the title of the note!',
      template: '<textarea rows="40" type="text" ng-model="notetext" id="thisIsTheText">'
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


  var vm = this;
     vm.notes = [];

     $http.get(API_ENDPOINT.url + '/notes')
         .then(function(result) {
           console.log(result);
           vm.notes = result.data;
          });


  // $scope.items = [];
    //getting the userinformation from the API
    // var config = {headers: {
    //        'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1ODM1OTdiZjNhMGQzMjJhNTQwZTBjOGMiLCJwYXNzd29yZCI6IiQyYSQxMCRld2p1ZE5VVmlrMlB5LkozL3Q2U3hPaDQ4bUhSRlJOZEtvdVVrQTZpQ25uZGs5S0JnL0ZxSyIsIm5hbWUiOiJTY2htaWR0IiwiZW1haWwiOiJTY2htaWR0MkBnbWFpbC5jb20iLCJmdWxsbmFtZSI6Ik1hcnRpbiBTZXJ1cCBTY2htaWR0Iiwib2NjdXBhdGlvbiI6IkNFTyIsInJlcXVpcmVkIjpbXSwibm90ZXMiOltdLCJhdmF0YXIiOiJodHRwczovL3d3dy5ncmF2YXRhci5jb20vYXZhdGFyLzAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwP2Q9bW0mZj15In0.-V1WKL_PC5Ipelaecw2Yp549wsCt4U0UFFLfxxHCFv8',
    //        'Accept': 'application/json;odata=verbose'
    //    }
  //  };
  //   console.log("does it");
  //
  //   $http.get(API_ENDPOINT.url + '/notes').then(function(result) {
  //     console.log("is somehtin happening");
  //     $scope.id = result.data.id;
  //     $scope.title = result.data.title;
  //     $scope.date = result.data.date;
  //     $scope.owner = result.data.owner;
  //     console.log(result.data.id);
  //   });
  // };

  // $scope.items = [
  //   { id: 0,
  //   text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
  //   { id: 1 },
  //   { id: 2 },
  //   { id: 3 },
  //   { id: 4 },
  //   { id: 5 },
  //   { id: 6 },
  //   { id: 7 },
  //   { id: 8 },
  //   { id: 9 },
  //   { id: 10 },
  //   { id: 11 },
  //   { id: 12 },
  //   { id: 13 },
  //   { id: 14 },
  //   { id: 15 },
  //   { id: 16 },
  //   { id: 17 },
  //   { id: 18 },
  //   { id: 19 },
  //   { id: 20 },
  //   { id: 21 },
  //   { id: 22 },
  //   { id: 23 },
  //   { id: 24 },
  //   { id: 25 },
  //   { id: 26 },
  //   { id: 27 },
  //   { id: 28 },
  //   { id: 29 },
  //   { id: 30 },
  //   { id: 31 },
  //   { id: 32 },
  //   { id: 33 },
  //   { id: 34 },
  //   { id: 35 },
  //   { id: 36 },
  //   { id: 37 },
  //   { id: 38 },
  //   { id: 39 },
  //   { id: 40 },
  //   { id: 41 },
  //   { id: 42 },
  //   { id: 43 },
  //   { id: 44 },
  //   { id: 45 },
  //   { id: 46 },
  //   { id: 47 },
  //   { id: 48 },
  //   { id: 49 },
  //   { id: 50 }
  // ];

});
