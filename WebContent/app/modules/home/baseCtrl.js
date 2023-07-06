
angular.module('HomeModule').controller('baseCtrl',
    function ($scope, $rootScope, $state, homeSrvc, currentUserConfig, themeConst) {



        // TODO: check usefulness of isLoading
        $scope.isLoading = false;
        
        $rootScope.currentUserOrg = currentUserConfig.userConfig.organization ? currentUserConfig.userConfig.organization : {};
        $rootScope.currentUserSignature = !_.isEmpty(currentUserConfig.userConfig.signature) ? currentUserConfig.userConfig.signature : {};
        $scope.stateName = $state.$current.name;
        
        

       
        

        

        $scope.$on('$stateChangeSuccess', function () {
            $scope.stateName = $state.$current.name;
        });

        if ($scope.stateName === "base")
            $state.go('base.home.cartable');

        if (currentUserConfig.userConfig.passwordExpired) {
            $state.go('base.home.changePassword');
        }


        


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

        
        

        

        

    });
