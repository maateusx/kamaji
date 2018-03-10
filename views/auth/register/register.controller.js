app.controller("registerController", function($scope, $state, $rootScope, md5){

	$scope.account = {
		email: '',
		password: ''
	}

	$scope.registerAlert = {
		isOn: false,
		text: ''
	}

	$scope.register = function (){
		$scope.registerAlert.isOn = false;
		if($scope.account.email == '' || $scope.account.email == null){
			$scope.registerAlert.isOn = true;
			$scope.registerAlert.text = 'Por favor, digite um email!';
			return;
		} else if($scope.account.password == '' || $scope.account.password == null){
			$scope.registerAlert.isOn = true;
			$scope.registerAlert.text = 'Por favor, digite uma senha!';
			return;
		}

		let params = {
			email: $scope.account.email,
			password: md5.createHash($scope.account.password)
		}
		$rootScope.req('/register/'+params.email+'/'+params.password, null, 'GET', function(success){		
			if(success == 'erro') {
				$scope.registerAlert.isOn = true;
				$scope.registerAlert.text = 'Email e/ou senha incorreto(s).';
			} else {
				$scope.registerAlert.isOn = true;
				$scope.registerAlert.text = 'Cadastrado com sucesso';
			}
		}, function(error){
			console.log(error)
			$scope.registerAlert.isOn = true;
			$scope.registerAlert.text = 'Erro ao completar registro.';
		}, true);
	}

})