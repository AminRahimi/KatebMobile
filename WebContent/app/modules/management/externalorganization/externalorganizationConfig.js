angular.module('externalorganizationModule').config(['$stateProvider', function($stateProvider) {
	var externalorganizationStates = [
		{
			state: "home.management.externalorganization",
			config: {
				url: '/:orgUid/externalorganization/',
				views: {
					'content@home.management': {
						templateUrl: "app/modules/management/externalorganization/externalorganization.html",
						controller: 'externalorganizationCtrl'
					}
				}
			}
		}
	];
	externalorganizationStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
