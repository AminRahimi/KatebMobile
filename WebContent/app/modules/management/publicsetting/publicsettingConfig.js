angular.module('publicsettingModule').config(['$stateProvider', function($stateProvider) {
	var publicsettingStates = [
		{
			state: "home.management.publicsetting",
			config: {
				url: '/:orgUid/publicsetting/',
				views: {
					'content@home.management': {
						templateUrl: "app/modules/management/publicsetting/publicsetting.html",
						controller: 'publicsettingCtrl'
					}
				}
			}
		}
	];
	publicsettingStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
