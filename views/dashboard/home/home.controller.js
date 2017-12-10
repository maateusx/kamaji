app.controller("homeController", function($scope, $state, $rootScope, $http){
        
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

		//MAIN GRAPH
		$rootScope.req('/chart/getall/line', null, 'GET', function(suc){
			$scope.mainGraphData = [];
			$scope.mainGraphLabels = [];
			for(var i=0; i<suc.data.length; i++){
			 	var stringaux = suc.data[i].Date.split('T');
			 	$scope.mainGraphLabels.push(stringaux[0]);
			 	$scope.mainGraphData.push(suc.data[i].Close);
			}
			$scope.series = ['Value'];
			$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
			$scope.mainGraphOptions = {
			  	elements: { point: { radius: 0 } },
			    scales: {
			      yAxes: [
			        {
			          id: 'y-axis-1',
			          type: 'linear',
			          display: true,
			          position: 'left',
			          scaleShowLabels: false
			        }
			      ]
			    }
			};
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
		$scope.getDistance(0); //$scope.getTime(0);
		$scope.getDistance(1); //$scope.getTime(1);
		$scope.getDistance(2); //$scope.getTime(2);
		$scope.getDistance(3); //$scope.getTime(3);
		$scope.getDistance(4); //$scope.getTime(4);
	}
	$scope.init();

	$scope.selectMainGraph = function(n){
		$scope.selectedMainGraph = n;
		//MAIN GRAPH
		var url = '';
		if(n == 1){
			url = '/chart/getall/line';
		} else if(n == 2) {
			url = '/chart/year/indicator/0';
		} else if(n == 3) {
			url = '/chart/month/indicator/0';
		} else if(n == 4) {
			url = '/chart/week/indicator/0';
		}

		$rootScope.req(url, null, 'GET', function(suc){

			$scope.mainGraphData = [];
			$scope.mainGraphLabels = [];
			for(var i=0; i<suc.data.length; i++){
			 	var stringaux = suc.data[i].Date.split('T');
			 	$scope.mainGraphLabels.push(stringaux[0]);
			 	$scope.mainGraphData.push(suc.data[i].close);
			}
			$scope.series = ['Value'];
			$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
			$scope.mainGraphOptions = {
//			  	elements: { point: { radius: 0 } },
			    scales: {
			      yAxes: [
			        {
			          id: 'y-axis-1',
			          type: 'linear',
			          display: true,
			          position: 'left',
			          scaleShowLabels: false
			        }
			      ]
			    }
			};

			/*console.log(JSON.stringify(suc))
			$scope.labels= [];
			$scope.data=[];
			$scope.mainGraph.data = suc.data;
			for(var i=0; i<$scope.mainGraph.data.length; i++){
			 	var stringaux = $scope.mainGraph.data[i].Date.split('T');
			 	$scope.labels.push(stringaux[0]);
			 	$scope.data.push($scope.mainGraph.data[i].close);
			}
			$scope.series = [''];
			$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
			$scope.options = {
			    scales: {
			      yAxes: [
			        {
			          id: 'y-axis-1',
			          type: 'linear',
			          display: true,
			          position: 'left',
			          scaleShowLabels: false
			        }
			      ]
			    }
			};*/
			$scope.$apply();
		}, function(err){
			console.log(err);
		});
	}

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

		//GET DISTANCE
		/*$rootScope.req('/indicator/getdata/'+$scope.indicators[n].distance.id, null, 'GET', function(suc){
			$rootScope.selectedIndicator.distance.value = suc;
		}, function(error){
		})*/
	}

	//INDICATORS
	$scope.selectIndicator = function(index) {
		$rootScope.indicatorIsOn = true;
		$rootScope.selectedIndicator = $scope.indicators[index]; //Change memory address
		$scope.getDataN(index);
		$scope.secondGraph.title = $scope.indicators[index].title;
		$rootScope.req('/chart/indicator/'+$scope.indicators[index].id, null, 'GET', function(success){
			for(var i=0; i<success.data.length; i++){
			 	let dataaux = success.data[i].Date.split('T');
			 	$scope.secondGraph.labels.push(stringaux2[0]);
			 	$scope.secondGraph.data.push(success.data[i].Close);
			 }
			  $scope.secondGraph.series = [''];
			  $scope.secondGraph.datasetOverride = [{ yAxisID: 'y-axis-1' }];
			  $scope.secondGraph.options = {
			  	elements: { point: { radius: 0 } },
			    scales: {
			      yAxes: [
			        {
			          id: 'y-axis-1',
			          type: 'linear',
			          display: false,
			          position: 'left',
			          scaleShowLabels: false
			        }
			      ]
			    }
			};
		}, function(error){
			console.log(error, 'err')
		})
	}
	$scope.deselectIndicator = function() {
		$rootScope.selectedIndicator = null;
		$rootScope.indicatorIsOn = false;
	}

	$scope.turnOnIndicator = function(index){
		//DADOS DO GRAFICO1 EM BAIXO
		let indicator = $scope.indicators[index];
		alert(1);
		$rootScope.req('/chart/indicator/'+indicator.id, null, 'GET', function(success){
			alert(2);
			$scope.data2 = [];
			$scope.labels2 = [];
//			alert(success.data[0].date);
			console.log('chart/indicator turn on indicator ',JSON.stringify(success));
			//$scope.indicatorGraph = success.data;
			for(var i=0; i<success.data.length; i++){
				$scope.labels2.push(success.data[i].date);
			 	//var stringaux2 = success.data[i].date.split('T');
			 	//$scope.labels2.push(stringaux2[0]);
			 	if(index == 0){

			 	} else if(index == 1){
			 		$scope.data2.push(success.data[i].macdh);
			 	} else if(index == 2){

			 	}
			 	
			 }
			  $scope.series2 = ['series2'];
			  $scope.datasetOverride2 = [{ yAxisID: 'y-axis-1' }];
			  $scope.options2 = {
			  	elements: { point: { radius: 0 } },
			    scales: {
			      yAxes: [
			        {
			          id: 'y-axis-1',
			          type: 'linear',
			          display: true,
			          position: 'left',
			          scaleShowLabels: false
			        }
			      ]
			    }
			};
		}, function(error){
			console.log(error, 'err')
		})
		//if()
	}
	
//	$scope.notifications = [];

	$scope.notificationsRefresh = function(){
		$rootScope.req('/notification/getall', null, 'GET', function(suc){
			console.log(suc);
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
		$scope.newInvoice = {};
		$rootScope.selectedInvoice = {};
	}
	/* -- BEGIN INVOICE MODAL --*/
	

	$scope.editInvoiceShow = false;
	$scope.showEditInvoice = function(invoice){
		$scope.editInvoiceShow = true;
		$scope.newInvoice = invoice;
		$rootScope.seletecdTab = 1; 
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
			|| $rootScope.selectedInvoice.dolar_provisao == null || $rootScope.selectedInvoice.dolar_provisao == ''
			|| $rootScope.selectedInvoice.observacao == null || $rootScope.selectedInvoice.observacao == ''){
			alert("Preencha todos os campos corretamente!");
			return;
		}
		if($rootScope.selectedInvoice.valor_invoice && $rootScope.selectedInvoice.valor_invoice-Math.trunc($rootScope.selectedInvoice.valor_invoice) == 0)
			$rootScope.selectedInvoice.valor_invoice = $rootScope.selectedInvoice.valor_invoice + '.00';
		if($rootScope.selectedInvoice.dolar_provisao && $rootScope.selectedInvoice.dolar_provisao-Math.trunc($rootScope.selectedInvoice.dolar_provisao) == 0)
			$rootScope.selectedInvoice.dolar_provisao = $rootScope.selectedInvoice.dolar_provisao + '.00';

		$rootScope.req('/invoice/update/'+$rootScope.selectedInvoice.nro_invoice+'/'+$rootScope.selectedInvoice.resp_invoice+'/'+$rootScope.selectedInvoice.tipo+'/'+$rootScope.selectedInvoice.dt_emissao+'/'+$rootScope.selectedInvoice.dt_vencimento+'/'+$rootScope.selectedInvoice.fornecedor+'/'+$rootScope.selectedInvoice.valor_invoice+'/'+$rootScope.selectedInvoice.dolar_provisao+'/'+$rootScope.selectedInvoice.observacao, null, 'GET', function(suc){
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
		$rootScope.req('/invoice/delete/'+$scope.newInvoice.id, null, 'GET', function(suc){
			alert(suc);
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
		$rootScope.selectedInvoice = invoice; 
		$scope.paymentInvoiceShow = true;;
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

		if($rootScope.selectedInvoice.valor_pago-Math.trunc($rootScope.selectedInvoice.valor_pago) == 0)
			$rootScope.selectedInvoice.valor_pago = $rootScope.selectedInvoice.valor_pago + '.00';
		if($rootScope.selectedInvoice.dolar_pagamento-Math.trunc($rootScope.selectedInvoice.dolar_pagamento) == 0)
			$rootScope.selectedInvoice.dolar_pagamento = $rootScope.selectedInvoice.dolar_pagamento + '.00';

		$rootScope.req('/invoice/set_payment/'+$rootScope.selectedInvoice.nro_invoice+'/'+$rootScope.selectedInvoice.dt_pagamento+'/'+$rootScope.selectedInvoice.dolar_pagamento+'/'+$rootScope.selectedInvoice.valor_pago, null, 'GET', function(suc){
			alert('Invoice atualizado com sucesso!');
			$rootScope.selectedInvoice = {};
			$scope.newInvoice = {};
			$rootScope.seletecdTab = 2; 
			$scope.paymentInvoiceShow = false;
		}, function(err){
			console.log(err);
		}, true);	
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
		let emission = $scope.newInvoice.emission.getFullYear()+'-'+($scope.newInvoice.emission.getMonth()+1)+'-'+$scope.newInvoice.emission.getDay();
		let expirate = $scope.newInvoice.expirate.getFullYear()+'-'+($scope.newInvoice.expirate.getMonth()+1)+'-'+$scope.newInvoice.expirate.getDay();
		//trocar . por ,
		$scope.newInvoice.total += 0.00;
		$scope.newInvoice.prevision += 0.00;
		$rootScope.req('/invoice/register/'+$scope.newInvoice.num+'/'+$scope.newInvoice.resp+'/'+$scope.newInvoice.type+'/'+emission+'/'+expirate+'/'+$scope.newInvoice.forn+'/'+$scope.newInvoice.total+'/'+$scope.newInvoice.prevision+'/'+$scope.newInvoice.obs, null, 'GET', function(suc){
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
		$rootScope.req('/contact/delete/'+$scope.contacts[index].email, null, 'GET', function(suc){
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
		$rootScope.req('/contact/register/'+$scope.contactNew.name+'/'+$scope.contactNew.email+'/'+$scope.contactNew.phone, null, 'GET', function(suc){
			$scope.contacts.push($scope.contactNew);
			$scope.getContact();
			//alert(1);
			$scope.contactNew = {};
		}, function(err){
			//alert(2);
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


})