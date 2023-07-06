angular.module("attachFileSingle", [ 'ngFileUpload' ]).directive('attachFileSingle', function($compile, $http, toaster) {
	return {
		restrict : 'EAC',
		// replace: true,
		require: '?ngModel',
		templateUrl : "app/lib/vtSchemaDirective/components/attachFileSingle/attachFileSingleTemplate.html",
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			api:"="
		},
		controller : function($scope, entitySrvc, $filter,$element, CM_CONFIG) {
			/*
			 * $scope.schema.typeParams = { sizeLimit : 3 };
			 */
			$scope.api?$scope.api:$scope.api={};
			$scope.api.reset=function(){
				$scope.reset();
			}
			$scope.imageSize = $scope.schema.typeParams && $scope.schema.typeParams.sizeLimit ? parseFloat($scope.schema.typeParams.sizeLimit) * 1048576 : 10048576;
			$scope.sizeTitle = $scope.imageSize >= 1048576 ? Math.round(parseFloat($scope.imageSize / 1048576)) + " MB " : parseFloat($scope.imageSize / 1024) + " KB ";

			$scope.setvalueModel = false;
			$scope.reset = function() {
				$scope.fileNotFound = false;
				$scope.textNotFound = false;
				$scope.tempFile = {};
				$scope.tempTxt = "";
				$element.find(".file1").parent().find("input")[1].value = "";
			};
			$scope.onAddNewAttachClick = function() {
				$scope.fileNotFound = false;
				$scope.textNotFound = false;
				if (!$scope.tempFile.hash) {
					$scope.fileNotFound = true;
				} else if (!$scope.tempTxt) {
					$scope.textNotFound = true;
				} else {
					if (!$scope.model)
						$scope.model = [];
					$scope.model.push({
						title : $scope.tempTxt,
						file : $scope.tempFile
					});
					$scope.reset();
				}
			};

			$scope.removeAttach = function(inp) {
				$scope.model.splice($scope.model.indexOf(inp), 1);
			};

			$scope.onFileSelect = function(file, modelElement) {
				if (file) {

					$scope.imageSize = $scope.schema.typeParams && $scope.schema.typeParams.sizeLimit ? parseFloat($scope.schema.typeParams.sizeLimit) * 1048576 : 10048576;
					$scope.sizeTitle = $scope.imageSize >= 1048576 ? Math.round(parseFloat($scope.imageSize / 1048576)) + " MB " : parseFloat($scope.imageSize / 1024) + " KB ";

					var validExtensions = ($scope.schema.typeParams && $scope.schema.typeParams.validExtensions) ? $scope.schema.typeParams.validExtensions : null;

					// check file types
					if (validExtensions) {
						var fileType = file[0].name.substring(file[0].name.lastIndexOf('.') + 1);
						validExtensions = validExtensions.split(",");
						if (validExtensions.indexOf(fileType) == -1) {
							toaster.pop("error", "", "فرمت فایل انتخابی، پشتیبانی نمی‌شود");
							$element.find(".file1").parent().find("input")[1].value = "";
							return false;
						}else{
						}
					}else{
					}
					
					if (file.length > 1) {
						toaster.pop("error", "", "فقط می‌توانید یک فایل هر بار را انتخاب کنید ...");
						$element.find(".file1").parent().find("input")[1].value = "";
						return false
					}else{
					}

					 if (file[0].size > $scope.imageSize) {
						toaster.pop("error", "", " حجم فایل بیش از مقدار " + $filter('EnToFaNumber')($scope.sizeTitle) + " می‌باشد ...");
						$element.find(".file1").parent().find("input")[1].value = "";
						return false
					} else {
					}

						$scope.setvalueModel = true;
						$scope.setvalueForm.upload.$setViewValue("test");
						var fd = new FormData();
						fd.append("file", file[0]);
						$http.post(CM_CONFIG.uploadUrl, fd, {
							withCredentials : true,
							headers : {
								'Content-Type' : undefined
							},
							transformRequest : angular.identity

						}).success(function(response) {
							$scope.tempFile = {
								name : file[0].name,
								hash : angular.isArray(response) ? response[0].hash : response.hash
							}
							if(!$scope.model){
								$scope.model={};
							}
							$scope.model.file = $scope.tempFile;
							$scope.model.title = $scope.tempTxt;
						}).error(function() {
							toaster.pop('info', '', 'مشکلی در آپلود فایل بوجود آمده است');
						});
				}


			}
			$scope.reset();
		},
		link : function(scope, element, attrs, ctrls) {
			scope.ngModel=ctrls;
		}
	};
});
