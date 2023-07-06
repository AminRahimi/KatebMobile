angular.module('confermentModule').config(['$stateProvider', function($stateProvider) {
	var confermentStates = [
		{
			state: "base.home.setting.conferment",
			config: {
				url: '/conferment/',
				views: {
					'mainContent@home': {
						templateUrl: "app/modules/setting/conferment/conferment.html",
						controller: 'confermentCtrl'
					}
				}
			}
		}
	];
	confermentStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
