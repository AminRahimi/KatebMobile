angular.module('publicsettingModule').config(['$stateProvider', function($stateProvider) {
	var publicsettingStates = [
		{
			state: "base.home.management.publicsetting",
			config: {
				url: '/:orgUid/publicsetting/',
				views: {
					'content@base.home.management': {
						templateUrl: "app/modules/management/publicsetting/publicsetting.html",
						controller: 'publicsettingCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.management.publicsetting",
			config: {
				url: '/:orgUid/publicsetting/',
				views: {
					'mainContent@base.mobileHome' : {
						templateUrl: "app/modules/management/publicsetting/publicsetting.html",
						controller: 'publicsettingCtrl'
					}
				}
			}
		}
	];
	publicsettingStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
