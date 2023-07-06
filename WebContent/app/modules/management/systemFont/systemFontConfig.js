angular.module('systemFontModule').config(['$stateProvider', function($stateProvider) {
	var publicsettingStates = [
		{
			state: "home.management.systemFont",
			config: {
				url: '/:orgUid/systemFont/',
				views: {
					'content@home.management': {
						templateUrl: "app/modules/management/systemFont/systemFont.html",
						controller: 'systemFontCtrl'
					}
				}
			}
		}
	];
	publicsettingStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
