angular.module('kamaji.dashboard', [
  'ui.router',
])
  
.config([
   '$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {

        $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'views/dashboard/home/home.html',
            controller: 'homeController'
        })
        
    }
]);