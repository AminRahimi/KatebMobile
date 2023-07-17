angular.module('secretariatModule').controller('secretariatIncommingLetterListCtrl', function($scope, $state, secretariatSrvc, $timeout,homeSrvc) {

	$scope.Data = {
		secUid: $state.params.secUid,
		searchMode: 'none',
        wasSearched: false,
        isMobileView: homeSrvc.screenSizeDetector.isMobile()
	}

	$scope.Func = {
		onIncomingClick: function(incoming){
            $scope.Func.setLastPage($scope.Controller.listController.currentPage);
			$state.go('base.home.secretariat.letterView', {letterUid:incoming.letter.uid, secUid:$state.params.secUid ,letterType:"incoming"});
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
                $scope.Controller.listController.searchQuery.toDate	 = $scope.Controller.listController.searchQuery.date.split(",")[1];
                delete $scope.Controller.listController.searchQuery.date;
            }
			var fn = function (start, pageLen) {
                return secretariatSrvc.searchIncommingLetterListQueryParam($scope.Data.secUid, start, pageLen, $scope.Controller.listController.searchQuery);
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
		listController: {
			headers:{
                desktop:[
                    {key:'letter.initiation.sender.title', label:'فرستنده'},
                    {key:'letter.subject', label:'موضوع'},
                    {key:'letter.internalNumber', label:'شماره نامه'},
                     {key:'externalNumber'},
                    {key:'letter.creationDate', label:'تاریخ ساخت', type:'date', format:'jDD-jMMMM-jYYYY'}
                 ],
                 mobile:[
                    {key:'letter.subject', label:'موضوع',styleClass:"kateb-text-2 tw-text-black "},
                    {key:'letter.initiation.sender.title', label:'فرستنده',styleClass:"kateb-text-2 tw-text-gray",
                    labelClass:""},
                    {key:'externalNumber',label:'شماره خارجی',styleClass:"kateb-text-2 tw-float-right  tw-text-primary-light",
                    labelClass:"tw-text-black"},
                    {
                        key:'letter.creationDate', label:'تاریخ ساخت', type:'date', "format": "jDD jMMMM jYYYY",
                        styleClass:"kateb-text-2 tw-w-[10em] tw-float-left  tw-text-primary-light",
                        labelClass:"tw-text-black"
                    }


                 ]
            } ,
            getList: null,
			// getList: function(start, pageLen){
			// 	return secretariatSrvc.getIncommingLetterList($scope.Data.secUid, start, pageLen);
			// },
			onListItemSelect: $scope.Func.onIncomingClick,
			searchFunction: function(query, start, len){
				return secretariatSrvc.searchIncommingLetterList($scope.Data.secUid, query, start, len);
			},
            isDisableInit: true
		},
		searchController: {
			advanced: false,
			searchableFieldInfo: [
				{key:"sender", type:"string", label:"فرستنده"},
				{key:"subject", type:"string", label:"موضوع"},
                {key:"internal_number", type:"string", label:"شماره داخلی"},
                {key:"external_number", type:"string", label:"شماره خارجی"},
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

            $scope.Controller.listController.onReady = function(){
                $scope.Controller.listController.goToPage($scope.Data.currentPage);
            }
           
        } else {
            $scope.Controller.searchController.searchQuery = $scope.Func.getLastSearchQuery();
            $timeout(function () {
                $scope.Func.onSearchClick($scope.Data.currentPage);
            }, 1);
        }

	}

	Run();
});
