angular.module('messageModule').config(['$stateProvider', function($stateProvider) {
	var messageStates = [
	    {
	    	state: "home.message",
	    	config : {
				url : "/message",
				views: {
					'mainContent@home': {
						templateUrl: "app/modules/message/message.html",
						controller: 'messageCtrl'
					}
				}
			}
	    },{
			state: "home.message.inbox",
			config: {
				url: '/inbox',
				views: {
					'messageContainer@home.message': {
						templateUrl: "app/modules/message/inbox/messageInbox.html",
						controller: 'messageInboxCtrl'
					}
				}
			}
		},{
			state: "home.message.send",
			config: {
				url: '/send',
				views: {
					'messageContainer@home.message': {
						templateUrl: "app/modules/message/send/messageSend.html",
						controller: 'messageSendCtrl'
					}
				}
			}
		},
		{
			state: "home.message.compose",
			config: {
				url: '/compose',
				views: {
					'messageContainer@home.message': {
						templateUrl: "app/modules/message/compose/messageCompose.html",
						controller: 'messageComposeCtrl'
					}
				}
			}
		}
	];
	messageStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});

}]);
