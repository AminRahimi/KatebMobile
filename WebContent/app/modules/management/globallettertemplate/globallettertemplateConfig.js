angular.module('globallettertemplateModule').config(['$stateProvider', function($stateProvider) {
	var globallettertemplateStates = [
		{
			state: "home.management.globallettertemplate",
			config: {
				url: '/globallettertemplate/',
				views: {
					'content@home.management': {
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
