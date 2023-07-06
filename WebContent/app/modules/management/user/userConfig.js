angular.module('userModule').config(['$stateProvider', function($stateProvider) {
	var userStates = [
		{
			state: "home.management.user",
			config: {
				url: '/:orgUid/user/',
				views: {
					'content@home.management': {
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
