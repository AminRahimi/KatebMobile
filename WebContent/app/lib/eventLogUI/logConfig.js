angular.module('logModule').config(['$stateProvider', function($stateProvider) {
	var logStates = [
		// {
		// 	state : "home.event",
		// 	config : {
		// 		url : "/event",
		// 		views : {
		// 			'mainContent@home' : {
		// 				template : "",
		// 			}
		// 		}
		// 	}
		// },
		{
			state: "home.management.eventLog",
			config: {
				url: '/event_log',
				views: {
					'content@home.management': {
						templateUrl: "app/lib/eventLogUI/log.html",
						controller: 'logCtrl'
					}
				}
			}
		},
		{
			state: "home.management.objectLog",
			config: {
				url: '/object_log',
				views: {
					'content@home.management': {
						templateUrl: "app/lib/eventLogUI/objectLog.html",
						controller: 'objectLogCtrl'
					}
				}
			}
		}
	];
	logStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);