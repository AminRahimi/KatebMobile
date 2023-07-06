angular.module('tagModule').config(['$stateProvider', function($stateProvider) {
	var tagStates = [
		{
			state: "base.home.management.tag",
			config: {
				url: '/:orgUid/tag/',
				views: {
					'content@base.home.management': {
						templateUrl: "app/modules/management/tag/tag.html",
						controller: 'tagCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.management.tag",
			config: {
				url: '/:orgUid/tag/',
				views: {
					'mainContent@base.mobileHome' : {
						templateUrl: "app/modules/management/tag/tag.html",
						controller: 'tagCtrl'
					}
				}
			}
		}
	];
	tagStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
