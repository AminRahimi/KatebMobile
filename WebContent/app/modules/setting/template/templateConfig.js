angular.module('templateModule').config(['$stateProvider', function($stateProvider) {
	var templateStates = [
		{
			state: "base.home.setting.template",
			config: {
				url: '/template/',
				views: {
					'mainContent@home': {
						templateUrl: "app/modules/setting/template/template.html",
						controller: 'templateCtrl'
					}
				}
			}
		}
	];
	templateStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
