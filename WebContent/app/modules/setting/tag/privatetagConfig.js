angular.module('privatetagModule').config(['$stateProvider', function($stateProvider) {
	var tagStates = [
		{
			state: "home.setting.tag",
			config: {
				url: '/tag/',
				views: {
					'mainContent@home': {
						templateUrl: "app/modules/setting/tag/privatetag.html",
						controller: 'privatetagCtrl'
					}
				}
			}
		}
	];
	tagStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
