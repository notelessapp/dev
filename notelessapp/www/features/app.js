// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('outside', {
      cache: false,
      url: '/outside',
      abstract: true,
      templateUrl: 'features/login/outside.html'
    })
    .state('outside.login', {
      cache: false,
      url: '/login',
      templateUrl: 'features/login/login.html',
      controller: 'LoginCtrl'
    })
    .state('outside.register', {
      cache: false,
      url: '/register',
      templateUrl: 'features/login/register.html',
      controller: 'RegisterCtrl'
    })
    .state('app', {
      cache: false,
      url: '/app',
      abstract: true,
      templateUrl: 'features/menu/menu.html'
    })
    .state('app.mynotes', {
      cache: false,
      url: '/mynotes',
      views: {
        'menuContent': {
          templateUrl: 'features/notes/mynotes.html',
          controller: 'NoteController'
        }
      }
    })
    .state('app.friends', {
      cache: false,
      url: '/friends',
      views: {
        'menuContent': {
          templateUrl: 'features/friends/friends.html',
          controller: 'friendCtrl'

        }
      }
    })
    .state('app.friendsaccepted', {
      cache: false,
      url: '/friendsaccepted',
      views: {
        'menuContent': {
          templateUrl: 'features/friends/friendsAccepted.html',
          controller: 'friendCtrl'

        }
      }
    })
    .state('app.friendsRequested', {
      cache: false,
      url: '/friendsrequested',
      views: {
        'menuContent': {
          templateUrl: 'features/friends/friendsRequested.html',
          controller: 'friendCtrl'

        }
      }
    })
    .state('app.friendsPending', {
      cache: false,
      url: '/friendspending',
      views: {
        'menuContent': {
          templateUrl: 'features/friends/friendsPending.html',
          controller: 'friendCtrl'

        }
      }
    })
    .state('app.profile', {
      cache: false,
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'features/profile/profile.html',
          controller: 'InsideCtrl'
        }
      }
    })
    .state('app.groups', {
      cache: false,
      url: '/groups',
      views: {
        'menuContent': {
          templateUrl: 'features/groups/groups.html'
        }
      }
    });

  $urlRouterProvider.otherwise('/outside/login');
})

.run(function($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState) {
    if (!AuthService.isAuthenticated()) {
      if (next.name !== 'outside.login' && next.name !== 'outside.register') {
        event.preventDefault();
        $state.go('outside.login');
      }
    }
  });
});
