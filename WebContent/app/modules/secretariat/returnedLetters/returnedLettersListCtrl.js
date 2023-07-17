angular.module('secretariatModule').controller('returnedLettersListCtrl', function($scope, $state, $timeout, secretariatSrvc) {

	$scope.Data = {
		secUid: $state.params.secUid,
		featuresList: [],
        searchMode: 'none',
        wasSearched: false
	}

	$scope.Func = {
		onAddClick: function(){
			$state.go('base.home.secretariat.issuedAdd', {secUid: $scope.Data.secUid});
		},
		onIssuedClick: function(issued){
			$state.go('base.home.secretariat.issued', {secUid: $scope.Data.secUid, incUid: issued.uid, letterUid: issued.letter.uid});
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
                return secretariatSrvc.searchsearchIssuedDraftListQueryParam($scope.Data.secUid, start, pageLen, $scope.Controller.listController.searchQuery, true);
            };
            $scope.Controller.listController.getList = fn;
            $timeout(function () {
                if (lastPage)
                    $scope.Controller.listController.goToPage(lastPage);
                else
                    $scope.Controller.listController.refreshList(false);
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
            // $scope.Controller.listController.getList = function(start, pageLen){
            //     return secretariatSrvc.searchsearchIssuedDraftListQueryParam($scope.Data.secUid, start, pageLen, $scope.Controller.listController.searchQuery, true);
            // };
            $scope.Controller.listController.refreshList(true);
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
                {key:'creationDate', label:'تاریخ ساخت', type:'date', format:'jDD-jMMMM-jYYYY'},
                {key:'letter.internalNumber', label:'شماره نامه'},
			    {key:'letter.subject', label:'موضوع'},
			    {key:'letter.requestResponseDate', label:'مهلت پاسخ'}
			],
			getList : function(start, pageLen){
				return secretariatSrvc.getIssuedList($scope.Data.secUid, start, pageLen, true);
			},
            searchFunction: function(query, start, len){
                return secretariatSrvc.searchIssuedDraftList($scope.Data.secUid, query, start, len, true);
            },
			onListItemSelect : $scope.Func.onIssuedClick
		},
        searchController: {
            advanced: false,
            searchableFieldInfo: [
                {key:"creationDate", type:"date", label: "تاریخ ساخت"},
                {key:"number", type:"string", label:"شماره نامه"},
                {key:"subject", type:"string", label:"موضوع"}
            ],
            onSearchClick: $scope.Func.onSearchClick,
            onExitSearchModeClick: $scope.Func.onExitSearchModeClick
        },
	}
	
	var Run = function(){
        secretariatSrvc.getFeatureList($state.params.secUid).then(function(featuresList) {
            $scope.Data.featuresList = featuresList;
        });
		
	}
	
	Run();
});