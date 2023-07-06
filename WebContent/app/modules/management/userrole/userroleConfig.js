angular.module('userroleModule').config(['$stateProvider', function($stateProvider) {
	var userroleStates = [
		{
			state: "home.management.userrole",
			config: {
				url: '/userrole/',
				views: {
					'content@home.management': {
						templateUrl: "app/modules/management/userrole/userrole.html",
						controller: 'userroleCtrl'
					}
				}
			}
		}
	];
	userroleStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
