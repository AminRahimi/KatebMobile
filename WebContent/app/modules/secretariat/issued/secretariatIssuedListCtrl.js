angular.module('secretariatModule').controller('secretariatIssuedListCtrl', function($scope, $state, $timeout, secretariatSrvc) {

	$scope.Data = {
		secUid: $state.params.secUid,
		featuresList: secretariatSrvc.getFeatureList($state.params.secUid),
        searchMode: 'none',
        wasSearched: false,
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
        onSearchClick: function (lastPage) {
            $scope.Func.setLastSearchQuery($scope.Controller.searchController.searchQuery);
            $scope.Func.onChangeSearchModeClick('quick');
            $scope.Controller.listController.searchQuery = $scope.Controller.searchController.searchQuery;
            $scope.Controller.listController.searchableFieldInfo = $scope.Controller.searchController.searchableFieldInfo;
            if ($scope.Controller.listController.searchQuery.creationDate) {
                $scope.Controller.listController.searchQuery.fromDate = $scope.Controller.listController.searchQuery.creationDate.split(",")[0];
                $scope.Controller.listController.searchQuery.toDate = $scope.Controller.listController.searchQuery.creationDate.split(",")[1];
                delete $scope.Controller.listController.searchQuery.creationDate;
            }
            var deliveries = [];
            var searchQuery= angular.copy($scope.Controller.searchController.searchQuery)
            angular.forEach(searchQuery.deliveryUid, function (item) {
                deliveries.push(item.uid);
            });
            searchQuery.deliveryUid = deliveries.toString();
            var fn = function (start, pageLen) {
                return secretariatSrvc.searchsearchIssuedDraftListQueryParam($scope.Data.secUid, start, pageLen,searchQuery);
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
                return secretariatSrvc.searchsearchIssuedDraftListQueryParam($scope.Data.secUid, start, pageLen);
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
                
                {key:'creationDate', label:'تاریخ ساخت', type:'date', format:'jDD-jMMMM-jYYYY'},
                {key:'letter.internalNumber', label:'شماره نامه'},
                { key: 'letter.subject', label: 'موضوع' },
                { key: 'letter.initiation.sender.title', label: 'فرستنده' },
                { key: 'deliveryTo', label: 'گیرندگان ', type: 'tag' },
			    // {key:'letter.requestResponseDate', label:'مهلت پاسخ'},
			],
			getList : function(start, pageLen){
				return secretariatSrvc.getIssuedList($scope.Data.secUid, start, pageLen);
			},
            searchFunction: function(query, start, len){
                return secretariatSrvc.searchIssuedDraftList($scope.Data.secUid, query, start, len);
            },
			onListItemSelect : $scope.Func.onIssuedClick
		},
        searchController: {
            advanced: false,
            searchableFieldInfo: [
                {key:"number", type:"string", label:"شماره نامه"},
                {key:"subject", type:"string", label:"موضوع"},
                {
                    key: "deliveryUid", type: "multiSelectReciever", label: "گیرنده", searchFn: function (query) {
                    return secretariatSrvc.getpositionUserAssignemtsList({secretariat: true, query: query}) 
                }},
                { key: 'sender', type: 'string', label: 'فرستنده ' },
                {key:"creationDate", type:"date", label: "تاریخ ساخت"}
            ],
            onSearchClick: $scope.Func.onSearchClick,
            onExitSearchModeClick: $scope.Func.onExitSearchModeClick
        },
	}
	
	var Run = function(){
	}
	
	Run();
});