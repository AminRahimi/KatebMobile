angular.module('lettertemplateModule').config(['$stateProvider', function($stateProvider) {
	var lettertemplateStates = [
		{
			state: "home.management.lettertemplate",
			config: {
				url: '/:orgUid/lettertemplate/',
				views: {
					'content@home.management': {
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
