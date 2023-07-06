angular.module('processManagementModule', []).config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('home.management.process', {
        url: '/:orgUid/process',
        views: {
            'content@home.management': {
                templateUrl: "app/modules/management/process/processManagement.html",
                controller: "processManagementCtrl"
            }
        }
    })
}]);