angular.module('vtNotification').factory('vtNotificationSrvc', [ 'Restangular', function(Restangular) {

	return {
		getNotifications : function(start,len) {
			return Restangular.one('notif/items?start=' + start + '&len='+len).get();
		},
		notifReadList : function(json) {
			return Restangular.all("notif/read/mark_as_read").post({
				uids : json
			});
		},
		getMessagesCount : function() {
			return Restangular.one('message/total_count').get();
		},
		getNotificationsCount : function() {
			return Restangular.one('notif/unread/count').get();
		}
	}

} ]);