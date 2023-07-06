angular.module('privatehameshhotkeyModule').config(['$stateProvider', function($stateProvider) {
	var hameshhotkeyStates = [
		{
			state: "base.home.setting.hameshhotkey",
			config: {
				url: '/hameshhotkey/',
				views: {
					'mainContent@home': {
						templateUrl: "app/modules/setting/hameshhotkey/privatehameshhotkey.html",
						controller: 'privatehameshhotkeyCtrl'
					}
				}
			}
		}
	];
	hameshhotkeyStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
