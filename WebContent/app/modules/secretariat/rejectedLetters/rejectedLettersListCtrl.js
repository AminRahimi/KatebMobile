angular.module('secretariatModule').controller('rejectedLettersListCtrl', function($scope, $state, secretariatSrvc, $timeout) {

	$scope.Data = {
		secUid: $state.params.secUid
	}
	
	$scope.Func = {
		onIncomingClick: function(incoming){
			$state.go('base.home.secretariat.rejected', {secUid: $scope.Data.secUid, incUid: incoming.uid});
		},
        onIncomingDeleteClick: function (incoming) {
            secretariatSrvc.deleteIncoming($scope.Data.secUid, incoming.uid, true).then(function (res) {
                $scope.Controller.listController.refreshList();
            });
        },
        onSearchClick: function(lastPage){
            $scope.Func.setLastSearchQuery($scope.Controller.searchController.searchQuery);
            $scope.Func.onChangeSearchModeClick('quick');
            $scope.Controller.listController.searchQuery = $scope.Controller.searchController.searchQuery;
            $scope.Controller.listController.searchableFieldInfo = $scope.Controller.searchController.searchableFieldInfo;
            if ($scope.Controller.listController.searchQuery.date) {
                $scope.Controller.listController.searchQuery.fromDate = $scope.Controller.listController.searchQuery.date.split(",")[0];
                $scope.Controller.listController.searchQuery.toDate	 = $scope.Controller.listController.searchQuery.date.split(",")[1];
                delete $scope.Controller.listController.searchQuery.date;
            }
            var fn = function (start, pageLen) {
                return secretariatSrvc.searchRejectedLetterListQueryParam($scope.Data.secUid, start, pageLen, $scope.Controller.listController.searchQuery);
            };
            $scope.Controller.listController.getList = fn;
            $timeout(function () {
                if (lastPage)
                    $scope.Controller.listController.goToPage(lastPage);
                else
                    $scope.Controller.listController.refreshList(false)
            }, 1);
            $scope.Func.setSearchMode(false);
            $scope.Data.wasSearched = false;
        },
        onExitSearchModeClick: function(){
            $scope.Func.onChangeSearchModeClick('none');
            $scope.Controller.searchController.searchQuery = {};
            $scope.Func.setLastSearchQuery($scope.Controller.searchController.searchQuery);
            // $scope.Controller.listController.getList = function(start, pageLen){
            // 	return secretariatSrvc.getIncommingLetterList($scope.Data.secUid, start, pageLen);
            // };
            $scope.Controller.listController.getList = null;
            $scope.Controller.listController.listItems.length = 0;
            $scope.Controller.listController.exitSearchMode();
        },
        setLastSearchQuery: function (query) {
            secretariatSrvc.setLastSearchQuery(query);
        },
        onChangeSearchModeClick: function(mode){
            $scope.Data.searchMode = mode;
        },
        setSearchMode: function (mode) {
            secretariatSrvc.setSearchMode(mode);
        }
	}
	
	$scope.Controller = {
		listController : {
			headers: [
			    {key:'creationDate', label:'تاریخ ذخیره‌سازی', type:'date', format:'jDD-jMMMM-jYYYY'},
			    {key:'creatorUser.title', label:'کاربر سازنده'},
			    {key:'creatorSecretariat.title', label:'دبیرخانه'},
//			    {key:'state', type:'enum', label:'وضعیت', filter:'state'},
				{key:'externalNumber', label:'شماره خارجی'},
				{key:'subject', label:'موضوع'},		
				{key:'officialDate', label:'تاریخ رسمی', type:'date', format:'jDD-jMMMM-jYYYY'}
			],
			getList : function(start, pageLen){
				return secretariatSrvc.getUnapprovedIncommingList($scope.Data.secUid, start, pageLen, true);
			},
			onListItemSelect : $scope.Func.onIncomingClick
		},
        searchController: {
            advanced: false,
            searchableFieldInfo: [
                {key:"sender", type:"string", label:"فرستنده"},
                {key:"subject", type:"string", label:"موضوع"},
                {key:"external_number", type:"string", label:"شماره"}
            ],
            onSearchClick: $scope.Func.onSearchClick,
            onExitSearchModeClick: $scope.Func.onExitSearchModeClick
        }
	}
	
	var Run = function(){
		
	}
	
	Run();
});