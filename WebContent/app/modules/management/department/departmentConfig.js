angular.module('departmentModule').config(['$stateProvider', function ($stateProvider) {
    var departmentStates = [
        {
            state: "home.management.department",
            config: {
                url: '/:orgUid/department',
                views: {
                    'content@home.management': {
                        templateUrl: "app/modules/management/department/department.html",
                        controller: 'departmentCtrl'
                    }
                }
            }
        }
    ];
    departmentStates.forEach(function (state) {
        $stateProvider.state(state.state, state.config);
    });

}]);