angular.module("vtCartable").directive('cartableList',
    /**
     * @memberOf vtCartable
     * @ngdoc directive
     * @name cartableList
     * @description
     *  This directive list tasks
     * @param {service} cartableSrvc
     * @param {service} vtSearchSrvc
     * @attr {function} process-task-fn callback from cartableList directive when task clicked
     * @attr {function} directive-is-ready callback from cartableList when directive loading finished
     * @example
     *  Usage:
     *      <cartable-list process-task-fn="" directive-is-ready=""></cartable-list>
     */
    function () {
        return {
            restrict: 'EAC',
            templateUrl: 'app/lib/vtCartable/cartableList/cartableListTemplate.html',
            scope: {
                processTaskFn: "&",
                directiveIsReady: "&",
                //for dependency injection such as button names, user this object
                //notice that default value for each dependency needed
                api: "=",
                options: "="
            },
            controller: function ($scope, $modal, cartableSrvc, vtCartableSearchSrvc, $timeout,
                                  $modalStack, $location, CARTABLE_CONFIG,$q) {
                $scope.api = $scope.api || {};

                $scope.visibleHeader = [];
                $scope.showFilterManager = CARTABLE_CONFIG.showFilterManager || true;

                $scope.Data = {
                    taskField: [],
                    searchableFieldKey: [],
                    selectedFilterTemp: {},
                    modeler:false
                };

                $scope.Func = {
                    getTaskList: function (cartable, filter) {
                        $scope.Controller.searchController.searchQuery = {};
                        $timeout(function () {
                            // $timeout(function () {
                                $scope.Controller.searchController.searchableFieldInfo = [];
                                $scope.Controller.searchController.searchableFieldInfo = angular.copy($scope.options[cartable.taskType.split("_")[0]].searchableFieldInfo);
                                $scope.Controller.listController.headers = angular.copy($scope.options[cartable.taskType.split("_")[0]].headers);
                                if (filter.extraData && angular.isString(filter.extraData.searchQuery)) {
                                    $scope.Controller.searchController.searchQuery = JSON.parse(filter.extraData.searchQuery);
                                }
                                angular.extend($scope.Controller.searchController.searchQuery, cartableSrvc.getRegisteredSearchQuery($scope.Data.selectedFilter.uid));
                                if (filter.extraData && filter.extraData.selectedFromMultiselect && angular.isString(filter.extraData.selectedFromMultiselect)) {
                                    var selectedFromMultiselect = JSON.parse(filter.extraData.selectedFromMultiselect);
                                    angular.extend(selectedFromMultiselect, cartableSrvc.getRegisterFilterSearchQuery($scope.Data.selectedFilter.uid));
                                    if ($scope.Controller.searchController.initSearchFieldInfo) {
                                        $scope.Controller.searchController.initSearchFieldInfo(selectedFromMultiselect, cartableSrvc.getRegisterShowFilterSearchQuery($scope.Data.selectedFilter.uid), $scope.Controller.searchController.searchQuery);
                                    } else {
                                        $scope.Controller.searchOptions.selectedFromMultiselect = selectedFromMultiselect;
                                        $scope.Controller.searchOptions.showFilterSearchQuery = cartableSrvc.getRegisterShowFilterSearchQuery($scope.Data.selectedFilter.uid);
                                    }
                                } else {
                                    if ($scope.Controller.searchController.initSearchFieldInfo) {
                                        $scope.Controller.searchController.initSearchFieldInfo(cartableSrvc.getRegisterFilterSearchQuery($scope.Data.selectedFilter.uid), cartableSrvc.getRegisterShowFilterSearchQuery($scope.Data.selectedFilter.uid), $scope.Controller.searchController.searchQuery);
                                    } else {
                                        $scope.Controller.searchOptions.selectedFromMultiselect = cartableSrvc.getRegisterFilterSearchQuery($scope.Data.selectedFilter.uid);
                                        $scope.Controller.searchOptions.showFilterSearchQuery = cartableSrvc.getRegisterShowFilterSearchQuery($scope.Data.selectedFilter.uid);
                                    }
                                }

                                if (filter.extraData && filter.extraData.searchableFieldInfo && angular.isString(filter.extraData.searchableFieldInfo)) {
                                    $scope.Controller.searchController.searchableFieldInfo = JSON.parse(filter.extraData.searchableFieldInfo);
                            }
                                // $scope.Controller.searchController.init();
                                $scope.Func.onSearchClick(true);
                            // }, 1);
                        }, 1)
                    },
                    notifyOnChangeFilter: function (data) {
                        $scope.Data.selectedCartable = data.cartable;
                        $scope.Data.selectedFilter = data.filter;
                        $scope.Data.taskType = $scope.Data.selectedCartable.taskType.split("_")[0];
                        $scope.Func.getTaskList(data.cartable, data.filter);
                        $scope.Data.title = data.filter.title;
                        if ($scope.Data.selectedFilterTemp.uid && $scope.Data.selectedFilter.uid != $scope.Data.selectedFilterTemp.uid) {
                        	cartableSrvc.current = 1;
                        }
                        $scope.Data.selectedFilterTemp = data.filter;
                        $scope.Controller.listController.headers = [];
                        //correct query if it's null
                        if (!$scope.Data.selectedFilter.query)
                            $scope.Data.selectedFilter.query = {
                                restrictions: [],
                                orders: []
                            };
                        // visible fields for table dropdown
                        $scope.Controller.listController.visibleFields = $scope.Data.selectedCartable.extents.list;
                        $location.search(angular.extend({filter: data.filter.uid}, $location.search()));
                    },
                    onSearchClick: function (doNotRegister, filterSearchQuery, showSearchableFieldInfo) {
                        var defer = $q.defer();
                        if (!doNotRegister) {
                            cartableSrvc.registerSearchQuery($scope.Data.selectedFilter.uid, $scope.Controller.searchController.searchQuery);
                            cartableSrvc.registerFilterSearchQuery($scope.Data.selectedFilter.uid, filterSearchQuery);
                            cartableSrvc.registerShowFilterSearchQuery($scope.Data.selectedFilter.uid, showSearchableFieldInfo);
                        }
                            var restrictions = vtCartableSearchSrvc.createSimpleSearchRestriction($scope.Controller.searchController.searchQuery, $scope.Controller.searchController.searchableFieldInfo);
                            var query = {
                                restrictions: restrictions,
                                orders: $scope.Data.selectedCartable.orders
                            };
                            if ($scope.Data.selectedFilter.query && $scope.Data.selectedFilter.query.restrictions && $scope.Data.selectedFilter.query.restrictions.length)
                                    query.restrictions = query.restrictions.concat($scope.Data.selectedFilter.query.restrictions);
                            var searchFunc = function (start, len) {
                                cartableSrvc.registerCurrentTaskState('len', len);
                                if (query.orders) {
                                    query.orders = [];
                                }
                                return cartableSrvc.searchTask($scope.Data.selectedCartable.taskType, query, start, len);
                            };
                            var orderFunc = function (taskType, query, start, len) {
                                cartableSrvc.registerCurrentTaskState('len', len);
                                return cartableSrvc.searchTask(taskType, query, start, len);
                            };
                            $scope.Data.cartableState = cartableSrvc.getCartableState();
                            if (!$scope.Data.cartableState.filter || ($scope.Data.cartableState.filter.uid != $scope.Data.selectedFilter.uid)) {
                                $scope.Data.cartableState = {
                                    visibleHeaders: [],
                                    filter: $scope.Data.selectedFilter,
                                    taskType: "",
                                    currentPage: $scope.Data.cartableState.currentPage,
                                    selectedFilter: $scope.Data.selectedFilter
                                };
                                cartableSrvc.setCartableState($scope.Data.cartableState);
                            }
                            $scope.Controller.listController.getList = searchFunc;
                            $scope.Controller.listController.searchFunction = orderFunc;
                            $scope.Controller.listController.searchQuery = query;
                            $scope.Controller.listController.checkedItemList = [];
                            $timeout(function () {

                                $scope.Controller.listController.ctrlData = {
                                    taskType: $scope.Data.selectedCartable.taskType,
                                    filter: $scope.Data.selectedFilter
                                };
                                //FIXME: get current page from cartableSrvc.getCurrentPage()
                                if($scope.Controller.listController.goToPage){
                                    $scope.Controller.listController.goToPage(cartableSrvc.current).then(defer.resolve);
                                }
                                else{
                                    defer.resolve(null);
                                }
                            }, 1);
                        return defer.promise;
                    },
                    onExitSearchModeClick: function () {
                        cartableSrvc.onCartableListItemChecked(undefined);
                        cartableSrvc.registerSearchQuery($scope.Data.selectedFilter.uid, {});
                        cartableSrvc.registerFilterSearchQuery($scope.Data.selectedFilter.uid, {});
                        cartableSrvc.registerShowFilterSearchQuery($scope.Data.selectedFilter.uid, {});
                        $scope.Func.onSearchClick(true);
                    },

                    onTaskClick: function (task, index) {
                        cartableSrvc.registerCurrentTaskState('index', index);
                        cartableSrvc.registerCurrentTaskState('page', $scope.Controller.listController.currentPage);
                        cartableSrvc.registerCurrentTaskState('totalCount', $scope.Controller.listController.listItems.totalCount);
                        $scope.processTaskFn({task: task, cartable: $scope.Data.selectedCartable});
                    }
                };
                cartableSrvc.subscribeOn("cartableListDirective", $scope.Func.notifyOnChangeFilter);

                $scope.Controller = {
                    listController: {
                        headers: [],
                        getList: null,
                        onListItemSelect: $scope.Func.onTaskClick,
                        checkedItemList: [],
                        options: {
                            customPagination: $scope.options.customPagination
                        }
                    },

                    searchController: {
                        advanced: false,
                        searchableFieldInfo: [],
                        onSearchClick: $scope.Func.onSearchClick,
                        onExitSearchModeClick: $scope.Func.onExitSearchModeClick
                    },
                    searchOptions: {}

                }

                var Run = function () {
                    $modalStack.dismissAll();
                    $('#saveAsCom').bind('click', function (e) {
                        e.stopPropagation();
                    });
                    $scope.Controller.listController.callHook = function (cartableState,listItems) {

                        cartableSrvc.cacheLastVisitedCartableFilterList(cartableState.taskType + cartableState.filter.uid,listItems);
                        $timeout(function () {
                            $('tr:has(td .glyphicon.glyphicon-eye-close:not(.ng-hide))')
                                .css({'background-color': "#fff", 'font-weight': 'bold'});
                            $('tr:has(td .glyphicon.glyphicon-eye-open:not(.ng-hide))')
                                .css({'background-color': "#f8f8f8", 'font-weight': 'unset'});
                            $scope.Controller.listController.currentPage = cartableSrvc.getCurrentPage();
                        }, 1);
                    }

                    $scope.api.listController = $scope.Controller.listController;
                }

                Run();
                $scope.directiveIsReady();
            }
        }
    });
