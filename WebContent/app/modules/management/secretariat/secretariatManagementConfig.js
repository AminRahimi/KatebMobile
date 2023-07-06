angular.module('secretariatManagementModule').config(['$stateProvider', function($stateProvider) {
	var secretariatStates = [
		{
			state: "home.management.secretariat",
			config: {
				url: '/:orgUid/secretariat/',
				views: {
					'content@home.management': {
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
