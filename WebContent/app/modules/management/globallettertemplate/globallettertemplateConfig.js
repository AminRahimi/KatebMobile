angular.module('globallettertemplateModule').config(['$stateProvider', function($stateProvider) {
	var globallettertemplateStates = [
		{
			state: "base.home.management.globallettertemplate",
			config: {
				url: '/globallettertemplate/',
				views: {
					'content@base.home.management': {
						templateUrl: "app/modules/management/globallettertemplate/globallettertemplate.html",
						controller: 'globallettertemplateCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.management.globallettertemplate",
			config: {
				url: '/globallettertemplate/',
				views: {
					'mainContent@base.mobileHome' : {
						templateUrl: "app/modules/management/globallettertemplate/globallettertemplate.html",
						controller: 'globallettertemplateCtrl'
					}
				}
			}
		}
	];
	globallettertemplateStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
