angular.module("katebAttachView",[]).directive('katebAttachView', function() {
	return {
		restrict : 'EA',
		templateUrl : 'app/assets/js/directives/katebAttachView/attachView.html',
		scope : {
			attachment:"=",
			onRemove:"&",
			
			isEditMode:"=",
			attachmentLink:"@",
			attachmentType:"@"
		},
		controller : function($scope,fileSrvc) {
			$scope.downloadFile = function(){
				linkDownload = $("<iframe style='display:none;'>", {
					id : 'idown',
					src : null
				}).hide().appendTo('body');
				if ($scope.attachment.hash)
					linkDownload.attr('src', fileSrvc.getFileURLForDownload($scope.attachment.hash, $scope.attachment.name, $scope.attachment.id));
			}

			$scope.onRemoveAttachment = function(){
				if(_.isFunction($scope.onRemove)){
					$scope.onRemove({$attachment:$scope.attachment});
				}
			}
			

			
		},
		link : function(scope, element, attrs, ctrls) {
		}
	};
});
