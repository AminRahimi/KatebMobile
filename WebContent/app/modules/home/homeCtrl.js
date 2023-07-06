angular.module('HomeModule').controller('homeCtrl', ['$scope', '$rootScope', '$state', 'homeSrvc', 'currentUserConfig', 'themeConst', 'katebSrvc', 'searchSrvc',
    function ($scope, $rootScope, $state, homeSrvc, currentUserConfig, themeConst, katebSrvc, searchSrvc,vtShowMessageSrvc) {

        $scope.Data = {
            unreadMessagesCount: "",
            unReadNews: currentUserConfig.userConfig.unReadNews,
            showSearchBar: currentUserConfig.showSearchBar,
            currentUserConfig:currentUserConfig
        };

        $scope.isLoading = false;
        $scope.userFullName = currentUserConfig.userConfig.userFullName;
        $rootScope.currentUserOrg = currentUserConfig.userConfig.organization ? currentUserConfig.userConfig.organization : {};
        $rootScope.currentUserSignature = !_.isEmpty(currentUserConfig.userConfig.signature) ? currentUserConfig.userConfig.signature : {};
        $scope.stateName = $state.$current.name;
        $scope.time = new Date();
        $scope.version = currentUserConfig.appVersion;

        var generateMenuData = function () {
            // if(currentUserConfig.userConfig.features['API_LIST_ORGANIZATION']){
            // 	homeSrvc.getOrganizationList().then(function(response){
            // 		$scope.menuData = homeSrvc.generateMenuData(response.data);
            // 	});
            // }else{
            // 	$scope.menuData = homeSrvc.generateMenuData([]);
            // }
            $scope.menuData = homeSrvc.generateMenuData([]);
            $scope.settingMenu = homeSrvc.generateSettingMenu();
        }
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

        $scope.onSubmenuClick = function (childItem, submenu) {
            $state.go(submenu.uiSref, {orgUid: childItem.orgUid});
        };

        $scope.$on('$stateChangeSuccess', function () {
            $scope.stateName = $state.$current.name;
        });

        if ($scope.stateName == "home")
            $state.go('home.cartable');

        if (currentUserConfig.userConfig.passwordExpired) {
            $state.go('home.changePassword');
        }


        generateMenuData();


        $scope.themeList = [
            {
                name: "default",
                mainColor: "#0097a7",
                persianName: "پیش فرض",
                secondColor: "#fb7546",
                thirdColor: "#eee",
            },
            {
                name: "blue",
                mainColor: "#0062d2",
                persianName: "آبی",
                secondColor: "#00d576",
                thirdColor: "#eee"
            }
        ],


            $scope.themeObj = _.find($scope.themeList, function (theme) {
                return theme.name == themeConst;
            });
        $scope.loadCss = function (theme) {
            $scope.themeObj = angular.copy(theme);
            if (theme.name === "default") {
                if (document.getElementById('new-theme')) {
                    document.getElementById('new-theme').remove();
                }
            } else {
                if (document.getElementById('new-theme')) {
                    document.getElementById('new-theme').setAttribute('href', 'app/assets/css/kateb-theme-' + theme.name + '.css');
                } else {
                    elem = document.createElement("link");
                    elem.id = 'new-theme';
                    elem.rel = "stylesheet";
                    elem.type = "text/css";
                    elem.href = 'app/assets/css/kateb-theme-' + theme.name + '.css';
                    document.getElementsByTagName("head")[document.getElementsByTagName("head").length - 1].appendChild(elem);
                }

            }
        }($scope.themeObj);

        $scope.getUnreadMessagesCount = function () {
            katebSrvc.getUnreadMessagesCount().then(function (res) {
                $scope.Data.unreadMessagesCount = res.data;
            });
        };
        $scope.getUnreadMessagesCount();

        var decreaceUnreadNewsCount = function () {
            if ($scope.Data.unReadNews > 0) {
                $scope.Data.unReadNews--;
            }
        };

        // Use $rootScope.$broadcast("getUnreadMessagesCount");
        $scope.$on('getUnreadMessagesCount', $scope.getUnreadMessagesCount);
        $scope.$on('decreaceUnreadNewsCount', decreaceUnreadNewsCount);

        $scope.Func = {
            onGetClientLogClick: function () {
                const link = document.createElement("a");

                // Create a blog object with the file content which you want to add to the file
                const file = new Blob([localStorage.trackjs], { type: 'text/plain' });

                // Add file content in the object URL
                link.href = URL.createObjectURL(file);

                // Add file name
                link.download = `kateb.client_error_${moment(Date.now()).format('jYYYY_jM_jD_HH_mm_ss')}.log`;

                // Add click event to <a> tag to save file.
                link.click();
                URL.revokeObjectURL(link.href);
                localStorage.removeItem('trackjs')
            },
            onSearchClick: function (mode) {
                if (mode == 'advanced') {
                    $state.go('home.search');
                } 
                if ($scope.Data.searchQuery && $scope.Data.searchQuery.query) {
                    if ($scope.Data.searchQuery.query.quickSearch ||
                        ($scope.Data.searchQuery.query.date && $scope.Data.searchQuery.query.date.length) ||
                        ($scope.Data.searchQuery.query.delivery && $scope.Data.searchQuery.query.delivery.length) ||
                        ($scope.Data.searchQuery.query.sender && $scope.Data.searchQuery.query.sender.length) ||
                        ($scope.Data.searchQuery.query.tag && $scope.Data.searchQuery.query.tag.length)) {

                        searchSrvc.setSearchQuery($scope.Data.searchQuery);
                        $state.go('home.search', {q: encodeURIComponent(JSON.stringify(angular.copy($scope.Data.searchQuery)))}, {reload: true});
                        //$state.go('home.search', {}, {reload: true});
                    }
                }
            },
            getPuaList: searchSrvc.getPuaList,
            getTagList: {
                label: 'برچسب',
                getList: searchSrvc.getTagList
            },
        };
        $scope.Data.searchQuery = searchSrvc.getSearchQuery();
        $scope.$on('searchQueryHeaderUpdate', function () {
            $scope.Data.searchQuery = searchSrvc.getSearchQuery();
        });

    }]);
