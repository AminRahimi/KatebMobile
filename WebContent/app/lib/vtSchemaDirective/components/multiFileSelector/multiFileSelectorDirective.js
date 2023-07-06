angular.module("multiFileSelect", [ 'ngFileUpload' ]).directive('multiFileSelect', function($compile, $http, toaster) {
	return {
		restrict : 'EAC',
		// replace: true,
		require: '?ngModel',
		templateUrl : 'app/lib/vtSchemaDirective/components/multiFileSelector/multiFileSelectorTemplate.html',
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			api : "="
		},
		// h ['persianDatepicker', '?^ngModel'],
		controller : function($scope, $filter, $element, CM_CONFIG) {
			$scope.onFileSelect = function(file) {
				if (file) {
					$scope.imageSize = $scope.schema.typeParams && $scope.schema.typeParams.sizeLimit ? parseFloat($scope.schema.typeParams.sizeLimit) * 1048576 : 10048576;
					$scope.sizeTitle = $scope.imageSize >= 1048576 ? Math.round(parseFloat($scope.imageSize / 1048576)) + " MB " : parseFloat($scope.imageSize / 1024) + " KB ";

					var validExtensions = ($scope.schema.typeParams && $scope.schema.typeParams.validExtensions) ? $scope.schema.typeParams.validExtensions : null;

					// check file types
					if (validExtensions) {
						var tmpIsValid = true;
						validExtensions = validExtensions.split(",");
						angular.forEach(file, function(_fle) {
							var fileType = _fle.name.substring(_fle.name.lastIndexOf('.') + 1);
							if (validExtensions.indexOf(fileType) == -1) {

								tmpIsValid = false;

							}

						});
						if (!tmpIsValid) {
							toaster.pop("error", "", "فرمت فایل انتخابی، پشتیبانی نمی‌شود");
							$element.find("input").val("");
							return false;
						}else{
						}
					}else{
					}

					var tmpSum = 0;
					angular.forEach(file, function(_fle) {
						tmpSum += _fle.size;
					});

					if (tmpSum > $scope.imageSize) {
						toaster.pop("error", "", " حجم فایل ها بیش از مقدار " + $filter('EnToFaNumber')($scope.sizeTitle) + " می‌باشد ...");
						$element.find("input").val("");
						return false
					}else{
					}

					if(!$scope.model)
						$scope.model = [];
					for (var index = 0; index < file.length; index++) {
						var fd = new FormData();
						fd.append("file", file[index]);
						// FIXME
						// if (file[0].type.split("/")[0]=="image") {
						if (true) {
							(function(_file) {
								$http.post(CM_CONFIG.uploadUrl, fd, {
									withCredentials : true,
									headers : {
										'Content-Type' : undefined
									},
									transformRequest : angular.identity
								}).success(function(response) {
									if(response){
										response.forEach(function(file){
											$scope.model.push(file);
										})
									}
								}).error(function() {
									toaster.pop('info', '', 'مشکلی در آپلود فایل بوجود آمده است');
								});
							}(file[index]))
						} else {
							toaster.pop("error", "", "فایل مربوطه عکس نمی‌باشد...");
						}

					}
				}

			};
			$scope.removeFile = function(file) {
				$scope.model.splice($scope.model.indexOf(file), 1);
			};
			$scope.getDownloadLink = function(file){
				return CM_CONFIG.baseUrl + file.downloadLink;
			}
			$element.find(":file").filestyle({
				buttonText : ""
			});
		},
		link : function(scope, element, attrs, ctrls) {
			
			scope.ngModel=ctrls;
			/*
			 * if (attrs.ngRequired) { scope.required = attrs.ngRequired;
			 * element.find("input").attr("ng-required", scope.required); }
			 * return $compile(element.contents())(scope);
			 */
		}
	};
});
