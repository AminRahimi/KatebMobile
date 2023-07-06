angular.module('processManagementModule', []).config(['$stateProvider', function ($stateProvider) {

    var processStates = [
        {
            state: "base.home.management.process",
            config: {
                url: '/:orgUid/process',
                views: {
                    'content@base.home.management': {
                        templateUrl: "app/modules/management/process/processManagement.html",
                        controller: "processManagementCtrl"
                    }
                }
            }
        },{
            state: "base.mobileHome.management.process",
            config: {
                url: '/:orgUid/process',
                views: {
                    'mainContent@base.mobileHome' : {
                        templateUrl: "app/modules/management/process/processManagement.html",
                        controller: "processManagementCtrl"
                    }
                }
            }
        },

    ];
    processStates.forEach(function(state) {
        $stateProvider.state(state.state, state.config);
    });


}]);