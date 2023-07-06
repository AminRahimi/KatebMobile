angular.module('processModule').controller('processListCtrl', function ($scope, processKatebSrvc) {
    $scope.Data = {
        processList: []
    };

    $scope.Func = {
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