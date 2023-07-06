angular.module('incomingLettertemplateModule').config(['$stateProvider', function($stateProvider) {
	var incomingLettertemplateStates = [
		{
			state: "base.home.management.incomingLettertemplate",
			config: {
				url: '/:orgUid/incomingLettertemplate/',
				views: {
					'content@base.home.management': {
						templateUrl: "app/modules/management/incomingLettertemplate/incomingLettertemplate.html",
						controller: 'incomingLettertemplateCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.management.incomingLettertemplate",
			config: {
				url: '/:orgUid/incomingLettertemplate/',
				views: {
					'mainContent@base.mobileHome' : {
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
