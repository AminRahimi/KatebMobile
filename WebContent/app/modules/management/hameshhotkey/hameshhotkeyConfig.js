angular.module('hameshhotkeyModule').config(['$stateProvider', function($stateProvider) {
	var hameshhotkeyStates = [
		{
			state: "home.management.hameshhotkey",
			config: {
				url: '/:orgUid/hameshhotkey/',
				views: {
					'content@home.management': {
						templateUrl: "app/modules/management/hameshhotkey/hameshhotkey.html",
						controller: 'hameshhotkeyCtrl'
					}
				}
			}
		}
	];
	hameshhotkeyStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
