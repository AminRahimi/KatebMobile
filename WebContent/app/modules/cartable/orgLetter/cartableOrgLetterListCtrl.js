angular.module('cartableModule').controller('cartableOrgLetterListCtrl', function ($scope, $rootScope, $state,
                                                                                   $window, cartableKatebSrvc,
                                                                                   $timeout, cartableSrvc, configObj,$q) {
    $scope.Data = {
        orgUid: $rootScope.currentUserOrg.uid,
        searchMode: 'none',
        wasSearched: false,
        indicatorBookList: []
    }
    $scope.Func = {
        onSelectLetter: function (letter, index) {
            $scope.Func.setLastPage($scope.Controller.listController.currentPage);
            // cartableKatebSrvc.registerCurrentLetterState('orgUid', $scope.Data.orgUid);
            cartableKatebSrvc.registerCurrentLetterState('index', index);
            cartableKatebSrvc.registerCurrentLetterState('page', $scope.Controller.listController.currentPage);
            cartableKatebSrvc.registerCurrentLetterState('totalCount', $scope.Controller.listController.listItems.totalCount);
            //cartableKatebSrvc.saveOrgLetterListState({
            //query: $scope.Controller.searchController.searchQuery,
            //mode: $scope.Data.searchMode
            //});
            cartableKatebSrvc.setSearchQeury('', $scope.Controller.listController.currentPage);
            cartableSrvc.publishTo("updateCartableMenu");;
            if ($state.current.name === "base.home.secretariat.orgLetterList") {
                $window.open($state.href('base.home.secretariat.orgLetter', {letterUid: letter.uid,filter:'all_letters'}), '_blank');
            } else {
                $window.open($state.href('base.home.cartable.orgLetter', {letterUid: letter.uid,filter:'all_letters'}), '_blank');
            }
        },

        onChangeSearchModeClick: function (mode) {
            $scope.Data.searchMode = mode;
        },
        onSearchClick: function (pageNum, filterSearchQuery, showSearchableFieldInfo, isNewSearch) {
            var defer = $q.defer();
            $scope.Func.setLastSearchQuery($scope.Controller.searchController.searchQuery);
            cartableSrvc.registerFilterSearchQuery("1", filterSearchQuery);
            cartableSrvc.registerShowFilterSearchQuery("1", showSearchableFieldInfo);
            $scope.Func.onChangeSearchModeClick('quick');
                cartableKatebSrvc.setOrgLetterState($scope.Controller.searchController.searchQuery);
                $scope.Controller.listController.searchQuery = $scope.Controller.searchController.searchQuery;
                var query = angular.copy($scope.Controller.searchController.searchQuery);
                if (query.officialDate) {
                    if (!query.dateFrom && !query.dateTo) {
                        query.dateFrom = [];
                        query.dateTo = [];
                    }
                    for (var index in query.officialDate) {
                        query.dateFrom.push(query.officialDate[index].split(',')[0]);
                        query.dateTo.push(query.officialDate[index].split(',')[1]);
                    }
                }
                if (query.indicator) {
                    query.indicator = query.indicator.uid;
                }else{
                	query.indicator = configObj.userConfig.organization.internalIndicatorBook.uid;
                }
                
                
                delete query.officialDate;
                // for (item in items) {
                //     if (_.isArray(items[item])) {
                //         items[item].forEach(function (field) {
                //             if (item == "officialDate") {
                //                 query += "dateFrom=" + field.split(',')[0] + "&";
                //                 query += "dateTo=" + field.split(',')[1] + "&"
                //                 // query.dateFrom.push(field.split(',')[0])
                //                 // query.dateTo.push(field.split(',')[1])
                //             } else if (field.uid) {
                //                 query += item + "=" + field.uid + "&";
                //             } else {
                //                 query += item + "=" + field + "&";
                //             }
                //         });
                //     } else {
                //         if (items[item]) {
                //             if (item == "officialDate") {
                //                 query += "dateFrom=" + items[item].split(',')[0] + "&";
                //                 query += "dateTo=" + items[item].split(',')[1] + "&";
                //             } else if(!_.isEmpty(items[item])) {
                //                 query += item + "=" + items[item] + "&";
                //             }
                //         }
                //         else
                //             query += item + "=&";
                //     }
                // }
                // console.log(items);
                $scope.Controller.listController.searchableFieldInfo = $scope.Controller.searchController.searchableFieldInfo;
                $scope.Controller.listController.getList = function (start, pageLen) {
                    cartableKatebSrvc.registerCurrentLetterState('len', pageLen);
                    return cartableKatebSrvc.searchOrgLetterListQueryParam($scope.Data.orgUid, start, pageLen, query, isNewSearch);
                }
                $timeout(function () {
                    // $scope.Controller.listController.refreshList(false).then(function () {
                    if (pageNum){
                        $scope.Controller.listController.goToPage(pageNum).then(defer.resolve);
                    }

                    else {
                        $scope.Controller.listController.refreshList().then(defer.resolve);
                    }
                    // });
                }, 1);
                // if(pageNum){
                //     $scope.Controller.listController.goToPage(pageNum);
                // }else{
                //     console.log("else");
                //     $timeout(function () {
                //         $scope.Controller.listController.refreshList();
                //     }, 1)
                // }
                cartableKatebSrvc.setSearchQeury($scope.Controller.searchController.searchQuery, 1);
            $scope.Func.setSearchMode(false);
            $scope.Data.wasSearched = false;

            return defer.promise;
        },
        onExitSearchModeClick: function () {
            cartableKatebSrvc.resetSearchQuery();
            cartableSrvc.registerFilterSearchQuery("1", undefined);
            cartableSrvc.registerShowFilterSearchQuery("1", undefined);
            $scope.Func.onChangeSearchModeClick('none');
            $scope.Controller.searchController.searchQuery = {};
            $scope.Func.setLastSearchQuery($scope.Controller.searchController.searchQuery);
	        $scope.Controller.listController.getList = function (start, pageLen) {
	             cartableKatebSrvc.registerCurrentLetterState('len', pageLen);
	             return cartableKatebSrvc.getOrgLetterList($scope.Data.orgUid, start, pageLen);
	        };
            //$scope.Controller.listController.getList = null;
            //$scope.Controller.listController.listItems.length = 0;
            $scope.Controller.listController.exitSearchMode();
        },
        getOrgLetterList: function () {
            return function (start, pageLen) {
                return cartableKatebSrvc.searchOrgLetterListQueryParam($scope.Data.orgUid, start, pageLen, $scope.Controller.searchController.searchQuery);
            }
        },
        initOrgLetterState: function () {
            var orgLetterState = cartableKatebSrvc.getOrgLetterState();
            if(orgLetterState){
                $scope.Controller.searchController.searchQuery = {
                    number: [],
                    subject: [],
                    externalNumber: [],
                    hamesh: [],
                    priority: [],
                    tag: [],
                    delivery: []
                };
               
                if(orgLetterState.number && orgLetterState.number.length){
                    orgLetterState.number.forEach(function (item) {
                        $scope.Controller.searchController.searchQuery.number.push(item);
                    });
                }
                if(orgLetterState.subject && orgLetterState.subject.length){
                    orgLetterState.subject.forEach(function (item) {
                        $scope.Controller.searchController.searchQuery.subject.push(item);
                    });
                }
                if(orgLetterState.externalNumber && orgLetterState.externalNumber.length){
                    orgLetterState.externalNumber.forEach(function (item) {
                        $scope.Controller.searchController.searchQuery.externalNumber.push(item);
                    });
                }
                if(orgLetterState.hamesh && orgLetterState.hamesh.length){
                    orgLetterState.hamesh.forEach(function (item) {
                        $scope.Controller.searchController.searchQuery.hamesh.push(item);
                    });
                }
//<<<<<<< HEAD
                $scope.Func.onSearchClick($state.params.pagination ? $state.params.pagination : 1);
//=======
                if(orgLetterState.sender && orgLetterState.sender.length){
                    $scope.Controller.searchController.searchQuery.sender = [];
                    orgLetterState.sender.forEach(function (item) {
                        $scope.Controller.searchController.searchQuery.sender.push(item);
                    });
                }
                $scope.Controller.searchController.searchQuery.priority = [];
                $scope.Controller.searchController.searchQuery.tag = [];
                $scope.Controller.searchController.searchQuery.delivery = [];
//>>>>>>> bpms
            }
            return orgLetterState;
        },
        setSearchMode: function (mode) {
            cartableKatebSrvc.setSearchMode(mode);
        },
        getSearchMode: function () {
            return cartableKatebSrvc.getSearchMode();
        },
        setLastSearchQuery: function (query) {
            cartableKatebSrvc.setLastSearchQuery(query);
        },
        getLastSearchQuery: function () {
            return cartableKatebSrvc.getLastSearchQuery();
        },
        setLastPage: function (pageNum) {
            cartableKatebSrvc.setLastPage(pageNum);
        },
        getLastPage: function () {
            return cartableKatebSrvc.getLastPage();
        },
        onOpenLetterInNewTabClick: function (checkedItem, e) {
            e.stopPropagation();
            $window.open($state.href('base.home.cartable.orgLetter', {letterUid: checkedItem.uid,filter:'all_letters'}), '_blank');
        },
        getIndicatorBookList: function() {
            cartableKatebSrvc.getIndicatorBookList().then(function (response) {
                for (var int = 0; int < response.data.originalElement.length; int++) {
                    $scope.Data.indicatorBookList.push(response.data.originalElement[int]);
                }
                $timeout(function () {
                    var fieldFound = _.find($scope.Controller.searchController.searchableFieldInfo, function (searchableFieldInfo) {
                        return searchableFieldInfo.key == "indicator";
                    });
                    var defaultIndicator = _.find(fieldFound.itemList, function (item) {
                        if ($scope.Controller.searchController.searchQuery.indicator) {
                            return item.uid == $scope.Controller.searchController.searchQuery.indicator.uid;
                        } else {
                            return item.uid == configObj.userConfig.organization.internalIndicatorBook.uid;
                        }
                    });
                    $scope.Controller.searchController.searchQuery["indicator"] = defaultIndicator;
                }, 1);
            });
        }
    }

    $scope.Controller = {
        listController: {
            headers: [
                {key: 'internalNumber', label: 'شماره نامه'},
                { key: 'subject', label: 'موضوع', hasTooltip: true, strSize: '70' },
                { key: 'edited',type: 'edited', label: '' },
                {key: 'initiation.sender.title', label: 'فرستنده',sortable: true},
                {key: 'dirType', label: 'نوع نامه',sortable: true},
                {key: 'officialDate', type: 'date', label: 'تاریخ ', format: 'jDD-jMMMM-jYYYY'},
                {
                    key: 'uid',
                    type: 'link',
                    label: '',
                    sortable: false,
                    display: true,
                    action: $scope.Func.onOpenLetterInNewTabClick
                }
            ],
            getList : function(start, pageLen){
                return cartableKatebSrvc.getOrgLetterList($scope.Data.orgUid, start, pageLen);
            },
            onListItemSelect: function () {
                
            },
            onListItemDblSelect: $scope.Func.onSelectLetter,
            searchFunction: function (query, start, len) {
                cartableKatebSrvc.registerCurrentLetterState('len', len);
                return cartableKatebSrvc.searchOrgLetterList($scope.Data.orgUid, query, start, len);
            },
            isDisableInit: true,
            showSort: true,
            options: {
                customPagination: [10, 20, 50]
            },
            onReady: function () {
                $scope.Data.wasSearched = $scope.Func.getSearchMode();
                $scope.Data.currentPage = $scope.Func.getLastPage();
                    if (cartableSrvc.getRegisterFilterSearchQuery("1")) {
                        $scope.Controller.searchController.searchQuery = $scope.Func.getLastSearchQuery();
                        // $timeout(function () {
                        //     $scope.Controller.searchController.initSearchFieldInfo(cartableSrvc.getRegisterFilterSearchQuery("1"), cartableSrvc.getRegisterShowFilterSearchQuery("1"), $scope.Data.searchController.searchQuery);
                        if ($scope.Controller.searchController.initSearchFieldInfo) {
                            $scope.Controller.searchController.initSearchFieldInfo(cartableSrvc.getRegisterFilterSearchQuery("1"), cartableSrvc.getRegisterShowFilterSearchQuery("1"), $scope.Data.searchController.searchQuery);
                        } else {
                            $scope.Controller.searchOptions.selectedFromMultiselect = cartableSrvc.getRegisterFilterSearchQuery("1");
                            $scope.Controller.searchOptions.showFilterSearchQuery = cartableSrvc.getRegisterShowFilterSearchQuery("1");
                        }
                            // $scope.Controller.searchController.init();
                        $scope.Func.onSearchClick($scope.Data.currentPage, cartableSrvc.getRegisterFilterSearchQuery("1"), cartableSrvc.getRegisterShowFilterSearchQuery("1"));
//                        if (!_.isEmpty($scope.Controller.searchController.searchQuery)) {
//                            $timeout(function () {
//                                $scope.Func.onSearchClick($scope.Data.currentPage, cartableSrvc.getRegisterFilterSearchQuery("1"), cartableSrvc.getRegisterShowFilterSearchQuery("1"));
//                            }, 1);
//                        }
                            // $scope.Func.onSearchClick($scope.Data.currentPage, cartableSrvc.getRegisterFilterSearchQuery("1"), cartableSrvc.getRegisterShowFilterSearchQuery("1"));
                        // }, 1);
                    } else {
                        $scope.Controller.searchController.searchQuery = $scope.Func.getLastSearchQuery();
                      //  if (!_.isEmpty($scope.Controller.searchController.searchQuery)) {
                            $timeout(function () {
                                $scope.Func.onSearchClick($scope.Data.currentPage);
                            }, 1);
                      //  }
                    }
            },
            callHook: function(listItems){
                cartableSrvc.cacheLastVisitedCartableFilterList('all_letters',listItems);
            }
        },
        searchController: { 
            advanced: false,
            searchableFieldInfo: [
                {key: "quickSearch", label: "جستجوی سریع", type: 'fastSearch'},
                {key: "indicator", label: "همه سال ها", type: 'enum2', itemList: $scope.Data.indicatorBookList},
                {key: "officialDate", label: "تاریخ رسمی", serverType: "string", sortable: true, type: "date"},
                {key: "subject", serverType: "string", type: "tagInput", label: "موضوع"},
                { key: "number", serverType: "string", type: "tagInput", label: "شماره نامه" },
                { key: "edited", type: "bool", label: " فقط ویرایش شده" },
                {key: "sender", serverType: "string", type: "tagInput", label: "فرستنده"},
                {key: "externalNumber", serverType: "string", type: "tagInput", label: "شماره خارجی"},
                // {key: "hamesh", label: "هامش", serverType: "string", sortable: true, type: "tagInput"},
                // {key: "priority", label: "فوریت", sortable: true, type: "enum", multiple: true},
                // {key: "tag", label: "برچسب", serverType: "collection_tag", type: "collection"},
                // {
                //     key: "confidentialityLevel",
                //     label: "سطح محرمانگی",
                //     serverType: "string",
                //     sortable: true,
                //     type: "enum",
                //     multiple: true
                // },
                {
                    key: "delivery",
                    label: "گیرندگان",
                    serverType: "collection_delivery",
                    sortable: true,
                    type: "tagInput"
                }
            ],
            onSearchClick: $scope.Func.onSearchClick,
            onExitSearchModeClick: $scope.Func.onExitSearchModeClick
        },
        searchOptions: {}
    }

    var Run = function () {
        $scope.Func.getIndicatorBookList();
    };

    Run();
    // var Run = function () {
    //     $scope.Data.wasSearched = $scope.Func.getSearchMode();
    //     $scope.Data.currentPage = $scope.Func.getLastPage();
        /*$scope.Controller.searchController.searchQuery = {
            number: $state.params.letterNumber,
            // sender: $state.params.sender,
            subject: $state.params.subject
        }*/
        // $scope.Controller.listController.getList = $scope.Func.getOrgLetterList();

        /*$timeout(function () {
            if(!$scope.Func.initOrgLetterState()){
                $scope.Controller.listController.goToPage($state.params.pagination ? $state.params.pagination : 1);
            }
        }, 1);*/
        // if (!$scope.Data.wasSearched) {
        //     $timeout(function () {
        //         // $scope.Controller.listController.refreshList().then(function () {
        //         $scope.Controller.listController.goToPage($scope.Data.currentPage);
        //         // });
        //     }, 1);
        // if (!$scope.Data.wasSearched) {
        //     console.log(55555);
        //     // $timeout(function () {
        //     //     $timeout(function () {
        //             $timeout(function () {
        //                 $scope.Controller.listController.refreshList().then(function () {
        //                     $scope.Controller.listController.goToPage($scope.Data.currentPage);
        //                 });
        //             }, 1)
        //         // }, 1);
        //     // }, 1);
        // } else {
        // if (cartableSrvc.getRegisterFilterSearchQuery("1")) {
        //     $scope.Controller.searchController.searchQuery = $scope.Func.getLastSearchQuery();
        //     // $timeout(function () {
        //     if ($scope.Controller.searchController.initSearchFieldInfo) {
        //         $scope.Controller.searchController.initSearchFieldInfo(cartableSrvc.getRegisterFilterSearchQuery("1"), cartableSrvc.getRegisterShowFilterSearchQuery("1"), $scope.Data.searchController.searchQuery);
        //     } else {
        //         $scope.Controller.searchOptions.selectedFromMultiselect = cartableSrvc.getRegisterFilterSearchQuery("1");
        //         $scope.Controller.searchOptions.showFilterSearchQuery = cartableSrvc.getRegisterShowFilterSearchQuery("1");
        //     }
        //     // $scope.Controller.searchController.init();
        //     $scope.Func.onSearchClick($scope.Data.currentPage, cartableSrvc.getRegisterFilterSearchQuery("1"), cartableSrvc.getRegisterShowFilterSearchQuery("1"));
        //     // }, 1);
        // } else {
        //     $scope.Controller.searchController.searchQuery = $scope.Func.getLastSearchQuery();
        //     $timeout(function () {
        //         $scope.Func.onSearchClick($scope.Data.currentPage);
        //     }, 1);
        // }
        //
        // }
        // $scope.Controller.listController.callHook = function () {
        //     $timeout(function () {
        //         $scope.Controller.listController.currentPage = cartableKatebSrvc.getCurrentPage();
        //     }, 1);
        // };
    // }

    // Run();
});
