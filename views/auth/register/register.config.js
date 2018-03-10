angular.module('kamaji.auth.register', [
  'ui.router',
])
  
.config([
   '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {

        $stateProvider
        .state('register', {
            url: '/register',
            templateUrl: 'views/auth/register/register.html',
            controller: 'registerController'
        })
        
    }
]);