angular.module('tagModule').config(['$stateProvider', function($stateProvider) {
	var tagStates = [
		{
			state: "home.management.tag",
			config: {
				url: '/:orgUid/tag/',
				views: {
					'content@home.management': {
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
