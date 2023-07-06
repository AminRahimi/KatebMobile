angular.module('HomeModule').config(['$stateProvider', function($stateProvider) {
	var HameStates = [

		{
			// base of mobile and desktop
			state : "base",
			config : {
				url : "",
				controller : 'baseCtrl',
				resolve : {
					/* @ngInject */
					currentUserConfig : function(configSrvc) {
						return configSrvc.getConfigAndConfigModules();
					}
				}
			}
		},
		{
			state : "base.iconsCheatSheet",
			config : {
				url : "/icons-cheat-sheet",
				templateUrl : "app/modules/home/iconsCheatSheet.html",
			}
		},
		{
			state : "base.snippetPlayground",
			config : {
				url : "/snippet-playground",
				templateUrl : "app/snippets/play-ground.html",
			}
		},
		{
			// desktop home
			state : "base.home",
			config : {
				url : "/d",
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
			state: "base.home.changePassword",
			config: {
				url: '/change_password',
				views: {
					'mainContent@home': {
						templateUrl: "app/modules/home/changePassword/changePassword.html",
						controller: 'changePasswordCtrl'
					}
				}
			}
		},{
			state: "base.mobileHome",
			config: {
				url: '/m',
				templateUrl: "app/modules/home/mobile.home.html",
				controller: 'mobileHomeCtrl'
			}
		}
	];
	HameStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);