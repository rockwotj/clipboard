angular.module('project',['firebase', 'ngRoute', 'rosefire']) 
  .value('fbURL', 'https://rockwotj-clipboard.firebaseio.com/')
  .value('rfToken', 'e5daaf8793be0ef8d35f23bcfccd8c948bfa34f404f1702003a90587415b6ad19934911f2f2bf0c3a79ce29d813c0235qcj8r9KAk/QnAnwyElDxqJGkxPeKINbOp/PVYOLB1b6fB5i6n1DYfa6QCfonbJ/s9hqUoXHWDE/FrmtWN0RWmg==')
  .service('fbRef', function(fbURL) {
    return new Firebase(fbURL);
  })
  .config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/login', {controller: LoginCtrl, templateUrl: 'login.html'})
    .when('/', {controller: MainCtrl, templateUrl: 'clipboard.html'})
    .otherwise('/');
  $locationProvider.html5Mode(true);
});

function MainCtrl($scope, $firebaseAuth, $firebaseObject, fbRef, $location) {
  var authObj = $firebaseAuth(fbRef);
  if (!authObj.$getAuth()) {
    $location.path('/login');
    return;
  }
  var fireObj = $firebaseObject(fbRef);
  $scope.logout = function() {
    fireObj.$destroy();
    authObj.$unauth();
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

function LoginCtrl($scope, rfToken, fbRef, Rosefire, $firebaseAuth, $location) {
  var authObj = $firebaseAuth(fbRef);
  $scope.login = function() {
    console.log('Logging in with rosefire..');
    Rosefire.signIn(rfToken)
      .then(function(token) {
        return authObj.$authWithCustomToken(token);
      })
      .then(function(authData) {
        $location.path('/');
      })
      .catch(function(err) {
        console.error(err);    
      });
  };
}
