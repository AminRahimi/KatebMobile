angular.module('messageModule').config(['$stateProvider', function($stateProvider) {
	var messageStates = [
	    {
	    	state: "base.home.message",
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
			state: "base.home.message.inbox",
			config: {
				url: '/inbox',
				views: {
					'messageContainer@base.home.message': {
						templateUrl: "app/modules/message/inbox/messageInbox.html",
						controller: 'messageInboxCtrl'
					}
				}
			}
		},{
			state: "base.home.message.send",
			config: {
				url: '/send',
				views: {
					'messageContainer@base.home.message': {
						templateUrl: "app/modules/message/send/messageSend.html",
						controller: 'messageSendCtrl'
					}
				}
			}
		},
		{
			state: "base.home.message.compose",
			config: {
				url: '/compose',
				views: {
					'messageContainer@base.home.message': {
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
