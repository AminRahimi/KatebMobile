angular.module('vtCartable').directive('cartableMenuForCartable',
    
    function () {
        return {
            restrict: 'EAC',
            templateUrl: 'app/lib/vtCartable/cartableMenu/cartableMenuForCartable.html',
            scope: {
                onMenuItemClick:"&",
                options:"=?"
            },
            controller: function ($scope,$state,cartableSrvc,homeSrvc) {
                $scope.Data = {};

                $scope.Func = {
                    getStateName: function (stateName) {
                        return homeSrvc.getStateName(stateName);
                    },

                    cartableListMenuIndermidiariFn: function(cartableFilterObj) {
                        cartableSrvc.onCartableListItemChecked(null);
                        
                        var stateName = $scope.Func.getStateName('base.home.cartable.cartableList');
                        $state.go(stateName,{
                            cartableUid: cartableFilterObj.cartable.taskType,
                            filter: cartableFilterObj.filter.uid
                        });
                        cartableSrvc.publishTo("selectedCartableFilterChanged",cartableFilterObj);
                        $scope.Data.selectedFilter = cartableFilterObj;

                        if(angular.isFunction($scope.onMenuItemClick)){

                            $scope.onMenuItemClick()
                        }
                    }
                }

                $scope.Controller = { 
                    cartableMenu: {
                        settings: {
                            taskSettings: {
                                isDisabledAddTask: false,
                                state: $scope.Func.getStateName('base.home.cartable.draft({orgUid: "CURRENT"})'),
                                btnLable: 'ارسال پیش نویس',
                                extraBtns: [{
                                    btnState: $scope.Func.getStateName('base.home.cartable.draft({orgUid: "EXTERNAL"})'),
                                    btnLabel: 'ارسال پیشنویس بین سازمانی',
                                    feature: 'SEND_DRAFT_TO_OTHER_ORG',
                                    btnIcon: 'flaticon-pencil-and-paper'
                                }]
                            },
                            customCartable: {
                                title: 'همه نامه‌ها',
                                list: [{
                                    title: 'همه نامه‌ها',
                                    uiSref: $scope.Func.getStateName('base.home.cartable.orgLetterList')
                                },{
                                    title: 'نامه های آرشیو شده',
                                    uiSref: $scope.Func.getStateName('base.home.cartable.archiveLetterList')
                                }]
                            }
                        }
                    }
                };

                cartableSrvc.subscribeOn('isDisabledAddTask',function (isDisabledAddTask){
                    $scope.Controller.cartableMenu.settings.taskSettings.isDisabledAddTask = isDisabledAddTask;
                });

              
            },
            link: function (scope, element, attrs, ctrls) {
            }
        };
    });
