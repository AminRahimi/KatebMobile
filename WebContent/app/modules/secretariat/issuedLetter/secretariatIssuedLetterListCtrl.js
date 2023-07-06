angular.module('secretariatModule').controller('secretariatIssuedLetterListCtrl', function($scope, $state, $timeout, secretariatSrvc) {

	$scope.Data = {
		secUid: $state.params.secUid,
		searchMode: 'none',
        wasSearched: false
	}

	$scope.Func = {
		onIssuedClick: function(issued){
            $scope.Func.setLastPage($scope.Controller.listController.currentPage);
			$state.go('home.secretariat.issuedLetter', {secUid: $scope.Data.secUid, incUid: issued.uid, letterUid: issued.letter.uid});
		},

		onChangeSearchModeClick: function(mode){
			$scope.Data.searchMode = mode;
		},
		onSearchClick: function(lastPage){
            $scope.Func.setLastSearchQuery($scope.Controller.searchController.searchQuery);
			$scope.Func.onChangeSearchModeClick('quick');
			$scope.Controller.listController.searchQuery = $scope.Controller.searchController.searchQuery;
			$scope.Controller.listController.searchableFieldInfo = $scope.Controller.searchController.searchableFieldInfo;
            if ($scope.Controller.listController.searchQuery.date) {
                $scope.Controller.listController.searchQuery.fromDate = $scope.Controller.listController.searchQuery.date.split(",")[0];
                $scope.Controller.listController.searchQuery.toDate = $scope.Controller.listController.searchQuery.date.split(",")[1];
                delete $scope.Controller.listController.searchQuery.date;
            }
            var fn = function (start, pageLen) {
                return secretariatSrvc.searchsearchIssuedLetterListQueryParam($scope.Data.secUid, start, pageLen, $scope.Controller.listController.searchQuery);
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
			// 	return secretariatSrvc.searchsearchIssuedLetterListQueryParam($scope.Data.secUid, start, pageLen);
			// };
            $scope.Controller.listController.getList = null;
            $scope.Controller.listController.listItems.length = 0;
            $scope.Controller.listController.exitSearchMode();
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
			   {key:'letter.initiation.sender.title', label:'فرستنده'},
               {key:'letter.subject', label:'موضوع'},
               {key:'letter.internalNumber', label:'شماره نامه'},
			   {key:'letter.creationDate', label:'تاریخ ساخت', type:'date', format:'jDD-jMMMM-jYYYY'}
			],
			getList : null,
            // getList : function(start, pageLen){
            //     return secretariatSrvc.getIssuedLetterList($scope.Data.secUid, start, pageLen);
            // },
			onListItemSelect : $scope.Func.onIssuedClick,
			searchFunction: function(query, start, len){
				return secretariatSrvc.searchIssuedLetterList($scope.Data.secUid, query, start, len);
			},
            isDisableInit: true
		},
		searchController: {
			advanced: false,
			searchableFieldInfo: [
				// {key:"date", type:"date", label:"تاریخ"},
				{key:"number", type:"string", label:"شماره نامه"},
				// {key:"sender", type:"string", label:"فرستنده"},
				{key:"subject", type:"string", label:"موضوع"},
				{key:"delivery", type:"string", label:"گیرنده"},
                {key:"date", type:"date", label: "تاریخ"},
			],
			onSearchClick: $scope.Func.onSearchClick,
			onExitSearchModeClick: $scope.Func.onExitSearchModeClick
		},
	}

	var Run = function(){
        $scope.Data.wasSearched = $scope.Func.getSearchMode();
        $scope.Data.currentPage = $scope.Func.getLastPage();

        if (!$scope.Data.wasSearched) {
            $timeout(function () {
                $scope.Controller.listController.goToPage($scope.Data.currentPage);
            }, 1);
        } else {
            $scope.Controller.searchController.searchQuery = $scope.Func.getLastSearchQuery();
            $timeout(function () {
                $scope.Func.onSearchClick($scope.Data.currentPage);
            }, 1);
        }
	}

	Run();
});
