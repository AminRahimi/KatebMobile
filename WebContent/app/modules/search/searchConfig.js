angular.module('searchModule', []);
angular.module('searchModule').config(['$stateProvider', function($stateProvider) {
    var searchStates = [
        {
            state: "home.search",
            config : {
                url : "/search?q",
                views: {
                    'mainContent@home': {
                        templateUrl: "app/modules/search/search.html",
                        controller: 'searchCtrl'
                    }
                },
                reloadOnSearch:false,
                resolve:{
                    
                }
            }
        }
    ];
    searchStates.forEach(function(state) {
        $stateProvider.state(state.state, state.config);
    });

}]);
