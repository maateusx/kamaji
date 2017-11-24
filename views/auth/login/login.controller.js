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
		$scope.loginAlert.isOn = false;
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
		//req
		$state.go('home')
	}

	//check cache

})