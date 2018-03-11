app.controller("homeController", function($scope, $state, $rootScope, $http){

    if(window.localStorage.getItem('email') == null || window.localStorage.getItem('email')== '' 
    || window.localStorage.getItem('password') == null || window.localStorage.getItem('password')==''){
      	window.localStorage.clear();
		$rootScope = $rootScope.$new(true);
		$scope = $scope.$new(true);
		$state.go('login');
    } 

    $scope.chartView = 1;
    $scope.changeChart = function(n){
    	$socpe.chartView = n;
    	$scope.$apply();
    }

    $rootScope.isLoading = true;

	// CONSTRUCTOR
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

	$scope.indicators = [
		{title: 'MACD', sub:'Cross', percent: null, time: '', color: 0, active: false, average: {id: 26, value: null}, deviation: {id: 27, value: null}, distance: {id: 28, value: null}, id: 1},
		{title: 'MACDH', sub:'Histogram', percent: null, time: '', color: 0, active: false, average: {id: 29, value: null}, deviation: {id: 30, value: null}, distance: {id: 31, value: null}, id: 3},
		{title: 'RSI', sub:'Bands Cross', percent: null, time: '', color: 0, active: false, average: {id: 11, value: null}, deviation: {id: 12, value: null}, distance: {id: 13, value: null}, id: 8},
		{title: 'BB Low', sub: 'Bands LB', percent: null, time: '', color: 0, active: false, average: {id: 20, value: null}, deviation: {id: 21, value: null}, distance: {id: 22, value: null}, id: 6},
		{title: 'BB Up', sub: 'Bands UB', percent: null, time: '', color: 0, active: false, average: {id: 17, value: null}, deviation: {id: 18, value: null}, distance: {id: 19, value: null}, id: 5}
	];
	$rootScope.indicatorIsOn = false;

	$scope.homeView = 1;
	$scope.changeHomeView = function(n){
		$scope.homeView = n;
	}

	$scope.forecastInvoice = [];
	$scope.forecasts = [];
	$scope.getForecastInvoice = function(){
		$rootScope.req('/forecast/invoice/getall', null, 'GET', function(suc){
			$scope.forecastInvoice = suc;
		}, function(err){
			console.log(err);
		});
	}
	$scope.getForecast = function(){
		$rootScope.req('/forecast/invoice/getall', null, 'GET', function(suc){
			$scope.forecasts = suc;
		}, function(err){
			console.log(err);
		});
	}
	$scope.getForecast();
	$scope.getForecastInvoice();

	$scope.newForest = {
		datePrevision: new Date(),
		model: 'svm',
		prevision: 30
	}
	$scope.createForest = function(){ //testar
		if($scope.newForest.model == null || $scope.newForest.model == ''){
			alert('Informe um modelo.')
			return;
		} else if($scope.newForest.prevision == null || $scope.newForest.prevision == ''){
			alert('Informe uma previsão.')
			return;
		}

		$rootScope.req('/forecast/label/'+$scope.newForest.model+'/'+$scope.newForest.prevision, null, 'GET', function(suc){
			alert('Adicionado com sucesso!')
			$scope.getForecast();
		}, function(err){
			alert('Ops, ocorreu um erro!');
			console.log(err);
		});
	}

	$scope.getDistance = function(n){
		$rootScope.req('/indicator/getdata/'+$scope.indicators[n].distance.id, null, 'GET', function(suc){
			$scope.indicators[n].distance.value = suc;
			$scope.indicators[n].percent = suc*100 | 0;
		}, function(err){
			console.log(err);
		});
	}
	$scope.getTime = function(n){
		$rootScope.req('/strategy/indicatordays/'+$scope.indicators[n].id, null, 'GET', function(suc){
			$scope.indicators[n].time = suc;
		}, function(err){
			console.log(err);
		});
	}

	$scope.init = function() {
		$rootScope.req('/indicator/getdata/7', null, 'GET', function(suc){
			$scope.navDatas[0].title = suc;
		}, function(err){
			console.log('/indicator/getdata/7',err);
		});

		$rootScope.req('/indicator/getdata/10', null, 'GET', function(suc){
			$scope.navDatas[1].title = suc;
			if(suc > 0){
				$scope.navDatas[1].color = 1;
			} else {
				$scope.navDatas[1].color = 0;
			}
		}, function(err){
			console.log('/indicator/getdata/10',err);
		});

		$rootScope.req('/indicator/getdata/high', null, 'GET', function(suc){
			$scope.navDatas[2].title = suc;
		}, function(err){
			console.log('/indicator/getdata/high',err);
		});

		$rootScope.req('/indicator/getdata/low', null, 'GET', function(suc){
			$scope.navDatas[3].title = suc;
		}, function(err){
			console.log('/indicator/getdata/low',err);
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
			if(suc == 0){
				$scope.mainGraph.status = 'Tendência Indefinida';
				$scope.mainGraph.color =  0;
			} else if(suc==1){
				$scope.mainGraph.status = 'Movimento Lateral';
				$scope.mainGraph.color =  1;
			} else {
				$scope.mainGraph.status = 'Tendência de Subida';
				$scope.mainGraph.color =  2;
			}
			$rootScope.isLoading = false;
		}, function(err){
			$rootScope.isLoading = false;
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
	setInterval(function(){ $scope.init(); }, 30000);

	$scope.getDataN = function(n){
		//GET AVERAGE
		$rootScope.req('/indicator/getdata/'+$scope.indicators[n].average.id, null, 'GET', function(suc){
			$rootScope.selectedIndicator.average.value = suc;
		}, function(error){
		})

		//GET DEVIATION
		$rootScope.req('/indicator/getdata/'+$scope.indicators[n].deviation.id, null, 'GET', function(suc){
			$rootScope.selectedIndicator.deviation.value = suc;
		}, function(error){
		})
	}

	//INDICATORS
	$scope.selectIndicator = function(index) {
		$scope.getDataN(index);
		$rootScope.indicatorIsOn = true;
		$scope.changeHomeView = 2;
		$rootScope.selectedIndicator = $scope.indicators[index];
		$scope.secondChartView = index;
	}
	$scope.deselectIndicator = function() {
		$rootScope.selectedIndicator = null;
		$rootScope.indicatorIsOn = false;
		$scope.changeHomeView = 1;
	}

	$scope.turnOnIndicator = function(){
		if(($scope.indicators[0].active || $scope.indicators[1].active) && $scope.indicators[2].active && ($scope.indicators[3].active || $scope.indicators[4].active)){
			$scope.chartView = 6; //all
		} else if(($scope.indicators[0].active || $scope.indicators[1].active) && !$scope.indicators[2].active && ($scope.indicators[3].active || $scope.indicators[4].active)){
			$scope.chartView = 5; //bb, macd
		} else if(!$scope.indicators[0].active && !$scope.indicators[1].active && !$scope.indicators[2].active && !$scope.indicators[3].active && !$scope.indicators[4].active){
			$scope.chartView = 1; //main
		} else if(($scope.indicators[0].active || $scope.indicators[1].active) && !$scope.indicators[2].active && !$scope.indicators[3].active && !$scope.indicators[4].active){
			$scope.chartView = 2; //macd
		} else if(!$scope.indicators[0].active && !$scope.indicators[1].active && $scope.indicators[2].active && !$scope.indicators[3].active && !$scope.indicators[4].active){
			$scope.chartView = 4; //rsi
		} else if(!$scope.indicators[0].active && !$scope.indicators[1].active && !$scope.indicators[2].active &&($scope.indicators[3].active || $scope.indicators[4].active)){
			$scope.chartView = 3; //bb
		} else if(!$scope.indicators[0].active && !$scope.indicators[1].active && $scope.indicators[2].active &&($scope.indicators[3].active || $scope.indicators[4].active)){
			$scope.chartView = 8; //rsi,bb
		} else if(($scope.indicators[0].active || $scope.indicators[1].active) && $scope.indicators[2].active && !$scope.indicators[3].active && !$scope.indicators[4].active){
			$scope.chartView = 7; //rsi,macd
		}
	}

	$scope.updateIndicatorDays = function(){
		$scope.selectedIndicator.time = $scope.selectedIndicator.time.replace(/\D+/g, '');
		if($scope.selectedIndicator.time == null || $scope.selectedIndicator.time == '')
			return;
		$rootScope.req('/strategy/setindicatordays/'+$scope.selectedIndicator.id+'/'+$scope.selectedIndicator.time+'/'+$rootScope.user.id, null, 'GET', function(suc){
		}, function(err){
			console.log(err);
		});
	}
	
	$scope.notifications = [];
	$scope.notificationsRefresh = function(){
		$rootScope.req('/notification/getall', null, 'GET', function(suc){
			$scope.notifications = suc;
		}, function(err){
			console.log(err);
		});
	}
	$scope.notificationsRefresh();

	$scope.notificationsStrategiesProfile = [
		{title: 'Consevador', active: false},
		{title: 'Muito Consevador', active: false},
		{title: 'Ultra Consevador', active: false}
	]
	$scope.refreshStrategiesProfile = function(index){
		if($scope.notificationsStrategiesProfile[index].active){
			for(var i = 0; i<$scope.notificationsStrategiesProfile.length; i++){
				if($scope.notificationsStrategiesProfile[i].active && i!=index)
					$scope.notificationsStrategiesProfile[i].active = false;
			}
		}
		let idStrategy = index + 1;
		$rootScope.req('/checkbox/' + idStrategy+'/'+$rootScope.user.id, null, 'GET', function(suc){
			$scope.getStrategies();
		}, function(err){
			console.log(err);
		});
	}

	$scope.notificationsStrategies = [
		{title: 'MACD', sub: 'Cross', percent: 0, active: true, id:1},
		{title: 'MACD', sub: 'Histogram', percent: 0, active: true, id:3},
		{title: 'Boolinger', sub: 'Bands UB', percent: 0, active: true, id:5},
		{title: 'Boolinger', sub: 'Bands LB', percent: 0, active: true, id:6},
		{title: 'RSI', sub: 'Cross', percent: 0, active: true, id:8}
	];
	$scope.getStrategies = function(){
		$rootScope.req('/strategy/getall', null, 'GET', function(suc){
			for(var i=0; i<suc.length; i++){
				if(suc[i].indicator == 1){
					$scope.notificationsStrategies[0].active = suc[i].active;
					$scope.notificationsStrategies[0].percent = suc[i].accuracy;
				} else if(suc[i].indicator == 3){
					$scope.notificationsStrategies[1].active = suc[i].active;
					$scope.notificationsStrategies[1].percent = suc[i].accuracy;
				} else if(suc[i].indicator == 5){
					$scope.notificationsStrategies[2].active = suc[i].active;
					$scope.notificationsStrategies[2].percent = suc[i].accuracy;
				} else if(suc[i].indicator == 6){
					$scope.notificationsStrategies[3].active = suc[i].active;
					$scope.notificationsStrategies[3].percent = suc[i].accuracy;
				} else if(suc[i].indicator == 8){
					$scope.notificationsStrategies[4].active = suc[i].active;
					$scope.notificationsStrategies[4].percent = suc[i].accuracy;
				}
			}
		}, function(err){
			console.log(err);
		});
	}
	$scope.getStrategies();
	$scope.refreshStrategies = function(index){
		$rootScope.req('/strategy/updateaccuracy/'+$scope.notificationsStrategies[index].id+'/'+$scope.notificationsStrategies[index].percent+'/'+$rootScope.user.id, null, 'GET', function(suc){
		}, function(err){
			console.log(err);
		});
	}
	$scope.updateFlag = function(index){
		var flag = 0;
		if($scope.notificationsStrategies[index].active)
			flag = 1;
		$rootScope.req('/strategy/updateflag/'+$scope.notificationsStrategies[index].id+'/'+flag+'/'+$rootScope.user.id, null, 'GET', function(suc){
		}, function(err){
			console.log(err);
		});
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
		$scope.newInvoice = {};
		$rootScope.selectedInvoice = {};
	}
	/* -- BEGIN INVOICE MODAL --*/

	$scope.editInvoiceShow = false;
	$scope.showEditInvoice = function(invoice){
		$scope.editInvoiceShow = true;
		$scope.newInvoice = Object.assign({}, invoice);
		$rootScope.seletecdTab = 1; 

		var date1 = $scope.newInvoice.dt_emissao.split('-');
		var date2 = date1[0] +'/'+ date1[1]+ '/'+ date1[2];
		$scope.newInvoice.dt_emissao = new Date(date2); 

		var date1 = $scope.newInvoice.dt_vencimento.split('-');
		var date2 = date1[0] +'/'+ date1[1]+ '/'+ date1[2];
		$scope.newInvoice.dt_vencimento = new Date(date2); 
		//$scope.newInvoice.dt_emissao.setDate(date.getDate() - 1);
	}
	$scope.cancelUpdateInvoice = function(){
		$scope.editInvoiceShow = false;
		$scope.paymentInvoiceShow = false;
		$scope.newInvoice = {};
		$rootScope.selectedInvoice = {};
		$rootScope.seletecdTab = 2; 
	}
	$scope.updateInvoice = function(){
		$rootScope.selectedInvoice = $scope.newInvoice;
		if($rootScope.selectedInvoice.nro_invoice == null || $rootScope.selectedInvoice.nro_invoice == ''
			|| $rootScope.selectedInvoice.resp_invoice == null || $rootScope.selectedInvoice.resp_invoice == ''
			|| $rootScope.selectedInvoice.tipo == null || $rootScope.selectedInvoice.tipo == ''
			|| $rootScope.selectedInvoice.dt_emissao == null || $rootScope.selectedInvoice.dt_emissao == ''
			|| $rootScope.selectedInvoice.dt_vencimento == null || $rootScope.selectedInvoice.dt_vencimento == ''
			|| $rootScope.selectedInvoice.fornecedor == null || $rootScope.selectedInvoice.fornecedor == ''
			|| $rootScope.selectedInvoice.valor_invoice == null || $rootScope.selectedInvoice.valor_invoice == '' 
			|| $rootScope.selectedInvoice.dolar_provisao == null || $rootScope.selectedInvoice.dolar_provisao == ''){
			alert("Preencha todos os campos corretamente!");
			return;
		}

		if($rootScope.selectedInvoice.observacao == null || $rootScope.selectedInvoice.observacao == '')
			$rootScope.selectedInvoice.observacao = 'null';

		if($rootScope.selectedInvoice.valor_invoice && $rootScope.selectedInvoice.valor_invoice-Math.trunc($rootScope.selectedInvoice.valor_invoice) == 0)
			$rootScope.selectedInvoice.valor_invoice = $rootScope.selectedInvoice.valor_invoice + '.00';
		if($rootScope.selectedInvoice.dolar_provisao && $rootScope.selectedInvoice.dolar_provisao-Math.trunc($rootScope.selectedInvoice.dolar_provisao) == 0)
			$rootScope.selectedInvoice.dolar_provisao = $rootScope.selectedInvoice.dolar_provisao + '.00';

		var emissao = $rootScope.selectedInvoice.dt_emissao.getFullYear()+'-'+($rootScope.selectedInvoice.dt_emissao.getMonth()+1)+'-'+$rootScope.selectedInvoice.dt_emissao.getDate();
		var vencimento = $rootScope.selectedInvoice.dt_vencimento.getFullYear()+'-'+($rootScope.selectedInvoice.dt_vencimento.getMonth()+1)+'-'+$rootScope.selectedInvoice.dt_vencimento.getDate();
		
		$rootScope.selectedInvoice.dt_emissao = emissao;
		$rootScope.selectedInvoice.dt_vencimento = vencimento;
		$rootScope.req('/invoice/update/'+$rootScope.selectedInvoice.nro_invoice+'/'+$rootScope.selectedInvoice.resp_invoice+'/'+$rootScope.selectedInvoice.tipo+'/'+$rootScope.selectedInvoice.dt_emissao+'/'+$rootScope.selectedInvoice.dt_vencimento+'/'+$rootScope.selectedInvoice.fornecedor+'/'+$rootScope.selectedInvoice.valor_invoice+'/'+$rootScope.selectedInvoice.dolar_provisao+'/'+$rootScope.selectedInvoice.observacao+'/'+$rootScope.user.id, null, 'GET', function(suc){
			alert('Invoice atualizado com sucesso!');
			$rootScope.selectedInvoice = {};
			$scope.newInvoice = {};
			$scope.getAllInvoices();
			$rootScope.seletecdTab = 2; 
			$scope.editInvoiceShow = false;
		}, function(err){
			console.log(err);
		});	
	}
	$scope.deleteInvoice = function(idx){
		if(idx){
			$scope.newInvoice = {
				id: idx
			}
		}
		$rootScope.req('/invoice/delete/'+$scope.newInvoice.id+'/'+$rootScope.user.id, null, 'GET', function(suc){
			alert('Invoice deletada com sucesso!');
			$rootScope.selectedInvoice = {};
			$scope.newInvoice = {};
			$rootScope.seletecdTab = 2;
			$scope.editInvoiceShow = false;
			$scope.getAllInvoices();
		}, function(err){
			console.log(err);
		});
	}

	$scope.notificationInvoice = function(invoice){
		$rootScope.req('/invoice/notification/activate/'+invoice.id, null, 'GET', function(suc){
			alert('Notificação ativada com sucesso!');
		}, function(err){
			console.log(err);
		});
	}

	$scope.paymentInvoiceShow = false;
	$scope.showPaymentInvoice = function(invoice){
		$scope.newInvoice = invoice;
		$scope.paymentInvoiceShow = true;
		$rootScope.seletecdTab = 1; 
	}
	$scope.payInvoice = function(){
		$rootScope.selectedInvoice = $scope.newInvoice;
		if($rootScope.selectedInvoice.nro_invoice == null || $rootScope.selectedInvoice.nro_invoice == ''
			|| $rootScope.selectedInvoice.dt_pagamento == null || $rootScope.selectedInvoice.dt_pagamento == ''
			|| $rootScope.selectedInvoice.dolar_pagamento == null || $rootScope.selectedInvoice.dolar_pagamento == ''
			|| $rootScope.selectedInvoice.valor_pago == null || $rootScope.selectedInvoice.valor_pago == ''){
			alert("Preencha todos os campos corretamente!");
			return;
		}

		if($rootScope.selectedInvoice.imposto == null || $rootScope.selectedInvoice.imposto == '')
			$rootScope.selectedInvoice.imposto = 0.00;

		if($rootScope.selectedInvoice.valor_pago-Math.trunc($rootScope.selectedInvoice.valor_pago) == 0)
			$rootScope.selectedInvoice.valor_pago = $rootScope.selectedInvoice.valor_pago + '.00';
		if($rootScope.selectedInvoice.dolar_pagamento-Math.trunc($rootScope.selectedInvoice.dolar_pagamento) == 0)
			$rootScope.selectedInvoice.dolar_pagamento = $rootScope.selectedInvoice.dolar_pagamento + '.00';
		if($rootScope.selectedInvoice.imposto-Math.trunc($rootScope.selectedInvoice.imposto) == 0)
			$rootScope.selectedInvoice.imposto = $rootScope.selectedInvoice.imposto + '.00';

		let pagamento = $rootScope.selectedInvoice.dt_pagamento.getFullYear()+'-'+($rootScope.selectedInvoice.dt_pagamento.getMonth()+1)+'-'+$rootScope.selectedInvoice.dt_pagamento.getDate();
		$rootScope.selectedInvoice.dt_pagamento = pagamento;
		$rootScope.req('/invoice/set_payment/'+$rootScope.selectedInvoice.id+'/'+pagamento+'/'+$rootScope.selectedInvoice.dolar_pagamento+'/'+$rootScope.selectedInvoice.valor_pago+'/'+$rootScope.selectedInvoice.imposto+'/'+$rootScope.user.id, null, 'GET', function(suc){
			alert('Invoice atualizado com sucesso!');
			$rootScope.selectedInvoice = {};
			$scope.newInvoice = {};
			$rootScope.seletecdTab = 2; 
			$scope.paymentInvoiceShow = false;
			$scope.getAllInvoices();
		}, function(err){
			console.log(err);
		}, true);	
	}

	$scope.newInvoice = {};
	$scope.createInvoice = function()
	{
		console.log($scope.newInvoice);
		if($scope.newInvoice.nro_invoice == null || $scope.newInvoice.nro_invoice == ''
			|| $scope.newInvoice.resp_invoice == null || $scope.newInvoice.resp_invoice == ''
			|| $scope.newInvoice.tipo == null || $scope.newInvoice.tipo == ''
			|| $scope.newInvoice.dt_emissao == null || $scope.newInvoice.dt_emissao == ''
			|| $scope.newInvoice.dt_vencimento == null || $scope.newInvoice.dt_vencimento == ''
			|| $scope.newInvoice.fornecedor == null || $scope.newInvoice.fornecedor == ''
			|| $scope.newInvoice.valor_invoice == null || $scope.newInvoice.valor_invoice == '' 
			|| $scope.newInvoice.dolar_provisao == null || $scope.newInvoice.dolar_provisao == ''){
			alert("Preencha todos os campos corretamente!");
			return;
		}

		if($scope.newInvoice.observacao == null || $scope.newInvoice.observacao == '')
			$scope.newInvoice.observacao = 'null';

		if($scope.newInvoice.valor_invoice && $scope.newInvoice.valor_invoice-Math.trunc($scope.newInvoice.valor_invoice) == 0)
			$scope.newInvoice.valor_invoice = $scope.newInvoice.valor_invoice + '.00';
		if($scope.newInvoice.dolar_provisao && $scope.newInvoice.dolar_provisao-Math.trunc($scope.newInvoice.dolar_provisao) == 0)
			$scope.newInvoice.dolar_provisao = $scope.newInvoice.dolar_provisao + '.00';

	
		var emission = $scope.newInvoice.dt_emissao.getFullYear()+'-'+($scope.newInvoice.dt_emissao.getMonth()+1)+'-'+$scope.newInvoice.dt_emissao.getDate();
		var expirate = $scope.newInvoice.dt_vencimento.getFullYear()+'-'+($scope.newInvoice.dt_vencimento.getMonth()+1)+'-'+$scope.newInvoice.dt_vencimento.getDate();
		
		$scope.newInvoice.dt_emissao = emission;
		$scope.newInvoice.dt_vencimento = expirate;

		$scope.newInvoice.total += 0.00;
		$scope.newInvoice.prevision += 0.00;
		$rootScope.req('/invoice/register/'+$scope.newInvoice.nro_invoice+'/'+$scope.newInvoice.resp_invoice+'/'+$scope.newInvoice.tipo+'/'+emission+'/'+expirate+'/'+$scope.newInvoice.fornecedor+'/'+$scope.newInvoice.valor_invoice+'/'+$scope.newInvoice.dolar_provisao+'/'+$scope.newInvoice.observacao+'/'+$rootScope.user.id, null, 'GET', function(suc){
			alert('Invoice criado com sucesso!');
			$scope.newInvoice = {};
			$scope.getAllInvoices();
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
			console.log('/invoice/getclose', err);
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
		$rootScope.req('/contact/getall', null, 'GET', function(suc){
			$scope.contacts = suc;
		}, function(err){
			console.log(err);
		});
	}
	$scope.getContact();
	$scope.deleteContact = function(index){
		$rootScope.req('/contact/delete/'+$scope.contacts[index].email+'/'+$rootScope.user.id, null, 'GET', function(suc){
			$scope.contacts.splice(index,1);
			$scope.getContact();
		}, function(err){
			console.log(err);
		});
	}
	$scope.newContact = function(){
		if($scope.contactNew.name == null || $scope.contactNew.name == ''
			|| $scope.contactNew.email == null || $scope.contactNew.email == ''
			|| $scope.contactNew.phone == null || $scope.contactNew.phone == ''){
			alert('Preencha todos os campos corretamente!');
			return;
		}
		$rootScope.req('/contact/register/'+$scope.contactNew.name+'/'+$scope.contactNew.email+'/'+$scope.contactNew.phone+'/'+$rootScope.user.id, null, 'GET', function(suc){
			$scope.contacts.push($scope.contactNew);
			$scope.getContact();
			$scope.contactNew = {};
		}, function(err){
			console.log(err);
		});
	}
	/* -- END NOTIFICATION MODAL -- */

	/*BEGIN RELATORIOS*/
	$scope.relatorios = [];
	$scope.getRelatorios = function(){
		$rootScope.req('/relatorio/getall', null, 'GET', function(suc){
			$scope.relatorios = [];
		}, function(err){
			console.log(err);
		});
	}
	/*END RELATORIOS*/

	$scope.refreshPrice = function(){
		$scope.newInvoice.valor_pago = $scope.newInvoice.valor_invoice * $scope.newInvoice.dolar_pagamento;
		$scope.$apply();
	}

	$scope.notices=[];
	$scope.getNotices = function(){
		$http({
	      url: 'https://news-headlines.tradingview.com/headlines/yahoo/category/currencies/?locale=br',
	      method: 'GET',
	      data: null  
	    })
	    .then(function(data){
	    	$scope.notices = data.data;
	    })
	}
	$scope.getNotices();

	$scope.showActuality = 1;
	$scope.selectActulity = function(n){
		$scope.showActuality = n;
	}

	$scope.logout = function(){
		window.localStorage.clear();
		$rootScope = $rootScope.$new(true);
		$scope = $scope.$new(true);
		location.replace('/login');
	}

})