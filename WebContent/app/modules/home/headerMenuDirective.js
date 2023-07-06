angular.module('headerMenu',[]).directive('headerMenu',
    
    function () {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/home/headerMenu.html',
            scope: {
               
            },
            controller: function ($scope,homeSrvc,configSrvc,searchSrvc,katebSrvc ,$state ) {
                var currentUserConfig = configSrvc.getCachedConfigObj();
               
                $scope.Data = {
                    unreadMessagesCount: "",
                    unReadNews: currentUserConfig.userConfig.unReadNews,
                    showSearchBar: currentUserConfig.showSearchBar,
                };

                var generateMenuData = function () {
                    $scope.menuData = homeSrvc.generateMenuData([]);
                };

                $scope.onSubmenuClick = function (childItem, submenu) {
                    $state.go(submenu.uiSref, {orgUid: childItem.orgUid});
                };
                
                $scope.isMenuActive = function (menuItem) {
                    var currentState = $state.current.name;
                    var splittedCurrentState = currentState.split(".");
                    var splittedSref = menuItem.uiSref.split(".");
                    var isEqual = true;
                    for (var i = 0; i < splittedSref.length; i++) {
                        if (splittedSref[i] !== splittedCurrentState[i]) {
                            isEqual = false;
                        }
                    }
                    return isEqual;
                };

                $scope.getUnreadMessagesCount = function () {
                    katebSrvc.getUnreadMessagesCount().then(function (res) {
                        $scope.Data.unreadMessagesCount = res.data;
                    });
                };

                var decreaceUnreadNewsCount = function () {
                    if ($scope.Data.unReadNews > 0) {
                        $scope.Data.unReadNews--;
                    }
                };


                $scope.Func = {
                    getStateName: function (stateName){
                        return homeSrvc.getStateName(stateName);
                    },
                    onSearchClick: function (mode) {
                        if (mode == 'advanced') {
                            $state.go('base.home.search');
                        } 
                        if ($scope.Data.searchQuery && $scope.Data.searchQuery.query) {
                            if ($scope.Data.searchQuery.query.quickSearch ||
                                ($scope.Data.searchQuery.query.date && $scope.Data.searchQuery.query.date.length) ||
                                ($scope.Data.searchQuery.query.delivery && $scope.Data.searchQuery.query.delivery.length) ||
                                ($scope.Data.searchQuery.query.sender && $scope.Data.searchQuery.query.sender.length) ||
                                ($scope.Data.searchQuery.query.tag && $scope.Data.searchQuery.query.tag.length)) {
        
                                searchSrvc.setSearchQuery($scope.Data.searchQuery);
                                $state.go('base.home.search', {q: encodeURIComponent(JSON.stringify(angular.copy($scope.Data.searchQuery)))}, {reload: true});
                                //$state.go('base.home.search', {}, {reload: true});
                            }
                        }
                    },
                    getPuaList: searchSrvc.getPuaList,
                    getTagList: {
                        label: 'برچسب',
                        getList: searchSrvc.getTagList
                    },
                };
                
        
                



                var Run = function () {
                

                    $scope.version = currentUserConfig.appVersion;

                    $scope.getUnreadMessagesCount();

                    // Use $rootScope.$broadcast("getUnreadMessagesCount");
                    $scope.$on('getUnreadMessagesCount', $scope.getUnreadMessagesCount);
                    $scope.$on('decreaceUnreadNewsCount', decreaceUnreadNewsCount);

                    $scope.Data.searchQuery = searchSrvc.getSearchQuery();
                    $scope.$on('searchQueryHeaderUpdate', function () {
                        $scope.Data.searchQuery = searchSrvc.getSearchQuery();
                    });

                    generateMenuData();

                };



                Run();
            },
            link: function (scope, element, attrs, ctrls) {
            }
        };
    });
