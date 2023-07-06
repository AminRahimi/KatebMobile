angular.module('positionModule').config(['$stateProvider', function($stateProvider) {
	var positionStates = [
		{
			state: "home.management.position",
			config: {
				url: '/:orgUid/position/',
				views: {
					'content@home.management': {
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
