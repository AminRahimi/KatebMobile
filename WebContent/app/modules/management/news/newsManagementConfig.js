angular.module('newsModule').config(['$stateProvider', function ($stateProvider) {
    var moduleStates = [{
        state: "home.management.news",
        config: {
            url: '/:orgUid/news/:mode/:newsId',
            views: {
                'content@home.management': {
                    templateUrl: "app/modules/management/news/newsManagement.html",
                    controller: 'newsManagementCtrl'
                }
            }
        }
    },{
        state: "home.management.newsList",
        config: {
            url: '/:orgUid/newsList',
            views: {
                'content@home.management': {
                    templateUrl: "app/modules/management/news/newsListManagement.html",
                    controller: 'newsListManagementCtrl'
                }
            }
        }
    }];
    moduleStates.forEach(function (state) {
        $stateProvider.state(state.state, state.config);
    });
}]);