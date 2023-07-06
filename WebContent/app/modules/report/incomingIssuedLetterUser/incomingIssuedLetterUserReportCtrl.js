angular.module('reportModule').controller('incomingIssuedLetterUserReportCtrl',function($scope, reportSrvc, $state, katebSrvc) {

    $scope.Data = {
        letterList: [],
        ltValue : moment().startOf('day'),
        // convert jmonth to days
        gtValue : moment().startOf('day').subtract(1, 'days'),
    };

    $scope.Func = {
        getIncomingIssuedLetter: function () {
            reportSrvc.getIncomingIssuedUserLetter().then(function (res) {
                $scope.Data.letterList = res.data;
            });
        },
        onSearchClick: function () {
            if ($scope.Controller.searchController.searchQuery.creationDate) {
                var date =  $scope.Controller.searchController.searchQuery.creationDate.split(',');
                var toDate = parseInt(date[1]);
                toDate = toDate + 86399999;
                date[1] = toDate.toString();
                reportSrvc.searchIncomingIssuedUserLetter(date[0], date[1]).then(function (res) {
                    $scope.Data.letterList = res.data;
                });
            }
        },
        onExitSearchModeClick: function () {
            $scope.Func.getIncomingIssuedUserLetter();
        },
        onExcelClick: function(){
            if ($scope.Controller.searchController.searchQuery.creationDate) {
                var date = $scope.Controller.searchController.searchQuery.creationDate.split(',');
                var toDate = parseInt(date[1]);
                toDate = toDate + 86399999;
                date[1] = toDate.toString();
                reportSrvc.getExcelReport(date[0], date[1]);
            } else {
                reportSrvc.getExcelReport($scope.Data.gtValue, $scope.Data.ltValue);
            }
        },
        onPdfClick: function(){
            if ($scope.Controller.searchController.searchQuery.creationDate) {
                var date = $scope.Controller.searchController.searchQuery.creationDate.split(',');
                var toDate = parseInt(date[1]);
                toDate = toDate + 86399999;
                date[1] = toDate.toString();
                reportSrvc.getPdfReport(date[0], date[1]);
            } else {
                reportSrvc.getPdfReport($scope.Data.gtValue, $scope.Data.ltValue);
            }
        }
    };

    $scope.Controller = {
        searchController: {
            advanced: false,
            searchableFieldInfo: [
                {key:"creationDate", type:"date",gtValue:$scope.Data.gtValue,ltValue:$scope.Data.ltValue}
            ],
            onSearchClick: $scope.Func.onSearchClick,
            onExitSearchModeClick: $scope.Func.onExitSearchModeClick
        }
    };

    var Run = function () {
        var toDate = Date.parse($scope.Data.ltValue);
                toDate = toDate + 86399999;
                $scope.Data.ltValue = toDate.toString();
        reportSrvc.searchIncomingIssuedUserLetter( $scope.Data.gtValue ,$scope.Data.ltValue).then(function (res) {
                    $scope.Data.letterList = res.data;
                });
    };

    Run();

});
