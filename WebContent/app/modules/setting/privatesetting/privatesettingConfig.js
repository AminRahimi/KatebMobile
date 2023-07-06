angular.module('privatesettingModule').config(['$stateProvider', function($stateProvider) {
	var privatesettingStates = [
		{
			state: "home.setting.privatesetting",
			config: {
				url: '/privatesetting/',
				views: {
					'mainContent@home': {
						templateUrl: "app/modules/setting/privatesetting/privatesetting.html",
						controller: 'privatesettingCtrl'
					}
				}
			}
		}
	];
	privatesettingStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
