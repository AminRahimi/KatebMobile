angular.module('externalorganizationModule').config(['$stateProvider', function($stateProvider) {
	var externalorganizationStates = [
		{
			state: "base.home.management.externalorganization",
			config: {
				url: '/:orgUid/externalorganization/',
				views: {
					'content@base.home.management': {
						templateUrl: "app/modules/management/externalorganization/externalorganization.html",
						controller: 'externalorganizationCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.management.externalorganization",
			config: {
				url: '/:orgUid/externalorganization/',
				views: {
					'mainContent@base.mobileHome' : {
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
