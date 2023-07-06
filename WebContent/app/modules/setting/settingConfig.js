angular.module('SettingModule', ['confermentModule', 'privatehameshhotkeyModule', 'privatesettingModule',
    'privatetagModule', 'privategroupModule', 'templateModule', 'intelcartableModule']);
angular.module('SettingModule').config(['$stateProvider', function ($stateProvider) {
    var SettingStates = [
        {
            state: "home.setting",
            config: {
                url: "/setting",
                views: {
                    'mainContent@home': {
                        templateUrl: "app/modules/setting/setting.html",
                        controller: 'settingCtrl',
                    }
                },
                resolve: {}
            }
        }
    ];
    SettingStates.forEach(function (state) {
        $stateProvider.state(state.state, state.config);
    });

}]);