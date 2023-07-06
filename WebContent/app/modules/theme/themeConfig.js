angular.module('themeModule').config(['$stateProvider', function($stateProvider) {
	var userStates = [
		{
			state: "base.home.theme",
			config: {
				url: '/theme',
				views: {
					'mainContent@home': {
						templateUrl: "app/modules/theme/theme.html",
						controller: 'themeCtrl'
					}
				}
			}
		}
	];
	userStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
