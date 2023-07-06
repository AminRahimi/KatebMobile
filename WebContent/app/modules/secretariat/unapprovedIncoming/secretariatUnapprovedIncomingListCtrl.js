angular.module('secretariatModule').controller('secretariatUnapprovedIncomingListCtrl', function($scope, $state, secretariatSrvc,$timeout) {

	$scope.Data = {
		secUid: $state.params.secUid,
		searchMode: 'none',
        wasSearched: false
	}
	
	$scope.Func = {
		onIncomingClick: function(incoming){
			$state.go('home.secretariat.incoming', {secUid: $scope.Data.secUid, incUid: incoming.uid});
		},
        onIncomingDeleteClick: function (incoming) {
            secretariatSrvc.deleteIncoming($scope.Data.secUid, incoming.uid).then(function (res) {
                $scope.Controller.listController.refreshList();
            });
        },
		hideButton: function (item) {
			if (item.receivingStyle == 'KATEB' || item.receivingStyle == 'ORG') {
				return true;
			} else {
				return false;
			}
		},
        onChangeSearchModeClick: function(mode){
            $scope.Data.searchMode = mode;
        },
        onSearchClick: function(lastPage){
            $scope.Func.setLastSearchQuery($scope.Controller.searchController.searchQuery);
            $scope.Func.onChangeSearchModeClick('quick');
            $scope.Controller.listController.searchQuery = $scope.Controller.searchController.searchQuery;
            $scope.Controller.listController.searchableFieldInfo = $scope.Controller.searchController.searchableFieldInfo;
            if ($scope.Controller.listController.searchQuery.creationDate) {
                $scope.Controller.listController.searchQuery.fromDate = $scope.Controller.listController.searchQuery.creationDate.split(",")[0];
                $scope.Controller.listController.searchQuery.toDate = $scope.Controller.listController.searchQuery.creationDate.split(",")[1];
                delete $scope.Controller.listController.searchQuery.creationDate;
            }
            var fn = function (start, pageLen) {
                return secretariatSrvc.searchSecretariatUnapprovedIncomingList($scope.Data.secUid, start, pageLen, $scope.Controller.listController.searchQuery);
            };
            $scope.Controller.listController.getList = fn;
            $timeout(function () {
                $scope.Controller.listController.refreshList(false).then(function () {
                    if (lastPage)
                        $scope.Controller.listController.goToPage(lastPage);
                });
            }, 1);
            // $scope.Controller.listController.refreshList();
            $scope.Func.setSearchMode(false);
            $scope.Data.wasSearched = false;
        },
        onExitSearchModeClick: function(){
            $scope.Func.onChangeSearchModeClick('none');
            $scope.Controller.searchController.searchQuery = {};
            $scope.Func.setLastSearchQuery($scope.Controller.searchController.searchQuery);
            $scope.Controller.listController.exitSearchMode();
            $scope.Controller.listController.getList = function(start, pageLen){
                return secretariatSrvc.searchUnapprovedIncomingDraftListQueryParam($scope.Data.secUid, start, pageLen);
            };
            $scope.Controller.listController.refreshList();
        },
        setSearchMode: function (mode) {
            secretariatSrvc.setSearchMode(mode);
        },
        getSearchMode: function () {
            return secretariatSrvc.getSearchMode();
        },
        setLastSearchQuery: function (query) {
            secretariatSrvc.setLastSearchQuery(query);
        },
        getLastSearchQuery: function () {
            return secretariatSrvc.getLastSearchQuery();
        },
        setLastPage: function (pageNum) {
            secretariatSrvc.setLastPage(pageNum);
        },
        getLastPage: function () {
            return secretariatSrvc.getLastPage();
        }
	}
	
	$scope.Controller = {
		listController : {
			headers: [
			    {key:'creationDate', label:'تاریخ ذخیره‌سازی', type:'date', format:'jDD-jMMMM-jYYYY'},
				{ key: 'creatorUser.title', label: 'کاربر سازنده' },
				{key:'sender.title', label:'کاربر فرستنده'},
			    {key:'creatorSecretariat.title', label:'دبیرخانه'},
//			    {key:'state', type:'enum', label:'وضعیت', filter:'state'},
				{key:'externalNumber', label:'شماره خارجی'},		
				{key:'subject', label:'موضوع'},		
				{key:'officialDate', label:'تاریخ رسمی', type:'date', format:'jDD-jMMMM-jYYYY'},
                {type:'action',label:'', icon:'flaticon-close-button',action:$scope.Func.onIncomingDeleteClick,
					isHidden: $scope.Func.hideButton}
			],
			getList : function(start, pageLen){
				return secretariatSrvc.getUnapprovedIncommingList($scope.Data.secUid, start, pageLen);
			},
			searchFunction: function(query, start, len){
                return secretariatSrvc.searchUnapprovedIncomingtList($scope.Data.secUid, query, start, len);
            },
			onListItemSelect : $scope.Func.onIncomingClick
		},
		searchController: {
            advanced: false,
            searchableFieldInfo: [
				{ key: "subject", type: "string", label: "موضوع" },
				{ key: "external_number", type: "string", label: "شماره خارجی" },
				{key:"creationDate", type:"date", label: "تاریخ ساخت"},
                {key:"sender", type:"string", label:"فرستنده نامه"},
            ],
            onSearchClick: $scope.Func.onSearchClick,
            onExitSearchModeClick: $scope.Func.onExitSearchModeClick
        },
	}
	
	var Run = function(){
		
	}
	
	Run();
});
