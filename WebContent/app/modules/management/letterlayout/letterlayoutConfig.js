angular.module('letterlayoutModule').config(['$stateProvider', function($stateProvider) {
	var letterlayoutStates = [
		{
			state: "base.home.management.letterlayout",
			config: {
				url: '/:orgUid/letterlayout/',
				views: {
					'content@base.home.management': {
						templateUrl: "app/modules/management/letterlayout/letterlayout.html",
						controller: 'letterlayoutCtrl'
					}
				}
			}
		}
	];
	letterlayoutStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
