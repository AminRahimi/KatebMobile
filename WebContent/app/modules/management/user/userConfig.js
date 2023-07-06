angular.module('userModule').config(['$stateProvider', function($stateProvider) {
	var userStates = [
		{
			state: "base.home.management.user",
			config: {
				url: '/:orgUid/user/',
				views: {
					'content@base.home.management': {
						templateUrl: "app/modules/management/user/user.html",
						controller: 'userCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.management.user",
			config: {
				url: '/:orgUid/user/',
				views: {
					'mainContent@base.mobileHome' : {
						templateUrl: "app/modules/management/user/user.html",
						controller: 'userCtrl'
					}
				}
			}
		}
	];
	userStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
