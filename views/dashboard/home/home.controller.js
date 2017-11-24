app.controller("homeController", function($scope, $state, $rootScope){

	$scope.user = {
		avatar: 'img/user-placeholder.jpg',
		name: 'Mateus Pereira'
	}

	$scope.coinType = 'USD/BRL';

	$scope.navDatas = [
		{title: '3.1715', sub: 'close'},
		{title: '+0.01%', sub: '24 Hour Change', color: 1},
		{title: '3.16507', sub: 'High'},
		{title: '3.17765', sub: 'Low'}
	];

	$scope.eoq = true;

	$scope.indicators = [
		{title: 'MACD', percent: '80%', time: '5d', color: 1, active: false},
		{title: 'RSI', percent: '50%', time: '2d', color: 1, active: true},
		{title: 'Bollinger Bands', percent: '20%', time: '2d', color: 0, active: false},
		{title: 'SuperTrend', percent: '10%', time: '2d', color: 0, active: false}
	];
	$rootScope.indicatorIsOn = false;

	$scope.selectIndicator = function(index) {
		$rootScope.indicatorIsOn = true;
		$rootScope.selectedIndicator = $scope.indicators[index]; //Change memory address
		$scope.secondGraph.title = $scope.indicators[index].title;
	}
	$scope.deselectIndicator = function() {
		$rootScope.selectedIndicator = null;
		$rootScope.indicatorIsOn = false;
	}
	$scope.turnOnIndicator = function(index){
		let indicator = $scope.indicators[index];
		console.log(indicator);
	}
	
	$scope.notifications = [
		{title: 'Invoice: HBO - 25/07/2017 - 4 Indicadores Ativos', sub: 'Notificado via celular - 34 9 9277 5400'},
		{title: 'Invoice: HBO - 24/07/2017 - 5 Indicadores Ativos', sub: 'Notificado via celular - 34 9 9277 5400'},
		{title: 'Invoice: HBO - 23/07/2017 - 2 Indicadores Ativos', sub: 'Notificado via celular - 34 9 9277 5400'}
	];

	$scope.notificationsRefresh = function(){
		//req
	}

	$scope.mainGraph = {
		status: 'Good Buy',
		color: 1,
		graph: 'Graph1',
		secondGraph: 'Graph2'
	}

	$scope.secondGraph = {
		title: 'MACD',
		sub: 'Histogram',
		average: 0.0001022,
		deviation: 0.0156754,
		distance: 0.7179375,
		color: 1,
		days: 2
	}

	$scope.ranger = 50;

	$scope.notificationsStrategies = [
		{title: 'MACD', sub: 'Cross', percent: 100, active: true},
		{title: 'MACD', sub: 'Histogram', percent: 90, active: true},
		{title: 'Boolinger', sub: 'Bands UB', percent: 10, active: false},
		{title: 'Boolinger', sub: 'Bands LB', percent: 20, active: true},
		{title: 'RSI', sub: 'Cross', percent: 50, active: true}
	];
	$scope.refreshStrategies = function(index){
		let strategy = $scope.notificationsStrategies[index];
		console.log(strategy);
		//req
	}
 

 	/* -- MODAL -- */
	$scope.openModal = function(tab){
		$rootScope.seletecdTab = tab;
		$("#modal").modal("show"); 
	}
	$scope.changeTab = function(tab){
		$rootScope.seletecdTab = tab;
	}

	/* -- BEGIN INVOICE MODAL --*/
	$scope.invoicesFilter = 1;
	$scope.selectInvoiceFilter = function(n){
		$scope.invoicesFilter = n;
	}
	/* -- END INVOICE MODAL -- */


	/* -- BEGIN NOTIFICATION MODAL -- */
	$rootScope.notificationFilter = 1;
	$scope.selectFilter = function (n) {
		$rootScope.notificationFilter = n;
	}
	
	$scope.showSearch = false;
	$scope.changeSearch = function(){
		if($scope.showSearch)
			$scope.showSearch=false;
		else 
			$scope.showSearch = true;
	}

	$scope.contactNew = {
		name: '',
		email: '',
		phone: ''
	}
	$scope.contacts = [
		{name: 'Mateus P', phone:'(12) 11233-1233', email: 'mateus@email.com'},
		{name: 'Mateus P', phone:'(12) 11233-1233', email: 'mateus@email.com'},
		{name: 'Mateus P', phone:'(12) 11233-1233', email: 'mateus@email.com'},
		{name: 'Mateus P', phone:'(12) 11233-1233', email: 'mateus@email.com'},
		{name: 'Mateus P', phone:'(12) 11233-1233', email: 'mateus@email.com'},
		{name: 'Mateus P', phone:'(12) 11233-1233', email: 'mateus@email.com'},
		{name: 'Mateus P', phone:'(12) 11233-1233', email: 'mateus@email.com'}
	];
	$scope.deleteContact = function(index){
		$scope.contacts.splice(index,1);
	}
	$scope.newContact = function(){
		$scope.contacts.push({name: $scope.contactNew.name, email: $scope.contactNew.email, phone: $scope.contactNew.phone})
		$scope.contactNew = {};
	}
	/* -- END NOTIFICATION MODAL -- */

	$scope.logout = function(){
		$state.go('login');
		localStorage.clear();
		$rootScope = $rootScope.$new(true);
		$scope = $scope.$new(true);
	}
})