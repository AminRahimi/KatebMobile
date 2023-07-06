angular.module('vtCartable').directive('cartableMenuForProcess',
    
    function () {
        return {
            restrict: 'EAC',
            templateUrl: 'app/lib/vtCartable/cartableMenu/cartableMenuForProcess.html',
            scope: {
                onMenuItemClick:"&"
            },
            controller: function ($scope,$state,cartableSrvc,processKatebSrvc,homeSrvc) {
                $scope.Data = {};

                $scope.Func = {
                    getStateName: function (stateName){
                        return homeSrvc.getStateName(stateName);
                    },
                    processListMenuIndermidiariFn: function(cartableFilterObj) {
                        processKatebSrvc.onprocessListItemChecked(null);

                        var stateName = $scope.Func.getStateName('base.home.process.processTaskList');
                        $state.go(stateName,{
                            cartableUid: cartableFilterObj.cartable.taskType,
                            filter: cartableFilterObj.filter.uid
                        });
                        $scope.Data.selectedFilter = cartableFilterObj;
                        cartableSrvc.publishTo("selectedProcessFilterChanged",cartableFilterObj);
                        if(angular.isFunction($scope.onMenuItemClick)){
                            $scope.onMenuItemClick();
                        }
                    }
                }

                $scope.Controller = {
                    processMenu: {
                        settings: {
                            taskSettings: {
                                isDisabledAddTask: false,
                                state: $scope.Func.getStateName('base.home.process.processList'),
                                btnLable: 'آغاز فرآیند'
                            }
                        }
                    }
                };


                // FIXME: handle cartable and process needs!
                cartableSrvc.subscribeOn('isDisabledAddTask',function (isDisabledAddTask){
                    $scope.Controller.processMenu.settings.taskSettings.isDisabledAddTask = isDisabledAddTask;
                });

              
            },
            link: function (scope, element, attrs, ctrls) {
            }
        };
    });
