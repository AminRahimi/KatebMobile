angular.module('userroleModule').config(['$stateProvider', function($stateProvider) {
	var userroleStates = [
		{
			state: "base.home.management.userrole",
			config: {
				url: '/userrole/',
				views: {
					'content@base.home.management': {
						templateUrl: "app/modules/management/userrole/userrole.html",
						controller: 'userroleCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.management.userrole",
			config: {
				url: '/userrole/',
				views: {
					'mainContent@base.mobileHome' : {
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
