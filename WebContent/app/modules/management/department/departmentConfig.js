angular.module('departmentModule').config(['$stateProvider', function ($stateProvider) {
    var departmentStates = [
        {
            state: "base.home.management.department",
            config: {
                url: '/:orgUid/department',
                views: {
                    'content@base.home.management': {
                        templateUrl: "app/modules/management/department/department.html",
                        controller: 'departmentCtrl'
                    }
                }
            }
        },
        {
            state: "base.mobileHome.management.department",
            config: {
                url: '/:orgUid/department',
                views: {
                    'mainContent@base.mobileHome' : {
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