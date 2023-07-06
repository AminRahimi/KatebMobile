angular.module('accessAllLettersModule').controller('accessAllLettersForOrgUsersCtrl', function ($scope, reportSrvc, $state, accessAllLettersSrvc,homeSrvc) {
    $scope.Data = {
        allAccessLetters: [],
        allOrganizations: [],
        selectedMenu: "",
        excelLink:""
    }
    $scope.Func = {
        getStateName: function (stateName) {
            return homeSrvc.getStateName(stateName);
        },
        getAllAccessLetters: function (orguid) {
            accessAllLettersSrvc.getAllAccessLetters(orguid).then(function (response) {
                $scope.Data.allAccessLetters = response.data;
            })
        },
        
        getOrganizationList: function () {
            homeSrvc.getOrganizationList().then(function (response) {
                 $scope.Data.allOrganizations = response.data.originalElement;
            });
        },
        onSelectOraganizationSelect: function (item) {
            localStorage.selectedManagementMenu = JSON.stringify(item);
            if ($state.current.name != $scope.Func.getStateName("base.home.management")) {
                $state.go($state.current.name, {orgUid: item.uid});
            };
            $scope.Func.getAllAccessLetters($scope.Data.selectedMenu.uid)
            $scope.Func.onExcelClick(); 
        },
        onExcelClick: function () {
            $scope.Data.excelLink = 'api/user/report/all_letter/excel?org_uid=' + $scope.Data.selectedMenu.uid;
        }
    }
    var Run = function () {
        $scope.Func.getOrganizationList();
    };

    Run();
});