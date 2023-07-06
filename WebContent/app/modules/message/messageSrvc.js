angular.module('messageModule').factory('messageSrvc', function(Restangular, $q, $rootScope) {
	return {
//******** Inbox ********//
		getInboxList: function (start, len) {
			return Restangular.all('message/received/items')
					.getList({start: start, len: len, extent: "full"});
		},
		searchInboxList: function (query, start, len) {
			return Restangular.all('message/received/items').customPOST(query, '',
					{start: start, len: len, extent: 'full'}, {'X-HTTP-Method-Override': 'GET'});
		},
		getSendList: function () {
			// return Restangular.one().get();
		},
		getRecievers: function () {
			return Restangular.all("org/" + $rootScope.currentUserOrg.uid + "/message/user/actives").getList().then(function (response) {
				response.data = Restangular.stripRestangular(response.data);
				return response;
			});
		},
		sendMessage: function (data) {
			return Restangular.all("message/send").post(data);
		},
		getOneMessage: function (uid) {
			return Restangular.one('message/received/items/' + uid).get();
		},
		getSendMessages: function (start, len) {
			return Restangular.all('message/sent/items').getList({start: start, len: len, extent: "full"});
		},
		getOneSendMessages: function (uid) {
			return Restangular.one('message/sent/items/' + uid).get();
		},
		searchSendMessageList: function (query, start, len) {
			return Restangular.all('message/sent/items').customPOST(query, '',
					{start: start, len: len, extent: 'full'}, {'X-HTTP-Method-Override': 'GET'});
		}
	}
});
