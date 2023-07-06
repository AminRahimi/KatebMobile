angular.module('incomingLettertemplateModule').config(['$stateProvider', function($stateProvider) {
	var incomingLettertemplateStates = [
		{
			state: "home.management.incomingLettertemplate",
			config: {
				url: '/:orgUid/incomingLettertemplate/',
				views: {
					'content@home.management': {
						templateUrl: "app/modules/management/incomingLettertemplate/incomingLettertemplate.html",
						controller: 'incomingLettertemplateCtrl'
					}
				}
			}
		}
	];
	incomingLettertemplateStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
