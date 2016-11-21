angular.module('starter')

.controller('MenuCtrl', function($scope, AuthService, API_ENDPOINT, $state, $http) {

  $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
    $scope.username = result.data.name;
    $scope.occupation = result.data.occupation;
    $scope.avatar = result.data.avatar;
  })



  $scope.logout = function() {
    AuthService.logout();
    $state.go('outside.login');
  }
});
