app.controller("loginController", function($scope, $state, $rootScope){

	$scope.account = {
		email: '',
		password: ''
	}

	$scope.loginAlert = {
		isOn: false,
		text: ''
	}

	$scope.makeLogin = function (){
		$state.go('home');
		/*$scope.loginAlert.isOn = false;
		if($scope.account.email == '' || $scope.account.email == null){
			$scope.loginAlert.isOn = true;
			$scope.loginAlert.text = 'Por favor, digite um email!';
			return;
		} else if($scope.account.password == '' || $scope.account.password == null){
			//?alert or warning?
			$scope.loginAlert.isOn = true;
			$scope.loginAlert.text = 'Por favor, digite uma senha!';
			return;
		}

		$rootScope.req('/login/'+$scope.account.email+'/'+$scope.account.password, null, 'GET', function(successs){
			localStorage.setItem('email', $scope.account.email);
			localStorage.setItem('password', $scope.account.password);
			$state.go('home');
		}, function(error){
			console.log(error);
			alert('Email e/ou Senha Incorreto.');
		});*/
	}

	//check cache
	if(localStorage.getItem('email') != null && localStorage.getItem('email')!= '' 
		&& localStorage.getItem('password') != null && localStorage.getItem('password')!=''){
		var params = {
			email: localStorage.getItem('email'),
			password: localStorage.getItem('password')
		}
		$rootScope.req('/login/'+params.email+'/'+params.password, null, 'GET', function(successs){
			$state.go('home');
		}, function(error){
			console.log(error);
		});
	}
	

})