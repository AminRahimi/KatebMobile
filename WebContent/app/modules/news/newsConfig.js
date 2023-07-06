angular.module('newsModule').config(['$stateProvider', function ($stateProvider) {
    var moduleStates = [{
        state: "base.home.newsList",
        config: {
            url: '/newsList',
            views: {
                'mainContent@home': {
                    templateUrl: "app/modules/news/newsList.html",
                    controller: 'newsListCtrl'
                }
            }
        }
    }, {
        state: "base.home.newsList.newsDetails",
        config: {
            url: '/newsDetails/:newsUid',
            views: {
                'mainContent@home': {
                    templateUrl: "app/modules/news/newsDetails.html",
                    controller: 'newsDetailsCtrl'
                }
            }
        }
    }

];
    moduleStates.forEach(function (state) {
        $stateProvider.state(state.state, state.config);
    });

}]);

