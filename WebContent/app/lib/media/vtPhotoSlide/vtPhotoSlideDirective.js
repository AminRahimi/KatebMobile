angular.module('vtPhotoSlide', [ 'vtNgCropper' ]).directive('vtPhotoSlide' ,function($timeout) {
	return {
		restrict : 'EA',
        templateUrl : 'app/lib/media/vtPhotoSlide/vtPhotoSlideTemplate.html',
		scope : {
			ratio: "=",
			isEditMode : "=",
			hashObjectName : "=",
			noTitleDescription : "@"
		},
		require : "ngModel",
		link : function(scope, element, attrs, ctrls) {
			scope.$watch(function() {
				return ctrls.$modelValue;
			},function(newValue) {
				$timeout(function() {
					if(scope.hashObjectName) {
						scope.Data.showRemoveIcon = scope.Data.ngModel.$viewValue && scope.Data.ngModel.$viewValue[scope.hashObjectName] ? true : false;
                    } else {
                        scope.Data.showRemoveIcon = scope.Data.ngModel.$viewValue && scope.Data.ngModel.$viewValue ? true : false;
					}
				}, 1);
				scope.Data.ngModel = ctrls;
			});
		},
		controller : function($scope, $rootScope, $modal, $q) {
			$scope.Data = {
				showRemoveIcon : false,
                addPicButton : true,
                showCrop : true,
				cropperCtrl : {
                    file: {}
				},
                picInfo : {},
				ngModel : ""
			};
			$scope.Func = {
				open : function(cropperCtrl) {
					var modalInstance = $modal.open({
						templateUrl : 'app/lib/media/vtPhotoSlide/vtPhotoSlideCropModal.html',
						controller : 'vtPhotoSlideCropModal',
						resolve : {
							aspRatio : function() {
								return $scope.ratio;
							},
                            hashObjectName : function() {
                                return $scope.hashObjectName;
                            },
							picInfo : function() {
                                return $scope.Data.ngModel.$viewValue;
							},
							noTitleDescription : function() {
								return $scope.noTitleDescription;
							},
                            cropperCtrl : function () {
								return cropperCtrl;
                            }
						}
					});
					modalInstance.result.then(function(picture) {
						$scope.Data.ngModel.$setViewValue(picture);
					});
				},
				onCancelClick : function() {
					$scope.Data.ngModel.$setViewValue();
				},
                onFileSelect : function(files) {
                    if (files && files.length > 0) {
                        var reader = new FileReader();
                        reader.readAsDataURL(files[0]);
                        $scope.Data.showCrop = false;
                        $scope.Data.addPicButton = false;
                        $timeout(function() {
                            $scope.Data.cropperCtrl.file = files[0];
                            $scope.Func.open($scope.Data.cropperCtrl);
                            $scope.Data.showCrop = true;
                        }, 1);
                    }
                }
			};
			var Run = function(){
				if($scope.hashObjectName) {
                    if ($scope.Data.picInfo[$scope.hashObjectName]) {
                        $scope.Data.addPicButton = false;
                        $scope.Data.showCrop = true;
                        $scope.Data.cropperCtrl.src = 'files/?mode=view&fcode=' + $scope.Data.picInfo[$scope.hashObjectName];
                    } else {
                        $scope.Data.addPicButton = true;
                        $scope.Data.showCrop = false;
                    }
                } else {
                    if (!_.isEmpty($scope.Data.picInfo)) {
                        $scope.Data.addPicButton = false;
                        $scope.Data.showCrop = true;
                        $scope.Data.cropperCtrl.src = 'files/?mode=view&fcode=' + $scope.Data.picInfo;
                    } else {
                        $scope.Data.addPicButton = true;
                        $scope.Data.showCrop = false;
                    }
				}
                if ($scope.ratio) {
                    $scope.Data.cropperCtrl.aspectRatio = $scope.ratio;
                }
                if ($scope.hashObjectName) {
                    $scope.Data.cropperCtrl.hashObjectName = $scope.hashObjectName;
                }
				/*$scope.Data.cropperCtrl.aspectRatio = $scope.ratio;*/
			};
			Run();
		}
	}
}).controller('vtPhotoSlideCropModal',['$scope', '$modalInstance', '$document', 'Upload', '$timeout', '$q', 'aspRatio', 'hashObjectName', 'picInfo', 'noTitleDescription', 'cropperCtrl',
       function($scope, $modalInstance, $document, Upload, $timeout, $q ,aspRatio, hashObjectName, picInfo, noTitleDescription, cropperCtrl) {
			$scope.hashObjectName = hashObjectName;
			$scope.Data = {
				addPicButton : true,
				showCrop : true,
				cropperCtrl : cropperCtrl,
				picInfo : picInfo ? angular.copy(picInfo) : {},
				noTitleDescription : noTitleDescription 
			};
			$scope.Func = {
				upload : function(file) {
					var defer = $q.defer();
					Upload.upload({
						url : 'api/files/upload',
						file : file
					}).success(function(data, status, headers, config) {
						defer.resolve(data);
					});
					return defer.promise;
				},
				cancel : function() {
					$modalInstance.dismiss();
				},
				submit : function() {
					$scope.Func.upload($scope.Data.cropperCtrl.getImage()).then(function(data) {
						if($scope.hashObjectName) {
                            $scope.Data.picInfo[$scope.hashObjectName] = data[0].hash;
                        } else {
                            $scope.Data.picInfo = data[0].hash;
						}
						$modalInstance.close($scope.Data.picInfo);
					});
				},
				onFileSelect : function(files) {
                    if (files && files.length > 0) {
						var reader = new FileReader();
						reader.readAsDataURL(files[0]);
						$scope.Data.showCrop = false;
						$scope.Data.addPicButton = false;
						$timeout(function() {
							$scope.Data.cropperCtrl.file = files[0];
							$scope.Data.showCrop = true;
						}, 1);
					}
				}
			};
			var Run = function(){
                if($scope.hashObjectName) {
                    if ($scope.Data.picInfo[$scope.hashObjectName]) {
                        $scope.Data.addPicButton = false;
                        $scope.Data.showCrop = true;
                        $scope.Data.cropperCtrl.src = 'files/?mode=view&fcode=' + $scope.Data.picInfo[$scope.hashObjectName];
                    } else {
                        $scope.Data.addPicButton = true;
                        $scope.Data.showCrop = false;
                    }
                } else {
                    if (!_.isEmpty($scope.Data.picInfo)) {
                        $scope.Data.addPicButton = false;
                        $scope.Data.showCrop = true;
                        $scope.Data.cropperCtrl.src = 'files/?mode=view&fcode=' + $scope.Data.picInfo;
                    } else {
                        $scope.Data.addPicButton = true;
                        $scope.Data.showCrop = false;
                    }
				}
				if (aspRatio) {
					$scope.Data.cropperCtrl.aspectRatio = aspRatio;
				}
				if (hashObjectName) {
					$scope.Data.cropperCtrl.hashObjectName = hashObjectName;
				}
			};
			Run();
	}]);
