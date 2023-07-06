angular.module('privategroupModule').config(['$stateProvider', function($stateProvider) {
	var groupStates = [
		{
			state: "home.setting.group",
			config: {
				url: '/group/',
				views: {
					'mainContent@home': {
						templateUrl: "app/modules/setting/group/privategroup.html",
						controller: 'privategroupCtrl'
					}
				}
			}
		}
	];
	groupStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
