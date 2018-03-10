var app = angular.module('kamaji', [
  'kamaji.auth',
  'kamaji.auth.register',
  'kamaji.dashboard',
  'ui.router',
  'angular-md5'
])

.run(function ($rootScope, $http, $location, $window, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;

  $rootScope.reqApiURL = "http://localhost:5000";
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

  if(window.localStorage.getItem('email') != null && window.localStorage.getItem('email')!= '' 
    && window.localStorage.getItem('password') != null && window.localStorage.getItem('password')!=''){
    var params = {
      email: window.localStorage.getItem('email'),
      password: window.localStorage.getItem('password')
    }

    $rootScope.req('/login/'+params.email+'/'+params.password, null, 'GET', function(success){
      if(success == 'erro') {
        window.localStorage.clear();
        location.replace('/login');
      } else {
        $rootScope.user = success;
        $rootScope.req('/user/photo/'+success.id, null, 'GET', function(suc){
          $rootScope.user.photo = suc;
        }, function(err){
          console.log(err);
        });
      }
    }, function(error){
      //window.localStorage.clear();
      //location.replace('/login');
    }, false);
  } else {
    window.localStorage.clear();
  }
})

.config(function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise('/home');
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
