angular.module("imageSelect", [ 'ngFileUpload' ]).directive('imageSelect', function($compile, $http, toaster, $filter) {
	return {
		restrict : 'EAC',
		// replace: true,
		templateUrl : 'app/lib/vtSchemaDirective/components/imageSelector/imageSelectorTemplate.html',
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			api : "="
		},
		controller : function($scope, entitySrvc, $modal, $filter, $element, CM_CONFIG) {
			$scope.setViewValueModel = false;
			$scope.defaultPic = "assets/img/no-image.png";
			/*
			 * $scope.schema.typeParams = { sizeLimit : 3 };
			 */
			$scope.imageSize = $scope.schema.typeParams && $scope.schema.typeParams.sizeLimit ? parseFloat($scope.schema.typeParams.sizeLimit) * 1048576 : 10048576;
			$scope.sizeTitle = $scope.imageSize >= 1048576 ? Math.round(parseFloat($scope.imageSize / 1048576)) + " MB " : parseFloat($scope.imageSize / 1024) + " KB ";

			$scope.removeFile = function() {
				$scope.model = null;
			};
			$scope.reset = function() {
				$element.find('.file').next().find("input").val("");
			}

			$scope.onShowBigPicClick = function(isDefaultPic) {
				var modalInstance = $modal.open({
					templateUrl : 'app/lib/vtSchemaDirective/imageSelector/imageModalTemplate.html',
					controller : 'imageModalCtrl',
					size : 'lg',
					windowClass : "imageModalCnt",
					resolve : {
						image : function() {
							if (!isDefaultPic)
								return $scope.model;
							else
								return {
									downloadLink : $scope.defaultPic
								}
						},
						directiveElement : function() {
							return $scope.directiveElement;
						}
					}
				});
			};
			$scope.onFileSelect = function(file) {
				if (file) {

					$scope.imageSize = $scope.schema.typeParams && $scope.schema.typeParams.sizeLimit ? parseFloat($scope.schema.typeParams.sizeLimit) * 1048576 : 10048576;
					$scope.sizeTitle = $scope.imageSize >= 1048576 ? Math.round(parseFloat($scope.imageSize / 1048576)) + " MB " : parseFloat($scope.imageSize / 1024) + " KB ";

					var validExtensions = ($scope.schema.typeParams && $scope.schema.typeParams.validExtensions) ? $scope.schema.typeParams.validExtensions : "png,jpg,jpeg,bmp,gif,PNG,JPG,JPEG,BMP,GIF";

					// check file types
					if (validExtensions) {
						var fileType = file[0].name.substring(file[0].name.lastIndexOf('.') + 1);
						validExtensions = validExtensions.split(",");
						if (validExtensions.indexOf(fileType) == -1) {
							toaster.pop("error", "", "فرمت فایل انتخابی، پشتیبانی نمی‌شود");
							$element.find('.file').next().find("input").val($scope.model ? $scope.model.name :"");
							return false;
						}
					}

					if (file[0].size > $scope.imageSize) {
						toaster.pop("error", "", " حجم فایل بیش از مقدار " + $filter('EnToFaNumber')($scope.sizeTitle) + " می‌باشد ...");
						$element.find('.file').next().find("input").val($scope.model ? $scope.model.name :"");
						return false
					}

					$scope.setViewValueModel = true;
					$scope.setViewValueForm.setViewValueName.$setViewValue("test");
					if (file.length > 1) {
						toaster.pop("error", "", "فقط می‌توانید یک عکس را انتخاب کنید ...");
						$element.find('.file').next().find("input").val($scope.model ? $scope.model.name :"");
						// $scope.setViewValueModel = false;
					} else if (file[0].type.indexOf('image') == -1) {
						toaster.pop("error", "", "فایل مربوطه عکس نمی‌باشد ...");
						$element.find('.file').next().find("input").val($scope.model ? $scope.model.name :"");
						// $scope.setViewValueModel = false;
					} else if (file[0].size > $scope.imageSize) {
						toaster.pop("error", "", " حجم فایل بیش از مقدار " + $filter('EnToFaNumber')($scope.sizeTitle) + " می‌باشد ...");
						$element.find('.file').next().find("input").val($scope.model ? $scope.model.name :"");
						// $scope.setViewValueModel = false;
					} else {
						var fd = new FormData();
						fd.append("file", file[0]);
						$http.post(CM_CONFIG.uploadUrl, fd, {
							withCredentials : true,
							headers : {
								'Content-Type' : undefined
							},
							transformRequest : angular.identity
						}).success(function(response) {
							$scope.model = {
								name : file[0].name,
								hash : angular.isArray(response) ? response[0].hash : response.hash
							}
						}).error(function() {
							toaster.pop('info', '', 'مشکلی در آپلود فایل بوجود آمده است');
						});
					}
				}

			};
			$element.find(":file").filestyle({
				buttonText : ""
			});

			$element.find('.remove').click(function() {
				$element.find('.file').next().find("input").val("");
			});
			$scope.$watch('model', function(_new, _old) {
				if (_old != _new) {

					if (!!!_new) {
						$element.find('.file').next().find("input").val("");
					} else {
						$element.find('.file').next().find("input").val(_new.name);
					}
				}
			});

		},
		link : function(scope, element, attrs, ctrls) {
			scope.directiveElement = element;
		}
	};
});
