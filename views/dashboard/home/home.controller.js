app.controller("homeController", function($scope, $state, $rootScope, $http){

	$rootScope.admin = true;

	// CONSTRUCTOR
	$scope.user = {
		avatar: 'img/user-placeholder.jpg',
		name: 'Mateus Pereira'
	};

	$scope.coinType = 'USD/BRL';

	$scope.navDatas = [
		{title: 'Não informado', sub: 'close'},
		{title: 'Não informado', sub: '24 Hour Change', color: 1},
		{title: 'Não informado', sub: 'High'},
		{title: 'Não informado', sub: 'Low'}
	];

	$scope.mainGraph = {
		status: 'Não informado',
		color: 0,
		data: null
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

	$scope.indicators = [
		{title: 'MACD', percent: null, time: '', color: 0, active: false, average: {id: 26, value: null}, deviation: {id: 27, value: null}, distance: {id: 28, value: null}, id: 1},
		{title: 'MACDH', percent: null, time: '', color: 0, active: false, average: {id: 29, value: null}, deviation: {id: 30, value: null}, distance: {id: 31, value: null}, id: 3},
		{title: 'RSI', percent: null, time: '', color: 0, active: false, average: {id: 11, value: null}, deviation: {id: 12, value: null}, distance: {id: 13, value: null}, id: 8},
		{title: 'BB Low', percent: null, time: '', color: 0, active: false, average: {id: 20, value: null}, deviation: {id: 21, value: null}, distance: {id: 22, value: null}, id: 6},
		{title: 'BB Up', percent: null, time: '', color: 0, active: false, average: {id: 17, value: null}, deviation: {id: 18, value: null}, distance: {id: 19, value: null}, id: 5}
	];
	$rootScope.indicatorIsOn = false;

	$scope.getDistance = function(n){
		$rootScope.req('/indicator/getdata/'+$scope.indicators[n].distance.id, null, 'GET', function(suc){
			$scope.indicators[n].distance.value = suc;
			$scope.indicators[n].percent = suc*100 | 0;
		}, function(err){
			console.log(err);
		});
	}
	$scope.getTime = function(n){
		$rootScope.req('/strategy/indicator_days/'+$scope.indicators[n].id, null, 'GET', function(suc){
			$scope.indicators[n].time = suc;
		}, function(err){
			console.log(err);
		});
	}

	$scope.init = function() {
		$rootScope.req('/indicator/getdata/7', null, 'GET', function(suc){
			$scope.navDatas[0].title = suc;
		}, function(err){
			console.log(err);
		});

		$rootScope.req('/indicator/getdata/10', null, 'GET', function(suc){
			$scope.navDatas[1].title = suc;
			if(suc > 0){
				$scope.navDatas[1].color = 1;
			} else {
				$scope.navDatas[1].color = 0;
			}
		}, function(err){
			console.log(err);
		});

		$rootScope.req('/indicator/getdata/high', null, 'GET', function(suc){
			$scope.navDatas[2].title = suc;
		}, function(err){
			console.log(err);
		});

		$rootScope.req('/indicator/getdata/low', null, 'GET', function(suc){
			$scope.navDatas[3].title = suc;
		}, function(err){
			console.log(err);
		});

		$rootScope.req('/chart/getall/line', null, 'GET', function(suc){
			console.log('line: ' + suc);
			$scope.mainGraph.data = suc;
		}, function(err){
			console.log(err);
		});

		$rootScope.req('/signal/getall', null, 'GET', function(suc){
			for(var i=0; i<suc.length; i++){
				for(var j=0; j<$scope.indicators.length; j++){
					if(suc[i] == $scope.indicators[j].id)
						$scope.indicators[j].color = 1;
				}
			}
		}, function(err){
			console.log(err);
		});

		$rootScope.req('/overview', null, 'GET', function(suc){
			if(suc){
				$scope.mainGraph.status = 'Tendência de Subida';
				$scope.mainGraph.color =  1;
			} else {
				$scope.mainGraph.status = 'Tendência Indefinida';
				$scope.mainGraph.color =  0;
			}
		}, function(err){
			console.log(err);
		});

		//GET DISTANCE
		$scope.getDistance(0); $scope.getTime(0);
		$scope.getDistance(1); $scope.getTime(1);
		$scope.getDistance(2); $scope.getTime(2);
		$scope.getDistance(3); $scope.getTime(3);
		$scope.getDistance(4); $scope.getTime(4);
	}
	$scope.init();

	//INDICATORS
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
		//DADOS DO GRAFICO1 EM BAIXO
		let indicator = $scope.indicators[index];
		$rootScope.req('/chart/indicator/'+indicator.id, null, 'GET', function(success){
			console.log(success, 'success');
		}, function(error){
			console.log(error, 'err')
		})
	}
	
//	$scope.notifications = [];

	$scope.notificationsRefresh = function(){
		$rootScope.req('/notification/getall', null, 'GET', function(suc){
			suc = suc.slice(0, 1) + suc.slice(2);
			suc = suc.slice(0,suc.length-2) + suc.slice(suc.length)+']';
			suc=JSON.parse(suc);
			$scope.notifications = suc;
		}, function(err){
			console.log(err);
		});
	}
	$scope.notificationsRefresh();

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
		$scope.paymentInvoiceShow = false;
		$scope.editInvoiceShow = false;
	}
	/* -- BEGIN INVOICE MODAL --*/
	

	$scope.editInvoiceShow = false;
	$scope.showEditInvoice = function(invoice){
		$scope.newInvoice = invoice;
		$rootScope.seletecdTab = 1; 
	}
	$scope.updateInvoice = function(){
		$rootScope.selectedInvoice = $scope.newInvoice;
		if($rootScope.selectedInvoice.num == null || $rootScope.selectedInvoice.num == ''
			|| $rootScope.selectedInvoice.resp == null || $rootScope.selectedInvoice.resp == ''
			|| $rootScope.selectedInvoice.type == null || $rootScope.selectedInvoice.type == ''
			|| $rootScope.selectedInvoice.emission == null || $rootScope.selectedInvoice.emission == ''
			|| $rootScope.selectedInvoice.expirate == null || $rootScope.selectedInvoice.expirate == ''
			|| $rootScope.selectedInvoice.forn == null || $rootScope.selectedInvoice.forn == ''
			|| $rootScope.selectedInvoice.total == null || $rootScope.selectedInvoice.total == '' 
			|| $rootScope.selectedInvoice.prevision == null || $rootScope.selectedInvoice.prevision == ''
			|| $rootScope.selectedInvoice.obs == null || $rootScope.selectedInvoice.obs == ''){
			alert("Preencha todos os campos corretamente!");
			return;
		}
		//trocar . por ,
		$rootScope.req('/invoice/update/'+$rootScope.selectedInvoice.num+'/'+$rootScope.selectedInvoice.resp+'/'+$rootScope.selectedInvoice.type+'/'+$rootScope.selectedInvoice.emission+'/'+$rootScope.selectedInvoice.expirate+'/'+$rootScope.selectedInvoice.forn+'/'+$rootScope.selectedInvoice.total+'/'+$rootScope.selectedInvoice.prevision+'/'+$rootScope.selectedInvoice.obs, null, 'GET', function(suc){
			alert('Invoice atualizado com sucesso!');
			$rootScope.selectedInvoice = {};
			$rootScope.seletecdTab = null; 
			$scope.editInvoiceShow = false;
		}, function(err){
			console.log(err);
		});	
	}

	$scope.paymentInvoiceShow = false;
	$scope.showPaymentInvoice = function(invoice){
		$rootScope.selectedInvoice = invoice; 
	}
	$scope.payInvoice = function(){
		if($rootScope.selectedInvoice.num == null || $rootScope.selectedInvoice.num == ''
			|| $rootScope.selectedInvoice.payDate == null || $rootScope.selectedInvoice.payDate == ''
			|| $rootScope.selectedInvoice.payDolar == null || $rootScope.selectedInvoice.payDolar == ''
			|| $rootScope.selectedInvoice.payTotal == null || $rootScope.selectedInvoice.payTotal == ''){
			alert("Preencha todos os campos corretamente!");
			return;
		}
		//trocar . por ,
		$rootScope.req('/invoice/set_payment/'+$rootScope.selectedInvoice.num+'/'+$rootScope.selectedInvoice.payDate+'/'+$rootScope.selectedInvoice.payDolar+'/'+$rootScope.selectedInvoice.payTotal, null, 'GET', function(suc){
			alert('Invoice atualizado com sucesso!');
			$rootScope.selectedInvoice = {};
			$rootScope.seletecdTab = null; 
			$scope.paymentInvoiceShow = false;
		}, function(err){
			console.log(err);
		});	
	}

	$scope.newInvoice = {};
	$scope.createInvoice = function()
	{
		if($scope.newInvoice.num == null || $scope.newInvoice.num == ''
			|| $scope.newInvoice.resp == null || $scope.newInvoice.resp == ''
			|| $scope.newInvoice.type == null || $scope.newInvoice.type == ''
			|| $scope.newInvoice.emission == null || $scope.newInvoice.emission == ''
			|| $scope.newInvoice.expirate == null || $scope.newInvoice.expirate == ''
			|| $scope.newInvoice.forn == null || $scope.newInvoice.forn == ''
			|| $scope.newInvoice.total == null || $scope.newInvoice.total == '' 
			|| $scope.newInvoice.prevision == null || $scope.newInvoice.prevision == ''
			|| $scope.newInvoice.obs == null || $scope.newInvoice.obs == ''){
			alert("Preencha todos os campos corretamente!");
			return;
		}
		//trocar . por ,
		$rootScope.req('/invoice/register/'+$scope.newInvoice.num+'/'+$scope.newInvoice.resp+'/'+$scope.newInvoice.type+'/'+$scope.newInvoice.emission+'/'+$scope.newInvoice.expirate+'/'+$scope.newInvoice.forn+'/'+$scope.newInvoice.total+'/'+$scope.newInvoice.prevision+'/'+$scope.newInvoice.obs, null, 'GET', function(suc){
			alert('Invoice criado com sucesso!');
			$scope.newInvoice = {};
		}, function(err){
			console.log(err);
		});
	}

	$scope.invoicesFilter = 1;
	$scope.selectInvoiceFilter = function(n){
		$scope.invoicesFilter = n;
	}

	$scope.openInvoices = [];
	$scope.getAllInvoices = function(){
		$rootScope.req('/invoice/getopen', null, 'GET', function(suc){
			$scope.openInvoices = suc;
		}, function(err){
			console.log(err);
		});
		$rootScope.req('/invoice/getclose', null, 'GET', function(suc){
			$scope.closeInvoices = suc;
		}, function(err){
			console.log(err);
		});
	}
	$scope.getAllInvoices();
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
	$scope.contacts = [];
	$scope.getContact = function(){
		$rootScope.req('/contacts/getall', null, 'GET', function(suc){
			$scope.contacts = suc;
		}, function(err){
			console.log(err);
		});
	}
	$scope.getContact();
	$scope.deleteContact = function(index){
		$scope.contacts.splice(index,1);
	}
	$scope.newContact = function(){
		if($scope.contactNew.name == null || $scope.contactNew.name == ''
			|| $scope.contactNew.email == null || $scope.contactNew.email == ''
			|| $scope.contactNew.phone == null || $scope.contactNew.phone == ''){
			alert('Preencha todos os campos corretamente!');
			return;
		}
		$rootScope.req('/contacts/register/'+$scope.contactNew.name+'/'+$scope.contactNew.email+'/'+$scope.contactNew.phone, null, 'GET', function(suc){
			$scope.contacts.push($scope.contactNew);
			$scope.contactNew = {};
		}, function(err){
			console.log(err);
		});
	}
	/* -- END NOTIFICATION MODAL -- */

	$scope.logout = function(){
		$state.go('login');
		localStorage.clear();
		$rootScope = $rootScope.$new(true);
		$scope = $scope.$new(true);
	}

 /* ---------------------- */

	TESTER = document.getElementById('tester');

	var data = [{
    x: [1, 2, 3, 4, 5],
    y: [1, 2, 4, 8, 16] }];


    var trace1 = {
	  x: [1, 2, 3, 4],
	  y: [10, 15, 13, 17],
	  mode: 'markers',
	  marker: {
	    color: 'rgb(219, 64, 82)',
	    size: 12
	  }
	};

	var trace2 = {
	  x: [2, 3, 4, 5],
	  y: [16, 5, 11, 9],
	  mode: 'lines',
	  line: {
	    color: 'rgb(55, 128, 191)',
	    width: 3
	  }
	};

	var trace3 = {
	  x: [1, 2, 3, 4],
	  y: [12, 9, 15, 12],
	  mode: 'lines+markers',
	  marker: {
	    color: 'rgb(128, 0, 128)',
	    size: 8
	  },
	  line: {
	    color: 'rgb(128, 0, 128)',
	    width: 1
	  }
	};

	var layout = {
	   scene:{
		xaxis: {
		 backgroundcolor: "rgb(255,255,255,0)",
		 showbackground: false,
		}, 
	    yaxis: {
	     backgroundcolor: "rgb(255,255,255)",
	     showbackground: false,
	    }, 
	    zaxis: {
	     backgroundcolor: "rgb(255,255,255)",
	     showbackground: false,
	    }}
	};
Plotly.plot( TESTER, data, layout);

/* Current Plotly.js version */
console.log( Plotly.BUILD );
})