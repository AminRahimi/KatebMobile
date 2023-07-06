angular.module('allUserModule').config(['$stateProvider', function ($stateProvider) {

    var allUserStates = [
        {
            state: "base.home.management.allUser",
            config: {
                url: '/allUser',
                views: {
                    'content@base.home.management': {
                        templateUrl: "app/modules/management/allUser/allUser.html",
                        controller: 'allUserCtrl'
                    }
                }
            }
        },
        {
            state: "base.mobileHome.management.allUser",
            config: {
                url: '/allUser',
                views: {
                    'mainContent@base.mobileHome' : {
                        templateUrl: "app/modules/management/allUser/allUser.html",
                        controller: 'allUserCtrl'
                    }
                }
            }
        }
    ];
    allUserStates.forEach(function (state) {
        $stateProvider.state(state.state, state.config);
    });

}]);
