angular.module('allUserModule').config(['$stateProvider', function ($stateProvider) {

    var allUserStates = [
        {
            state: "home.management.allUser",
            config: {
                url: '/allUser',
                views: {
                    'content@home.management': {
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
