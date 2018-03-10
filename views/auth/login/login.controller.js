app.controller("loginController", function($scope, $state, $rootScope, md5){

	$scope.account = {
		email: '',
		password: ''
	}

	$scope.loginAlert = {
		isOn: false,
		text: ''
	}

	$scope.makeLogin = function (){
		$scope.loginAlert.isOn = false;
		if($scope.account.email == '' || $scope.account.email == null){
			$scope.loginAlert.isOn = true;
			$scope.loginAlert.text = 'Por favor, digite um email!';
			return;
		} else if($scope.account.password == '' || $scope.account.password == null){
			$scope.loginAlert.isOn = true;
			$scope.loginAlert.text = 'Por favor, digite uma senha!';
			return;
		}

		let params = {
			email: $scope.account.email,
			password: md5.createHash($scope.account.password)
		}
		$rootScope.req('/login/'+params.email+'/'+params.password, null, 'GET', function(success){		
			if(success == 'erro') {
				alert('Email e/ou Senha Incorreto.');
			} else {
				localStorage.setItem('email', $scope.account.email);
				localStorage.setItem('password', md5.createHash($scope.account.password));
				$rootScope.user = success;
				
				$rootScope.req('/user/photo/'+success.id, null, 'GET', function(suc){
		          $rootScope.user.photo = suc;
		        }, function(err){
		          console.log(err);
		        });

				$state.go('home');
			}
		}, function(error){
			console.log(error);
			alert('Email e/ou Senha Incorreto.');
		}, true);
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
			} else {
				$rootScope.user = success;
				$state.go('home');
			}
		}, function(error){
		}, true);
	}
	

})