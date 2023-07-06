angular.module('loginSettingModule').config(['$stateProvider', function($stateProvider) {
	var loginSettingStates = [
		{
			state: "base.home.management.loginSetting",
			config: {
				url: '/loginSetting',
				views: {
					'content@base.home.management': {
                        templateUrl: "app/modules/management/loginSetting/loginSetting.html",
						controller: 'loginSettingCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.management.loginSetting",
			config: {
				url: '/loginSetting',
				views: {
					'mainContent@base.mobileHome' : {
						templateUrl: "app/modules/management/loginSetting/loginSetting.html",
						controller: 'loginSettingCtrl'
					}
				}
			}
		}
	];
	loginSettingStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);