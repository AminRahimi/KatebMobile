angular.module('cartableModule').controller('archiveLetterListCtrl', function ($scope, $rootScope, $state,
                                                                               $window, cartableKatebSrvc,
                                                                               $timeout, cartableSrvc) {
    $scope.Data = {
        orgUid: $rootScope.currentUserOrg.uid,
        searchMode: 'none',
        wasSearched: false,
        indicatorBookList: []
    }
    $scope.Func = {
        onSelectLetter: function (letter, index) {
            $scope.Func.setLastPage($scope.Controller.listController.currentPage);
            cartableKatebSrvc.registerCurrentArchiveLetterState('index', index);
            cartableKatebSrvc.registerCurrentArchiveLetterState('page', $scope.Controller.listController.currentPage);
            cartableKatebSrvc.registerCurrentArchiveLetterState('totalCount', $scope.Controller.listController.listItems.totalCount);
            cartableKatebSrvc.setArchiveSearchQeury('', $scope.Controller.listController.currentPage);
            cartableSrvc.updateMenu();;
            // if ($state.current.name === "home.secretariat.orgLetterList") {
            //     $state.go('home.secretariat.orgLetter', {letterUid: letter.uid});
            // } else {
            $state.go('home.cartable.archiveLetter', {letterUid: letter.uid,filter:'all_archived_letters'});
            // }
        },

        onChangeSearchModeClick: function (mode) {
            $scope.Data.searchMode = mode;
        },
        onSearchClick: function (pageNum, filterSearchQuery, showSearchableFieldInfo, isNewSearch) {
            $scope.Func.setLastSearchQuery($scope.Controller.searchController.searchQuery);
            cartableSrvc.registerFilterArchiveSearchQuery("1", filterSearchQuery);
            cartableSrvc.registerShowFilterArchiveSearchQuery("1", showSearchableFieldInfo);
            $scope.Func.onChangeSearchModeClick('quick');
            cartableKatebSrvc.setArchiveLetterState($scope.Controller.searchController.searchQuery);
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
            
            delete query.officialDate;
            $scope.Controller.listController.searchableFieldInfo = $scope.Controller.searchController.searchableFieldInfo;
            $scope.Controller.listController.getList = function (start, pageLen) {
                cartableKatebSrvc.registerCurrentArchiveLetterState('len', pageLen);
                return cartableKatebSrvc.searchArchiveLetterListQueryParam($scope.Data.orgUid, start, pageLen, query, isNewSearch);
            }
            $timeout(function () {
                if (pageNum)
                    $scope.Controller.listController.goToPage(pageNum);
                else $scope.Controller.listController.refreshList();
            }, 1);
            cartableKatebSrvc.setArchiveSearchQeury($scope.Controller.searchController.searchQuery, 1);
            $scope.Func.setSearchMode(false);
            $scope.Data.wasSearched = false;
        },
        onExitSearchModeClick: function () {
            cartableKatebSrvc.resetArchiveSearchQuery();
            cartableSrvc.registerFilterArchiveSearchQuery("1", undefined);
            cartableSrvc.registerShowFilterArchiveSearchQuery("1", undefined);
            $scope.Func.onChangeSearchModeClick('none');
            $scope.Controller.searchController.searchQuery = {};
            $scope.Func.setLastSearchQuery($scope.Controller.searchController.searchQuery);
            $scope.Controller.listController.getList = function (start, pageLen) {
                cartableKatebSrvc.registerCurrentArchiveLetterState('len', pageLen);
                return cartableKatebSrvc.getArchiveLetterList($scope.Data.orgUid, start, pageLen);
            };
            $scope.Controller.listController.exitSearchMode();
        },
        initOrgLetterState: function () {
            var orgLetterState = cartableKatebSrvc.getArchiveLetterState();
            if (orgLetterState) {
                $scope.Controller.searchController.searchQuery = {
                    number: [],
                    subject: [],
                    externalNumber: [],
                    hamesh: [],
                    priority: [],
                    tag: [],
                    delivery: []
                };

                if (orgLetterState.number && orgLetterState.number.length) {
                    orgLetterState.number.forEach(function (item) {
                        $scope.Controller.searchController.searchQuery.number.push(item);
                    });
                }
                if (orgLetterState.subject && orgLetterState.subject.length) {
                    orgLetterState.subject.forEach(function (item) {
                        $scope.Controller.searchController.searchQuery.subject.push(item);
                    });
                }
                if (orgLetterState.externalNumber && orgLetterState.externalNumber.length) {
                    orgLetterState.externalNumber.forEach(function (item) {
                        $scope.Controller.searchController.searchQuery.externalNumber.push(item);
                    });
                }
                if (orgLetterState.hamesh && orgLetterState.hamesh.length) {
                    orgLetterState.hamesh.forEach(function (item) {
                        $scope.Controller.searchController.searchQuery.hamesh.push(item);
                    });
                }
                $scope.Func.onSearchClick($state.params.pagination ? $state.params.pagination : 1);
                if (orgLetterState.sender && orgLetterState.sender.length) {
                    $scope.Controller.searchController.searchQuery.sender = [];
                    orgLetterState.sender.forEach(function (item) {
                        $scope.Controller.searchController.searchQuery.sender.push(item);
                    });
                }
                $scope.Controller.searchController.searchQuery.priority = [];
                $scope.Controller.searchController.searchQuery.tag = [];
                $scope.Controller.searchController.searchQuery.delivery = [];
            }
            return orgLetterState;
        },
        setSearchMode: function (mode) {
            cartableKatebSrvc.setArchiveSearchMode(mode);
        },
        getSearchMode: function () {
            return cartableKatebSrvc.getArchiveSearchMode();
        },
        setLastSearchQuery: function (query) {
            cartableKatebSrvc.setArchiveLastSearchQuery(query);
        },
        getLastSearchQuery: function () {
            return cartableKatebSrvc.getArchiveLastSearchQuery();
        },
        setLastPage: function (pageNum) {
            cartableKatebSrvc.setArchiveLastPage(pageNum);
        },
        getLastPage: function () {
            return cartableKatebSrvc.getArchiveLastPage();
        },
        onOpenLetterInNewTabClick: function (checkedItem, e) {
            e.stopPropagation();
            $window.open($state.href('home.cartable.archiveLetter', {letterUid: checkedItem.uid,filter:'all_archived_letters'}), '_blank');
        }
    }

    $scope.Controller = {
        listController: {
            headers: [
                {key: 'internalNumber', label: 'شماره نامه'},
                {key: 'subject', label: 'موضوع', class: 'col-sm-6', hasTooltip: true, strSize: '70'},
                {key: 'initiation.sender.title', label: 'فرستنده', sortable: true},
                {key: 'dirType', label: 'نوع نامه', sortable: true},
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
            getList: function (start, pageLen) {
                return cartableKatebSrvc.getArchiveLetterList($scope.Data.orgUid, start, pageLen);
            },
            onListItemSelect: $scope.Func.onSelectLetter,
            searchFunction: function (query, start, len) {
                cartableKatebSrvc.registerCurrentArchiveLetterState('len', len);
                return cartableKatebSrvc.searchArchiveLetterList($scope.Data.orgUid, query, start, len);
            },
            isDisableInit: true,
            showSort: true,
            options: {
                customPagination: [10, 20, 50]
            },
            onReady: function () {
                $scope.Data.wasSearched = $scope.Func.getSearchMode();
                $scope.Data.currentPage = $scope.Func.getLastPage();
                if (cartableSrvc.getRegisterFilterArchiveSearchQuery("1")) {
                    $scope.Controller.searchController.searchQuery = $scope.Func.getLastSearchQuery();
                    if ($scope.Controller.searchController.initSearchFieldInfo) {
                        $scope.Controller.searchController.initSearchFieldInfo(cartableSrvc.getRegisterFilterArchiveSearchQuery("1"), cartableSrvc.getRegisterShowFilterArchiveSearchQuery("1"), $scope.Data.searchController.searchQuery);
                    } else {
                        $scope.Controller.searchOptions.selectedFromMultiselect = cartableSrvc.getRegisterFilterArchiveSearchQuery("1");
                        $scope.Controller.searchOptions.showFilterSearchQuery = cartableSrvc.getRegisterShowFilterArchiveSearchQuery("1");
                    }
                    $scope.Func.onSearchClick($scope.Data.currentPage, cartableSrvc.getRegisterFilterArchiveSearchQuery("1"), cartableSrvc.getRegisterShowFilterArchiveSearchQuery("1"));
                } else {
                    $scope.Controller.searchController.searchQuery = $scope.Func.getLastSearchQuery();
                    $timeout(function () {
                        $scope.Func.onSearchClick($scope.Data.currentPage);
                    }, 1);
                }
            }
        },
        searchController: {
            advanced: false,
            searchableFieldInfo: [
                {key: "quickSearch", label: "جستجوی سریع", type: 'fastSearch'},
                // {key: "indicator", label: "همه سال ها", type: 'enum2', itemList: $scope.Data.indicatorBookList},
                {key: "officialDate", label: "تاریخ رسمی", serverType: "string", sortable: true, type: "date"},
                {key: "subject", serverType: "string", type: "tagInput", label: "موضوع"},
                {key: "number", serverType: "string", type: "tagInput", label: "شماره نامه"},
                {key: "sender", serverType: "string", type: "tagInput", label: "فرستنده"},
                {key: "externalNumber", serverType: "string", type: "tagInput", label: "شماره خارجی"},
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
        // $scope.Func.getIndicatorBookList();
    };

    Run();
});