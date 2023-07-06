angular.module('katebPrint').controller("printReportModalCtrl", function ($scope, cartableKatebSrvc, $modalInstance, letterUid) {
    $scope.Data = {
        printReport: [],
    };
    $scope.Func = {
        close: function () {
            $modalInstance.close();
        }
    };
    var Run = function () {
        cartableKatebSrvc.getPrintLog(letterUid).then(function (res) {
            $scope.Data.printReport = res.data.originalElement;
        });
    };
    Run();
});
