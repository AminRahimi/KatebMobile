angular.module('katebModule', []);
angular.module('katebModule').factory('katebSrvc', function(Restangular, $modal, notificationHandlerConst, vtShowMessageSrvc) {

	return {
		downloadByLink: function(url, fileName){
			var link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            link.style = "visibility:hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
//          linkDownload = $("<iframe style='display:none;'>", {
//			id : 'idown',
//			src : url
//		}).hide().appendTo('body');

		},
		downloadWord: function (uid) {
			Restangular.one('letter/items/docx/'+uid).get();
		},
		resetLPAs: function(uid){
			Restangular.one('letter/reset_lpas/'+uid).get();
		},
		resetDataCache: function(uid){
			Restangular.one('letter/reset_cache/'+uid).get();
		},
		resetPdfCache: function(uid){
			Restangular.one('letter/reset_pdf/'+uid).get();
		},
		MultiselectTranslate: function(defaultText) {
			this.buttonDefaultText = defaultText;
			this.searchPlaceholder = 'جستجو';
			this.checkAll = 'انتخاب همه';
			this.uncheckAll = 'حذف همه';
			this.dynamicButtonTextSuffix = 'مورد انتخاب شده';
		},
		notificationModal: function (notification) {
			var modalInstance = $modal.open({
				templateUrl: 'app/modules/kateb/notificationModal/notificationModal.html',
				controller: 'notificationModalCtrl',
				resolve: {
					notification: function () {
					  return notification;
					}
				}
			});
			return modalInstance.result;
		},
		showNotification: function(notificationKey){
			 var notification = notificationHandlerConst()[notificationKey];
			 vtShowMessageSrvc.showMassage(notification.type, notification.title?notification.title:'', notification.message);
		},
		createArrayQueryParam : function (key, array) {
			var query = '?';
			angular.forEach(array, function (element) {
				query+= key+'='+ element + '&';
			});
			return query;
		},
		savePublicLetterTemplate: function (data, orgUID) {
			return Restangular.all('org/'+orgUID+'/incomming_letter_template/items').post(data);
		},
		getFileURL : function(id, query) {
			if (query) {
				return 'api/vira_bpms/process/diagram/instance/' + id + '?type=' + query + '&v=' + Date.parse(new Date());
			} else {
				return 'api/vira_bpms/process/diagram/instance/' + id + '?v=' + Date.parse(new Date());
			}
		},
		getUnreadMessagesCount: function () {
			return Restangular.one("message/received/unread/count").get();
		}
	}

}).factory('$debounce', ['$timeout','$q', function($timeout, $q) {
	return function debounce(func, wait, immediate) {
		var timeout;
		var deferred = $q.defer();
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if(!immediate) {
					deferred.resolve(func.apply(context, args));
					deferred = $q.defer();
				}
			};
			var callNow = immediate && !timeout;
			if ( timeout ) {
				$timeout.cancel(timeout);
			}
			timeout = $timeout(later, wait);
			if (callNow) {
				deferred.resolve(func.apply(context,args));
				deferred = $q.defer();
			}
			return deferred.promise;
		};
	}
}]);