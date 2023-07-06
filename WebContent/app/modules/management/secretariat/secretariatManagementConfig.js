angular.module('secretariatManagementModule').config(['$stateProvider', function($stateProvider) {
	var secretariatStates = [
		{
			state: "base.home.management.secretariat",
			config: {
				url: '/:orgUid/secretariat/',
				views: {
					'content@base.home.management': {
						templateUrl: "app/modules/management/secretariat/secretariatManagement.html",
						controller: 'secretariatManagementCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.management.secretariat",
			config: {
				url: '/:orgUid/secretariat/',
				views: {
					'mainContent@base.mobileHome' : {
						templateUrl: "app/modules/management/secretariat/secretariatManagement.html",
						controller: 'secretariatManagementCtrl'
					}
				}
			}
		}
	];
	secretariatStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
