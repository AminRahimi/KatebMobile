angular.module('newsModule').config(['$stateProvider', function ($stateProvider) {
    var moduleStates = [
        {
        state: "base.home.management.news",
        config: {
            url: '/:orgUid/news/:mode/:newsId',
            views: {
                'content@base.home.management': {
                    templateUrl: "app/modules/management/news/newsManagement.html",
                    controller: 'newsManagementCtrl'
                }
            }
        }
    },
    {
        state: "base.mobileHome.management.news",
        config: {
            url: '/:orgUid/news/:mode/:newsId',
            views: {
                'mainContent@base.mobileHome' : {
                    templateUrl: "app/modules/management/news/newsManagement.html",
                    controller: 'newsManagementCtrl'
                }
            }
        }
    },





    {
        state: "base.home.management.newsList",
        config: {
            url: '/:orgUid/newsList',
            views: {
                'content@base.home.management': {
                    templateUrl: "app/modules/management/news/newsListManagement.html",
                    controller: 'newsListManagementCtrl'
                }
            }
        }
    },
    {
        state: "base.mobileHome.management.newsList",
        config: {
            url: '/:orgUid/newsList',
            views: {
                'mainContent@base.mobileHome' : {
                    templateUrl: "app/modules/management/news/newsListManagement.html",
                    controller: 'newsListManagementCtrl'
                }
            }
        }
    }



    ];
    moduleStates.forEach(function (state) {
        $stateProvider.state(state.state, state.config);
    });
}]);