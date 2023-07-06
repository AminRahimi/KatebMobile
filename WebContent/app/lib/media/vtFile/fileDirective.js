angular.module("vtFile", []).directive('vtFile', function() {
	return {
		restrict : 'EAC',
		templateUrl : 'app/lib/media/vtFile/fileTemplate.html',
		scope : {
			name: "@",
			isEditMode: "=",
			model: "=",
			required: "=",
			multiple: "=",
			type: "=",//string of supported type as comma separated
			callbackFn: "=",
			removeCallbackFn: "=",
			hideDownload: "="
		},
		controller : function($scope, Upload, $modal,fileSrvc) {
			var isTypeSupported = function(file){
				$scope.typeNotSupported = false;
				if($scope.type){
					//TODO check the type instead of end of name!
					fileType = file.name.split('.')[file.name.split('.').length -1];
					if($scope.type.split(',').indexOf(fileType) == -1){
						$scope.typeNotSupported = true;
						return false;
					}
				}
				return true;
			}
			
			$scope.uploadFile = function(files) {
				if (files && files.length) {
					if(!isTypeSupported(files[0]))
						return;
					
					$scope.uploadingFile = {
						file : files[0],
						showUpload : true,
						progressPercentage : 0,
						upload : null
					};
					(function() {
						$scope.uploadingFile.upload = Upload.upload({
							url : 'api/files/upload',
							file : $scope.uploadingFile.file
						}).progress(
							function(evt) {
								_.defer(function() {
									$scope.$apply($scope.uploadingFile.progressPercentage = parseInt(100.0 * evt.loaded / evt.total));
								});
						}).success(function(data, status, headers, config) {
							$scope.model = {
								hash : data[0].hash,
								name : $scope.uploadingFile.file.name,
							};
							if(_.isFunction($scope.callbackFn)){
								$scope.callbackFn($scope.model);
							}
						}).error(function(r) {
							$scope.model = null;
						});
					})();
				}
			}
			$scope.cancelUpload = function(){
				if ($scope.uploadingFile.upload) {
					$scope.model = null;
					$scope.uploadingFile.upload.abort();
				}
			}
			$scope.downloadFile = function(){
				linkDownload = $("<iframe style='display:none;'>", {
					id : 'idown',
					src : null
				}).hide().appendTo('body');
				if ($scope.model.hash)
					linkDownload.attr('src', fileSrvc.getFileURLForDownload($scope.model.hash, $scope.model.name, $scope.model.id));
			}
			$scope.deleteFile = function(){
				$scope.model = null;
				if(_.isFunction($scope.removeCallbackFn)){
					$scope.removeCallbackFn($scope.model);
				}
			}
		},
		link : function(scope, element, attrs, ctrls) {
		}
	};
});
