angular.module('accessAllLettersModule').factory('accessAllLettersSrvc', ['Restangular', '$q', '$http', function (Restangular, $q, $http) {
    return {
        getAllAccessLetters: function (orgUId) {
            return Restangular.one('user/report/all_letter?org_uid='+orgUId).get();
        },
        // getExcelReport: function (orgUId) {
        //     return Restangular.one('user/report/all_letter/excel?org_uid='+orgUId).get();
        // }
        }

}]);
