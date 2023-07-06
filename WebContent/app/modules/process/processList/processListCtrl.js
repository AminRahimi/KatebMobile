angular.module('processModule').controller('processListCtrl', function ($scope, processKatebSrvc,homeSrvc) {
    $scope.Data = {
        processList: []
    };

    $scope.Func = {
        getStateName: function (stateName){
            return homeSrvc.getStateName(stateName);
        },
        getAvailableProcessList: function () {
            processKatebSrvc.getAvailableProcessList().then(function (res) {
                $scope.Data.processList = res.data;
            });
        }
    };

    var Run = function () {
        $scope.Func.getAvailableProcessList();
    };

    Run();
});