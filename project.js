angular.module('project',['firebase', 'ngRoute', 'rosefire']) 
  .value('rfToken', 'b0e87fa7-492f-4612-8e66-5fd633451a92')
  .config(function($routeProvider, $locationProvider) {
    var config = {
      apiKey: "AIzaSyBpj63v0o4gcQaICvI6kCMm8y8QkwQ4d7I",
      authDomain: "rockwotj-clipboard.firebaseapp.com",
      databaseURL: "https://rockwotj-clipboard.firebaseio.com",
      storageBucket: "rockwotj-clipboard.appspot.com",
    }; 
    firebase.initializeApp(config);
    $routeProvider
      .when('/login', {controller: LoginCtrl, templateUrl: 'login.html'})
      .when('/', {controller: MainCtrl, templateUrl: 'clipboard.html'})
      .otherwise('/');
    $locationProvider.html5Mode(true);
  });

  function MainCtrl($scope, $firebaseAuth, $firebaseObject, $location) {
    var authObj = $firebaseAuth();
    if (!authObj.$getAuth()) {
      $location.path('/login');
      return;
    }
    var fireObj = $firebaseObject(firebase.database().ref());
    $scope.logout = function() {
      fireObj.$destroy();
      authObj.$signOut();
      $location.path('/login');
    }
    fireObj.$watch(function() {
      $scope.text = fireObj.$value;
    });
    if (authObj.$getAuth().uid === 'rockwotj') {
      $scope.onChange = function() {
        fireObj.$value = $scope.text;
        console.log(fireObj.$value);
        fireObj.$save()
      }
    } else {
      $scope.onChange = angular.noop;
    }
  }

  function LoginCtrl($scope, rfToken, Rosefire, $firebaseAuth, $location) {
    var authObj = $firebaseAuth();
    $scope.login = function() {
      console.log('Logging in with rosefire..');
      Rosefire.signIn(rfToken)
        .then(function(rfUser) {
          return authObj.$signInWithCustomToken(rfUser.token);
        })
        .then(function(authData) {
          $location.path('/');
        })
        .catch(function(err) {
          console.error(err);    
        });
    };
  }
