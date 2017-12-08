var app = angular.module('kamaji', [
  'kamaji.auth',
  'kamaji.dashboard',
  'ui.router',
  'chart.js'
])

.run(function ($rootScope, $http, $location, $window, $state, $stateParams) {

  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;

  $rootScope.reqApiURL = "http://192.168.0.33:5000";
  $rootScope.serverURL = "http://localhost:5000";

  $rootScope.req = function(service, params, type, successCB, errorCB){
    $http({
      method: type, 
      data: params,
      url: $rootScope.reqApiURL + service
    }).then(function (response) {
      successCB(response.data);
    },function (error){
      errorCB(error);
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