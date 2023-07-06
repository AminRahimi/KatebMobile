angular.module('vtNotification', []).directive('vtNotification', function(vtNotificationSrvc,$interval,$state) {
	return {
		restrict : 'EA',
		templateUrl : 'app/lib/vtNotification/vtNotification.html',
		scope : {
			
		},
		controller : function($scope) {
			
			$scope.Data = {
				startList : 0,
				notificationsList : [],
				notifNumber: 10
			};
			
			$scope.Func = {
				getNotification : function(start) {
					// Get Notification Message
					$scope.isRequestInfoNotifications = true;
					vtNotificationSrvc.getNotifications(start,10).then(function(response) {
						$scope.Data.notifications = response.data;
						$scope.Data.notificationsList=$scope.Data.notificationsList.concat($scope.Data.notifications);
						$scope.readNotifList = _.map(response.data, 'uid');
						vtNotificationSrvc.notifReadList($scope.readNotifList).then(function() {
							// Get Notification Count
							$scope.Func.getNotificationsCount();
						});
						$scope.Data.notifNumber = 10;
						$scope.isRequestInfoNotifications = false;
					});
				},
				getMoreNotification : function(){
					vtNotificationSrvc.getNotifications($scope.Data.notifNumber,10).then(function(response) {
						$scope.Data.notificationsList=$scope.Data.notificationsList.concat(response.data);
						$scope.Data.notifNumber += 10;
						$scope.readNotifList = _.map(response.data, 'uid');
						vtNotificationSrvc.notifReadList($scope.readNotifList).then(function() {
							// Get Notification Count
							$scope.Func.getNotificationsCount();
						});
					});
				},
				getNotificationsCount : function(){
					vtNotificationSrvc.getNotificationsCount().then(function(response) {
						$scope.Data.notificationsCount = response.data.originalElement;
					});
				},
				showNotification : function(){
					$scope.Func.getNotification($scope.Data.startList);
				},
				notificationLink : function(item){
					if(item!=null){
						$state.go(item)
					}
				},
				loadMore : function() {
					 if($scope.isRequestInfoNotifications==false && $scope.Data.notificationsList.length >= (($scope.Data.startList+1) *10)){
						$scope.Func.getNotification(($scope.Data.startList+1) *10);
						 $scope.Data.startList++;
					  }
				}
				
			}
			$scope.Func.getNotificationsCount()
			$interval($scope.Func.getNotificationsCount, 60*60*1000);
			
			
			
			
			
			$("#notificationLink").click(function() {
				$("#notificationContainer").fadeToggle(300);
				$scope.Data.notificationsList = [];
				$scope.Data.startList = 0;
				return false;
			});

			// Document Click hiding the popup
			$(document).click(function() {
				$("#notificationsBody").scrollTop(0)
				$("#notificationContainer").hide();
				$scope.Data.notificationsList = [];
				$scope.Data.startList = 0;
			});

			// Popup on click
			$("#notificationContainer").click(function() {
				return false;
			});


		}
	}
});