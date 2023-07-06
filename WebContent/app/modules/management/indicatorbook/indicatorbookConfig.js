angular.module('indicatorbookModule').config(['$stateProvider', function($stateProvider) {
	var indicatorbookStates = [
		{
			state: "base.home.management.indicatorbook",
			config: {
				url: '/:orgUid/indicatorbook/',
				views: {
					'content@base.home.management': {
						templateUrl: "app/modules/management/indicatorbook/indicatorbook.html",
						controller: 'indicatorbookCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.management.indicatorbook",
			config: {
				url: '/:orgUid/indicatorbook/',
				views: {
					'mainContent@base.mobileHome' : {
						templateUrl: "app/modules/management/indicatorbook/indicatorbook.html",
						controller: 'indicatorbookCtrl'
					}
				}
			}
		}
	];
	indicatorbookStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
