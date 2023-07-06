angular.module('secretariatModule').controller('reserveListCtrl',
	function($scope, $state, $rootScope, $sce, secretariatSrvc, vtShowMessageSrvc, reserveListSrvc,cartableKatebSrvc,configObj, $timeout) {
	$scope.Data = {
		reservationList: [],
		configObj: configObj,
		statusList: [{ title: "در انتظار ثبت به عنوان نامه" }, { title: "ابطال شده" }, { title: "ثبت شده به عنوان نامه" }],
		},

        $scope.Func = {
            getTabList: function () {
					$scope.Data.tabList = [{
						id: 0,
						title: 'اطلاعات نامه',
					},]
			},
			onSearchClick: function (advancedMode) {
			if(advancedMode){
				$scope.Func.onChangeSearchModeClick('advanced');
				$scope.Controller.listController.searchQuery = $scope.Controller.searchController.searchQuery;
				$scope.Controller.listController.searchableFieldInfo = $scope.Controller.searchController.searchableFieldInfo;
			}else{
				$scope.Func.onChangeSearchModeClick('quick');
				$scope.Controller.listController.searchQuery = $scope.Controller.searchController.searchQuery;
				$scope.Controller.listController.searchableFieldInfo = $scope.Controller.searchController.searchableFieldInfo;			
			}
			$scope.Controller.listController.refreshList(true);
			},
			onExitSearchModeClick: function(){
			$scope.Func.onChangeSearchModeClick('none');
			$scope.Controller.searchController.searchQuery = {};
			$scope.Controller.listController.exitSearchMode();
			},
			onChangeSearchModeClick: function(mode){
				$scope.Data.searchMode = mode;
			},
			getReservation: function () {
				reserveListSrvc.getReservation().then(function (res) {
					$scope.Data.reservationList = res.data.originalElement;
				})
			},
            deactiveTabs: function () {
					for (var int = 0; int < $scope.Data.tabList.length; int++) {
						$scope.Data.tabList[int].active = false;
					}
				},
			onTabClick: function (tab) {
					$scope.Data.selectedTab = tab;
					$scope.Func.deactiveTabs();
					tab.active = true;
		},
		getStatusList: function () {
			return $scope.Data.statusList;
			}
			
		}

	$scope.Controller = {
	
		listController : {
            headers: [
                
                {key:'creationDate', label:'تاریخ ثبت', type:'timestamp', format:'jDD-jMMMM-jYYYY'},
                {key:'letterNumber', label:'شماره نامه'},
                {key: 'actor.title', label: 'اقدام کننده' },
                {key: 'applicant.title', label: 'درخواست دهنده' },
				{key: 'department', label: 'واحد درخواست دهنده' },
				{key: 'creator.title', label: ' ایجاد کننده' },
                {key: 'subject', label: 'موضوع' },
				{key: 'reason', label: 'دلیل' },
				{key: 'indicatorBook.title', label: ' اندیکاتور' },
				// {key: 'uid', label: 'شناسه' },
				{key: 'status', label: 'وضعیت',type:'enum'},
			],
			getList: reserveListSrvc.getReservation,
			searchFunction: reserveListSrvc.searchuser,
    
		},
        searchController: {
            advanced: false,
            searchableFieldInfo: [
				{key: 'creationDate', label: 'تاریخ ثبت', type: 'date', format: 'jDD-jMMMM-jYYYY' },
				{key: "creator", type: "multiSelectReciever", label: " ایجاد کننده", searchFn: function (query) {
						return reserveListSrvc.getUserList(query)
					}
				},
				{key: "actor", type: "multiSelectReciever", label: 'اقدام کننده', searchFn: function (query) {
						return reserveListSrvc.getPua(query)
					}
				},
				{key: 'department', label: 'واحد درخواست دهنده' ,type:"string"},
				{key:'letterNumber', label:'شماره نامه' ,type:"string"},
				{key: 'indicatorBook', type: "multiSelectReciever", label: ' اندیکاتور', searchFn: function () {
					return cartableKatebSrvc.getIndicatorBookList()
				}
				},
				
				{ key: 'status', type:"status", label: 'وضعیت',  itemList:$scope.Data.statusList},
            ],
            onSearchClick: $scope.Func.onSearchClick,
            onExitSearchModeClick: $scope.Func.onExitSearchModeClick
        },
		}

		var Run = function () {
			reserveListSrvc.setOrgUid($scope.Data.configObj.userConfig.organization.uid)
			$scope.Func.getTabList();
            $scope.Func.onTabClick($scope.Data.tabList[0]);
		}

		Run();

});
