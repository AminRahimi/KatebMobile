angular.module('HomeModule').config(['$stateProvider', function($stateProvider) {
	var HameStates = [
		{
			state : "home",
			config : {
				url : "",
				templateUrl : "app/modules/home/home.html",
				controller : 'homeCtrl',
				 resolve : {
					 /* @ngInject */
				 	currentUserConfig : function(configSrvc) {
				 		return configSrvc.getConfigAndConfigModules();
				 	}
				 }
			}
		},
		{
			state: "home.changePassword",
			config: {
				url: '/change_password',
				views: {
					'mainContent@home': {
						templateUrl: "app/modules/home/changePassword/changePassword.html",
						controller: 'changePasswordCtrl'
					}
				}
			}
		}
	];
	HameStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);