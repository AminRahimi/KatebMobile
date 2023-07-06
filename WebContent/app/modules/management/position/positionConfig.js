angular.module('positionModule').config(['$stateProvider', function($stateProvider) {
	var positionStates = [
		{
			state: "base.home.management.position",
			config: {
				url: '/:orgUid/position/',
				views: {
					'content@base.home.management': {
						templateUrl: "app/modules/management/position/position.html",
						controller: 'positionCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.management.position",
			config: {
				url: '/:orgUid/position/',
				views: {
					'mainContent@base.mobileHome' : {
						templateUrl: "app/modules/management/position/position.html",
						controller: 'positionCtrl'
					}
				}
			}
		}
	];
	positionStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
