angular.module('processModule').controller('processCtrl', function ($scope, $state, $rootScope, cartableSrvc, processKatebSrvc) {

    $scope.Data = {};

    $scope.Func = {
        processListMenuIndermidiariFn: function(filter) {
            processKatebSrvc.onprocessListItemChecked(null);
            $state.go('home.process.processTaskList');
            cartableSrvc.publishTo("cartableListDirective",filter);
            $scope.Data.selectedFilter = filter;
        }
    }

    $scope.Controller = {
        processMenu: {
            settings: {
                taskSettings: {
                    isDisabledAddTask: false,
                    state: 'home.process.processList',
                    btnLable: 'آغاز فرآیند'
                }
            }
        }
    };



    // var Run = function () {
    // }

    // Run();
});