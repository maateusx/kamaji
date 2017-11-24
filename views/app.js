var app = angular.module('kamaji', [
  'kamaji.auth',
  'kamaji.dashboard',
  'ui.router'
])

.run(function ($rootScope, $http, $location, $window, $state, $stateParams) {

  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;

  $rootScope.reqApiURL = "";
  $rootScope.serverURL = "";

  $rootScope.req = function(service, params, type, success, error){
    $http({
      url: $rootScope.reqApiURL + service,
      method: type,
      data: params  
    })
    .success(function(data){
      success(data);
    })
    .error(function(err){
      error(err);
    });  
  }

  $rootScope.reqLoading = function(service, params, type, success, error){
    $rootScope.isLoading = true;
    $http({
      url: $rootScope.reqApiURL + service,
      method: type,
      data: params  
    })
    .success(function(data){
      $rootScope.isLoading = false;
      success(data);
    })
    .error(function(err){
      $rootScope.isLoading = false;
      error(err);
    });  
  }

})

.config(function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise('/login');
})

.config(function($locationProvider) {
   $locationProvider.html5Mode(true).hashPrefix('!')
});

angular.module('kamaji').directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});