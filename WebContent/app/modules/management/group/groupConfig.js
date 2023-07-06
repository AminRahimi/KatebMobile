angular.module('groupModule').config(['$stateProvider', function($stateProvider) {
	var groupStates = [
		{
			state: "base.home.management.group",
			config: {
				url: '/:orgUid/group/',
				views: {
					'content@base.home.management': {
						templateUrl: "app/modules/management/group/group.html",
						controller: 'groupCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.management.group",
			config: {
				url: '/:orgUid/group/',
				views: {
					'mainContent@base.mobileHome' : {
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
