angular.module('hameshhotkeyModule').config(['$stateProvider', function($stateProvider) {
	var hameshhotkeyStates = [
		{
			state: "base.home.management.hameshhotkey",
			config: {
				url: '/:orgUid/hameshhotkey/',
				views: {
					'content@base.home.management': {
						templateUrl: "app/modules/management/hameshhotkey/hameshhotkey.html",
						controller: 'hameshhotkeyCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.management.hameshhotkey",
			config: {
				url: '/:orgUid/hameshhotkey/',
				views: {
					'mainContent@base.mobileHome' : {
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
