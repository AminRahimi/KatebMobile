angular.module('intelcartableModule').config(['$stateProvider', function ($stateProvider) {
    var intelcartableStates = [
        {
            state: "base.home.setting.intelcartable",
            config: {
                url: '/intelcartable/',
                views: {
                    'mainContent@home': {
                        templateUrl: "app/modules/setting/intelcartable/intelcartable.html",
                        controller: 'intelcartableCtrl'
                    }
                }
            }
        }
    ];
    intelcartableStates.forEach(function (state) {
        $stateProvider.state(state.state, state.config);
    });

}]);