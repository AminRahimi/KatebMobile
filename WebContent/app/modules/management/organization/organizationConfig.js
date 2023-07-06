angular.module('organizationModule').config(['$stateProvider', function($stateProvider) {
	var organizationStates = [
		{
			state: "home.management.organization",
			config: {
				url: '/organization/',
				views: {
					'content@home.management': {
						templateUrl: "app/modules/management/organization/organization.html",
						controller: 'organizationCtrl'
					}
				}
			}
		}
	];
	organizationStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
