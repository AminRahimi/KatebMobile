angular.module('reportModule').controller('incomingIssuedLetterCtrl',function($scope,reportSrvc, $state,secretariatSrvc) {

    $scope.Data = {
        letterList: [],
        ltValue : moment().startOf('day'),
        // convert jmonth to days
        gtValue: moment().startOf('day').subtract(1, 'days'),
        orgList: [],
        orgUId:null
    };

    $scope.Func = {
        getIncomingIssuedLetter: function () {
            reportSrvc.getIncomingIssuedLetter().then(function (res) {
                $scope.Data.letterList = res.data;
            });
        },
        onSearchClick: function (orguid) {
            if ($scope.Controller.searchController.searchQuery.creationDate) {
                var date = $scope.Controller.searchController.searchQuery.creationDate.split(',');
                var toDate = parseInt(date[1]);
                toDate = toDate + 86399999;
                date[1] = toDate.toString();
                if ($scope.Data.orguid) {
                    reportSrvc.searchIncomingIssuedLetter(date[0], date[1],$scope.Data.orguid).then(function (res) {
                    $scope.Data.letterList = res.data;
                });
                } else {
                    reportSrvc.searchIncomingIssuedLetter(date[0], date[1],'').then(function (res) {
                    $scope.Data.letterList = res.data;
                });
                }
            }
        },
        onExitSearchModeClick: function () {
            $scope.Func.getIncomingIssuedLetter();
        },
        onExcelClick: function(){
            if ($scope.Controller.searchController.searchQuery.creationDate) {
                var date = $scope.Controller.searchController.searchQuery.creationDate.split(',');
                var toDate = parseInt(date[1]);
                toDate = toDate + 86399999;
                date[1] = toDate.toString();
                reportSrvc.getExcelReport(date[0], date[1], 'incomingIssuedLetter');
            } else {
                reportSrvc.getExcelReport($scope.Data.gtValue, $scope.Data.ltValue, 'incomingIssuedLetter');
            }
        },
        onPdfClick: function(){
            if ($scope.Controller.searchController.searchQuery.creationDate) {
                var date = $scope.Controller.searchController.searchQuery.creationDate.split(',');
                var toDate = parseInt(date[1]);
                toDate = toDate + 86399999;
                date[1] = toDate.toString();
                reportSrvc.getPdfReport(date[0], date[1], 'incomingIssuedLetter');
            } else {
                reportSrvc.getPdfReport($scope.Data.gtValue, $scope.Data.ltValue, 'incomingIssuedLetter');
            }
        },
        getExternalOrganizationList: function () {
            secretariatSrvc.getExternalOrganizationList().then(function (res) {
                $scope.Data.orgList = res.data.originalElement;
            })
        },
        onSelectOrg: function (item) {
            $scope.Data.orguid = item.uid;
        },
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
        reportSrvc.searchIncomingIssuedLetter($scope.Data.gtValue,$scope.Data.ltValue).then(function (res) {
                    $scope.Data.letterList = res.data;
        });
        $scope.Func.getExternalOrganizationList()
    };

    Run(); 

});
