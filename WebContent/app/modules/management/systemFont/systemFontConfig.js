angular.module('systemFontModule').config(['$stateProvider', function($stateProvider) {
	var publicsettingStates = [
		{
			state: "base.home.management.systemFont",
			config: {
				url: '/:orgUid/systemFont/',
				views: {
					'content@base.home.management': {
						templateUrl: "app/modules/management/systemFont/systemFont.html",
						controller: 'systemFontCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.management.systemFont",
			config: {
				url: '/:orgUid/systemFont/',
				views: {
					'mainContent@base.mobileHome' : {
						templateUrl: "app/modules/management/systemFont/systemFont.html",
						controller: 'systemFontCtrl'
					}
				}
			}
		}
	];
	publicsettingStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
