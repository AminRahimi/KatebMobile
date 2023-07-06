angular.module('indicatorbookModule').config(['$stateProvider', function($stateProvider) {
	var indicatorbookStates = [
		{
			state: "home.management.indicatorbook",
			config: {
				url: '/:orgUid/indicatorbook/',
				views: {
					'content@home.management': {
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
