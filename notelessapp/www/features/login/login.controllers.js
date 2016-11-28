angular.module('starter')
//this is the controller for login
.controller('LoginCtrl', function($scope, AuthService, $ionicPopup, $state) {
//adding the users to global $scope
  $scope.user = {
    name: '',
    password: ''
  };
  //validating the userinput on the API/database
  $scope.login = function() {
    AuthService.login($scope.user).then(function(msg) {
      $state.go('app.mynotes');
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: errMsg
      });
    });
  };
})
//This is registerController
.controller('RegisterCtrl', function($scope, AuthService, $ionicPopup, $state) {
//adding the users to global $scope
  $scope.user = {
    name: '',
    password: ''
  };
  //Function for signing up new users.
  $scope.signup = function() {
    AuthService.register($scope.user).then(function(msg) {
      $state.go('outside.login');
      var alertPopup = $ionicPopup.alert({
        title: 'Register success!',
        template: msg
      });
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Register failed!',
        template: errMsg
      });
    });
  };
})

//this is the inside controller
.controller('InsideCtrl', function($scope, AuthService, API_ENDPOINT, $http, $state) {
  $scope.destroySession = function() {
    AuthService.logout();
  };

  $scope.getInfo = function() {
    //getting the userinformation from the API

    $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
      $scope._id = result.data._id;
      $scope.username = result.data.name;
      $scope.fullname = result.data.fullname;
      $scope.email = result.data.email;
      $scope.occupation = result.data.occupation;
      $scope.password = result.data.password;
      $scope.user = {}; //Important to make the $scope.user to an object so it can be updated
    });
  };
  //function to update user info
  $scope.updateUser = function() {
    $http.put(API_ENDPOINT.url + '/users/' + $scope._id, $scope.user).success(function(resolve) {
      console.log($scope.user);
      $scope.ServerResponse = $scope.test;
      $scope.getInfo();
      });
     };




    //.then(function(result) { //result
    //  name = req.body.name;
      //return result;

//this is the logout function
  $scope.logout = function() {
    AuthService.logout();
    $state.go('outside.login');
  };
})

//this is the AppController
.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('outside.login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
});
