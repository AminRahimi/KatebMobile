angular.module('accessAllLettersModule').controller('accessAllLettersCtrl', function ($scope, reportSrvc, $state, accessAllLettersSrvc,homeSrvc) {
    $scope.Data = {
        allAccessLetters: [],
        allOrganizations: [],
        ecxelLink:""
    }
    $scope.Func = {
        getAllAccessLetters: function () {
            accessAllLettersSrvc.getAllAccessLetters('').then(function (response) {
                $scope.Data.allAccessLetters = response.data;
            })
        },
        onExcelClick: function () {
            $scope.Data.excelLink = 'api/user/report/all_letter/excel?org_uid=';
        }
    }
    var Run = function () {
        $scope.Func.getAllAccessLetters();
        $scope.Func.onExcelClick(); 
    };

    Run();
});