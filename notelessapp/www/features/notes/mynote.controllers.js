angular.module('starter')

.controller('MyCtrl', function($scope, $ionicModal) {

  $scope.contacts = [
      { name: 'Frank', img: 'frank.jpg', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
      { name: 'Susan', img: 'susan.jpg', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
      { name: 'Emma', img: 'emma.jpg', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
      { name: 'Scott', img: 'scott.jpg', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
      { name: 'Bob', img: 'bob.jpg', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
      { name: 'Olivia', img: 'olivia.jpg', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' },
      { name: 'Anne', img: 'anne.jpg', phone: '0101 123456', mobile: '0770 123456', email: 'frank@emailionicsorter.com' }
  ];

  $scope.onReorder = function (fromIndex, toIndex) {
      var moved = $scope.contacts.splice(fromIndex, 1);
      $scope.contacts.splice(toIndex, 0, moved[0]);
  };




  $scope.data = {
    showDelete: false
  };

  $scope.edit = function(item) {
    alert('Edit Item: ' + item.id);
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

  $scope.items = [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
    { id: 11 },
    { id: 12 },
    { id: 13 },
    { id: 14 },
    { id: 15 },
    { id: 16 },
    { id: 17 },
    { id: 18 },
    { id: 19 },
    { id: 20 },
    { id: 21 },
    { id: 22 },
    { id: 23 },
    { id: 24 },
    { id: 25 },
    { id: 26 },
    { id: 27 },
    { id: 28 },
    { id: 29 },
    { id: 30 },
    { id: 31 },
    { id: 32 },
    { id: 33 },
    { id: 34 },
    { id: 35 },
    { id: 36 },
    { id: 37 },
    { id: 38 },
    { id: 39 },
    { id: 40 },
    { id: 41 },
    { id: 42 },
    { id: 43 },
    { id: 44 },
    { id: 45 },
    { id: 46 },
    { id: 47 },
    { id: 48 },
    { id: 49 },
    { id: 50 }
  ];

});
