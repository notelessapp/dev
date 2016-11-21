angular.module('starter')

.controller('MenuCtrl', function($scope, AuthService, API_ENDPOINT, $state, $http) {

  $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
    $scope.username = result.data.name;
  })


  $scope.logout = function() {
    AuthService.logout();
    $state.go('outside.login');
  }
});
