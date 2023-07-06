angular.module('lettertemplateModule').config(['$stateProvider', function($stateProvider) {
	var lettertemplateStates = [
		{
			state: "base.home.management.lettertemplate",
			config: {
				url: '/:orgUid/lettertemplate/',
				views: {
					'content@base.home.management': {
						templateUrl: "app/modules/management/lettertemplate/lettertemplate.html",
						controller: 'lettertemplateCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.management.lettertemplate",
			config: {
				url: '/:orgUid/lettertemplate/',
				views: {
					'mainContent@base.mobileHome' : {
						templateUrl: "app/modules/management/lettertemplate/lettertemplate.html",
						controller: 'lettertemplateCtrl'
					}
				}
			}
		}
	];
	lettertemplateStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
