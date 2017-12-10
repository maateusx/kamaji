var app = angular.module('kamaji', [
  'kamaji.auth',
  'kamaji.dashboard',
  'ui.router',
  'angular-md5',
  'chart.js'
])

.run(function ($rootScope, $http, $location, $window, $state, $stateParams) {
  //'chart.js',
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;

  $rootScope.reqApiURL = "http://192.168.1.9:5000";
  $rootScope.serverURL = "http://localhost:5000";

  $rootScope.isLoading = false;
  $rootScope.req = function(service, params, type, successCB, errorCB, loading){
    if(loading)
      $rootScope.isLoading = true;
    $http({
      method: type, 
      data: params,
      url: $rootScope.reqApiURL + service
    }).then(function (response) {
      if(loading)
        $rootScope.isLoading = false;
      successCB(response.data);
    },function (error){
      if(loading)
        $rootScope.isLoading = false;
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

  if(localStorage.getItem('email') != null && localStorage.getItem('email')!= '' 
    && localStorage.getItem('password') != null && localStorage.getItem('password')!=''){
    var params = {
      email: localStorage.getItem('email'),
      password: localStorage.getItem('password')
    }

    $rootScope.req('/login/'+params.email+'/'+params.password, null, 'GET', function(success){
      if(success == 'erro') {
        localStorage.clear();
        $state.go('login');
      } else {
        $rootScope.user = success;
      }
    }, function(error){
    }, false);
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