angular.module('ruleModule').config(['$stateProvider', function($stateProvider) {
	var ruleStates = [
		{
			state: "base.home.management.rule",
			config: {
				url: '/:orgUid/rule',
				views: {
					'content@base.home.management': {
						templateUrl: "app/modules/management/rule/rule.html",
						controller: 'ruleCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.management.rule",
			config: {
				url: '/:orgUid/rule',
				views: {
					'mainContent@base.mobileHome' : {
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
