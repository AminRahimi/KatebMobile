angular.module('organizationModule').config(['$stateProvider', function($stateProvider) {
	var organizationStates = [
		{
			state: "base.home.management.organization",
			config: {
				url: '/organization/',
				views: {
					'content@base.home.management': {
						templateUrl: "app/modules/management/organization/organization.html",
						controller: 'organizationCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.management.organization",
			config: {
				url: '/organization/',
				views: {
					'mainContent@base.mobileHome' : {
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
