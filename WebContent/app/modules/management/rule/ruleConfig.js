angular.module('ruleModule').config(['$stateProvider', function($stateProvider) {
	var ruleStates = [
		{
			state: "home.management.rule",
			config: {
				url: '/:orgUid/rule',
				views: {
					'content@home.management': {
						templateUrl: "app/modules/management/rule/rule.html",
						controller: 'ruleCtrl'
					}
				}
			}
		}
	];
	ruleStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
