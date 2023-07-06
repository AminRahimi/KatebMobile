angular.module('reportModule').controller('processReportCtrl',function($scope, reportSrvc, $state, katebSrvc) {

    $scope.Data = {
        processList: []
    };

    $scope.Func = {
        getProcessReportList: function () {
            reportSrvc.getProcessReportList().then(function (res) {
                $scope.Data.letterList = res.data.result;
            });
        },
        onSearchClick: function () {
            if ($scope.Controller.searchController.searchQuery.createTime) {
                var date =  $scope.Controller.searchController.searchQuery.createTime.split(',');
                reportSrvc.searchProcessReportList(date[0], date[1]).then(function (res) {
                    $scope.Data.processList = res.data;
                });
            }
        },
        onExitSearchModeClick: function () {
            $scope.Func.getProcessReportList();
        }
        // onExcelClick: function(){
        //     katebSrvc.downloadByLink("api/report/letter_org/excel");
        // },
        // onPdfClick: function(){
        //     katebSrvc.downloadByLink("api/report/letter_org/pdf");
        // }
    };

    $scope.Controller = {
        searchController: {
            advanced: false,
            searchableFieldInfo: [
                {key:"createTime", type:"fTDate", label:'بازه زمانی'}
            ],
            onSearchClick: $scope.Func.onSearchClick,
            onExitSearchModeClick: $scope.Func.onExitSearchModeClick
        }
    };

    var Run = function(){
        $scope.Func.getProcessReportList();
    };

    Run();

});