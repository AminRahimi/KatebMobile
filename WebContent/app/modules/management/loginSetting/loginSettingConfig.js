angular.module('loginSettingModule').config(['$stateProvider', function($stateProvider) {
	var loginSettingStates = [
		{
			state: "home.management.loginSetting",
			config: {
				url: '/loginSetting',
				views: {
					'content@home.management': {
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