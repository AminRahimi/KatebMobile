angular.module("vtFile", [ 'ngFileUpload' ]).factory('vtfileSrvc', function() {
	return {
		getFileURLForDownload : function(hash) {
			return 'files/?mode=download&fcode=' + hash;
		}
	}
}).directive('vtFile', function() {
	return {
		restrict : 'EAC',
		templateUrl : 'app/lib/vtSchemaDirective/components/fileSelector/fileTemplate.html',
		scope : {
			name : "@",
			isEditMode : "=",
			model : "=",
			required : "=",
			multiple : "="
		},
		controller : function($scope, Upload, vtfileSrvc, CM_CONFIG) {
			$scope.uploadFile = function(files) {
				if (files && files.length) {
					$scope.uploadingFile = {
						file : files[0],
						showUpload : true,
						progressPercentage : 0,
						upload : null
					};
					(function() {
						$scope.uploadingFile.upload = Upload.upload({
							url : CM_CONFIG.uploadUrl,
							data : {
								file : $scope.uploadingFile.file
							}
						}).then(function(resp) {
							// console.log('Success ' +
							// resp.config.data.file.name + 'uploaded. Response:
							// ' + resp.data);
							$scope.model = {
								photo_hash : angular.isArray(data) ? data[0] : data.hash,
								title : $scope.uploadingFile.file.name,
								description : ""
							};
						}, function(resp) {
							// console.log('Error status: ' + resp.status);
							$scope.model = null;
						}, function(evt) {
//							var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//							console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);

							_.defer(function() {
								$scope.$apply($scope.uploadingFile.progressPercentage = parseInt(100.0 * evt.loaded / evt.total));
							});

						});
					})();
				}
			}
			$scope.cancelUpload = function() {
				if ($scope.uploadingFile.upload) {
					$scope.model = null;
					$scope.uploadingFile.upload.abort();
				}
			}
			$scope.downloadFile = function() {
				linkDownload = $("<iframe style='display:none;'>", {
					id : 'idown',
					src : null
				}).hide().appendTo('body');
				if ($scope.model.photo_hash)
					linkDownload.attr('src', vtfileSrvc.getFileURLForDownload($scope.model.photo_hash));
			}
			$scope.deleteFile = function() {
				$scope.model = null;
			}
		},
		link : function(scope, element, attrs, ngModel) {
		}
	};
});
