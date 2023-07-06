angular.module('groupModule').config(['$stateProvider', function($stateProvider) {
	var groupStates = [
		{
			state: "home.management.group",
			config: {
				url: '/:orgUid/group/',
				views: {
					'content@home.management': {
						templateUrl: "app/modules/management/group/group.html",
						controller: 'groupCtrl'
					}
				}
			}
		}
	];
	groupStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
