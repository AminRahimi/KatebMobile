angular.module('secretariatModule').directive('secretariatMenu',

    function () {
        return {
            restrict: 'EAC',
            templateUrl: 'app/modules/secretariat/secretariatMenu.html',
            scope: {
                onMenuItemClick:"&"
            },
            controller: function ($scope,secretariatSrvc,homeSrvc,$state,$modal) {

                $scope.stateName=$state.current.name;
                $scope.Data = {
                    secretariatList: [],
                    incommingUisref: "",
                }
                $scope.Func = {
                    onMenuClick: function(secretariat, menu){
                        if($scope.Data.prevMenu)
                            $scope.Data.prevMenu.active = false;
                        menu.active = true;
                        $scope.Data.prevMenu = menu;
                        var stateName = $scope.Func.getStateName(menu.uiSref);


                        secretariatSrvc.setBackButton(stateName);

                        $state.go(stateName, {secUid: secretariat.uid});

                        if(angular.isFunction($scope.onMenuItemClick)){

                            $scope.onMenuItemClick()
                        }
                    },

                    gotoDefaultPage: function(){
                        var statename = $scope.Func.getStateName('base.home.secretariat');
                        if($scope.stateName === statename){
                            //TODO go to first available menu of first secretariat
                        }
                    },
                    onAddIncommingClick: function(secretariat) {
                        var modalInstance = $modal.open({
                            templateUrl: 'app/modules/secretariat/incoming/incommingLetterTemplateList.html',
                            controller: 'incommingLetterTemplateListCtrl',
                            size: 'md'
                        });
                        modalInstance.result.then(function (incommingLetterTemplate) {
                            var statename = $scope.Func.getStateName('base.home.secretariat.incoming');
                            if ($state.current.name !== statename){
                                secretariatSrvc.setBackButton($scope.Data.incommingUisref);
                                $state.go(statename, {
                                    secUid: secretariat.uid,
                                    tmpUid: incommingLetterTemplate.uid
                                });
                            }
                        });

                        if(angular.isFunction($scope.onMenuItemClick)){

                            $scope.onMenuItemClick()
                        }
                        // $scope.Func.toggleCollapseMenu();
                    },
                    onAddIssuedClick: function(secretariat) {
                        var statename = $scope.Func.getStateName('base.home.secretariat.issuedAdd');
                        $state.go(statename, {secUid: secretariat.uid});
                        if(angular.isFunction($scope.onMenuItemClick)){

                            $scope.onMenuItemClick()
                        }
                        // $scope.Func.toggleCollapseMenu();
                    },
                    onReserveClick: function (secretariat) {
                        var statename = $scope.Func.getStateName('base.home.secretariat.reserve');
                        $state.go(statename);

                        if(angular.isFunction($scope.onMenuItemClick)){

                            $scope.onMenuItemClick()
                        }
                        // $scope.Func.toggleCollapseMenu();
                    },
                    isIncommingPage: function(){
                        var statename = $scope.Func.getStateName('base.home.secretariat.incoming');
                        return ($state.current.name === statename)
                    },
                    generateSecretariatMenu: function (){
                        homeSrvc.generateSecretariatMenu().then(function (sideMenu){
                            $scope.Data.secretariatList = sideMenu;
                        });
                    },
                    getStateName: function (stateName) {
                        return homeSrvc.getStateName(stateName);
                    },
                }



                var Run = function () {
                    $scope.Func.generateSecretariatMenu();
                    $scope.Func.gotoDefaultPage();

                    // FIXME
                    // if (menuListItem.key === "INCOMMING") {
                    // 	$scope.Data.incommingUisref = menuListItem.uiSref;
                    // }

                };



                Run();
            },
            link: function (scope, element, attrs, ctrls) {
            }
        };
    });
