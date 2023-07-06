angular.module("logModule").controller('logCtrl', function($scope, $modal ,logSrvc) {
		$scope.Data = {
			typeTranslate:[],
			translator: {},//map from en to fa
			logList:[],
			userList: [],
			logDesc:""
		}
		
		$scope.Func = {
			getLogList : function(){
				var start = $scope.Controller.pagination.currentPage;
				var size = $scope.Controller.pagination.perPage;
				if ($scope.Data.logDesc) {
					logSrvc.getLogPagedList($scope.Func.prepareSendData(), start, size,$scope.Data.logDesc).then(function(response){
					$scope.Data.logList = response.data;
					angular.forEach($scope.Data.logList, function (log) {
						log.showTooltip = false;
						log.tooltipContent = null;
					});
					$scope.Controller.pagination.totalItems  = response.data.totalCount;
				});
				} else {
					logSrvc.getLogPagedList($scope.Func.prepareSendData(), start, size,'').then(function(response){
					$scope.Data.logList = response.data;
					angular.forEach($scope.Data.logList, function (log) {
						log.showTooltip = false;
						log.tooltipContent = null;
					});
					$scope.Controller.pagination.totalItems  = response.data.totalCount;
				});
				}
			},
			prepareSendData: function(){
				var searchQuery = $scope.Controller.logSearchController.searchQuery || {};
				if (searchQuery.date) {
					$scope.Data.fromDate = searchQuery.date.split(",")[0]
					var timestamp = searchQuery.date.split(",")[1]
					var numdate = parseInt(timestamp)
					// convert to end of the selected date
					numdate = numdate + 86399000;
					timestamp = numdate.toString();
					$scope.Data.toDate = timestamp

				}
				var sendData = {
					type: searchQuery.type?searchQuery.type.uid:undefined,
					//username: searchQuery.username?searchQuery.username.title:undefined,
					username: searchQuery.username?searchQuery.username:undefined,
					ip_address: searchQuery.ip_address,
					from_date: searchQuery.date?searchQuery.date.split(",")[0]:undefined,
					to_date: searchQuery.date?timestamp:undefined
				}
				return sendData;
			},
			
			getUserList : function(){
				logSrvc.getUserPagedList().then(function(response){
					for ( var int = 0; int < response.data.length; int++) {
						$scope.Data.userList.push({uid:response.data[int].uid,title:response.data[int].username})
					}
					// $scope.Controller.logSearchController.searchableFieldInfo[1].itemList = $scope.Data.userList
				});
			},
			createTypeTranslate : function(){
				logSrvc.getTypeList().then(function(response){
					angular.forEach(response.data, function(type) {
						$scope.Data.typeTranslate.push({
							uid:type.key,
							title:type.displayString
						});
						$scope.Data.translator[type.key] = type.displayString;
					});
				});
			},
			// PrepareDataForExcelLink: function (query) {
			// 	var excelLink;
			// 	if (query.type) {
			// 		excelLink = '?type'+query.type
			// 	}
			// 	if (query.ip_address) {
			// 		excelLink = '&ip_address='+query.ip_address
			// 	}
			// 	if ($scope.Data.fromDate) {
			// 		excelLink = '&from_date='+$scope.Data.fromDate+'&to_date='+$scope.Data.toDate
			// 	}
			// 	if (query.username) {
			// 		excelLink = '&username='+query.username
			// 	}
			// 	return excelLink
			// },
			onExcelClick: function () {
				var excelLink = "";
				var query = {
					type: $scope.Controller.logSearchController.searchQuery.type,
					ip_address: $scope.Controller.logSearchController.searchQuery.ip_address,
					from_date:$scope.Data.fromDate,
					to_date:$scope.Data.toDate,
					username: $scope.Controller.logSearchController.searchQuery.username,
				}
				var excelLink = 'api/event_log/v2/export/csv/?type=' +( query.type ? query.type.uid : "") + '&ip_address=' + (query.ip_address ? query.ip_address : "" )+ '&from_date=' + ($scope.Data.fromDate ? $scope.Data.fromDate : "") + '&to_date=' +( $scope.Data.toDate ? $scope.Data.toDate : "") + '&username=' + (query.username ? query.username : "");
				logSrvc.downloadByLink(excelLink, "file");
			},
			onExitSearchModeClick: function(){
				$scope.Controller.logSearchController.searchQuery = {};
				$scope.Data.logDesc = null;
				$scope.Func.getLogList();
			},
			downloadLogList:function(){
				logSrvc.getDownloadLogLink($scope.Func.prepareSendData()).then(function(response){
					var file = new Blob([response.data], {type : 'csv'});
					saveAs(file, 'log_report.csv');
				});
			},
			onShowFullnameClick: function (log) {
				if (!log.tooltipContent) {
					logSrvc.getFullname(log.username).then(function (res) {
						if (res.data[0]) {
							log.tooltipContent = res.data[0].title;
							log.showTooltip = true;
						}
					});
				} else {
					log.showTooltip = !log.showTooltip;
				}
			},
			onDetailClick(detail) {
				var logInfo;
				$modal.open({
					templateUrl: 'app/lib/eventLogUI/detailsModal/detailsModal.html',
					controller : 'detailsModalCtrl',
					resolve : {
							logEventInfo: function () {
							try {
								logInfo = JSON.stringify(JSON.parse(detail), null, 4)
							} catch (e) {
								logInfo = detail
								}
							return logInfo;
						}
					}
					});
			}
		};
		
		$scope.Controller = {
			pagination: {
				totalItems: -1,
				currentPage: 1,
				perPage: 10,
				maxSize: 5,
				inOnePage: function(){
					if ($scope.Controller.pagination.totalItems <= $scope.Controller.pagination.perPage)
						return true;
					return false;
				},
				pageChanged: $scope.Func.getLogList
			},
			logSearchController: {
				advanced: false,
				searchableFieldInfo: [
      				{key:"ip_address", type:"string", label:"آدرس اینترنتی"},
      				{key:"username", type:"string", label:"نام کاربری"},
//      				{key:"username", type:"enumClientSearch", label:"کاربر", itemList:$scope.Data.userList},
    				{key:"type", type:"enum", label:"نوع", itemList:$scope.Data.typeTranslate},
                    {key:"date", type:"date", maxDate: function(fromDate) {
						if(fromDate) {
							return moment(fromDate).add(1,'w').valueOf();
						}

						return '';
					}}
    			],
				onSearchClick: $scope.Func.getLogList,
				onExitSearchModeClick: $scope.Func.onExitSearchModeClick
			}
		}
		
		var Run = function(){
			$scope.Func.getLogList();
			$scope.Func.getUserList();
			$scope.Func.createTypeTranslate();
		}
		
		Run();
});