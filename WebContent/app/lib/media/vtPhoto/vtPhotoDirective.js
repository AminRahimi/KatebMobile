angular.module('vtPhoto', [ 'vtNgCropper' ]).directive('vtPhoto',function($timeout) {
	return {
		restrict : 'EA',
		template : "<div class='slideTheme'>"
					+	"<div class='upBtn' ng-show='isEditMode'>"
					+		"<button class='btn btn-default editbtn' ng-click='Func.onCancelClick()' ng-show='Data.showRemoveIcon'>"
					+			"<i class='flaticon-delete'></i>"
					+       "</button>"
					+		"<button class='btn btn-default viewbtn' ng-click='Func.onPhotoClick()' ng-show='templateMode && Data.showRemoveIcon '>"
					+			"<i class='fa fa-eye'></i>"
					+		"</button>"
					+		"<button class='btn btn-default closebtn' ng-click='Func.open()'>"
					+			"<i class='flaticon-pencil-on-a-notes-paper'></i>"
					+		"</button>"
					+	"</div>"
					+	"<img ng-src=\"{{'files/?mode=view&fcode='+ Data.ngModel.$viewValue.hash}}\" alt='' ng-if=\"!templateMode\"  ng-click=\"Func.onPhotoClick()\">"
					+ "</div>",
		scope : {
			ratio : "=",
			isEditMode : "=",
			noTitleDescription : "@",
			hasLargeSize: "=?",
			templateMode :"=?"
			
		},
		require : "ngModel",
		link : function(scope, element, attrs, ctrls) {
			scope.$watch(function() {
				return ctrls.$modelValue;
			},function(newValue) {
				$timeout(function() {
					scope.Data.showRemoveIcon = scope.Data.ngModel.$viewValue && scope.Data.ngModel.$viewValue.hash ? true : false;
				}, 1);
				scope.Data.ngModel = ctrls;
			});
		},
		controller : function($scope, $rootScope, $modal, $q) {
			$scope.hasLargeSize = $scope.hasLargeSize || false;
			$scope.templateMode = $scope.templateMode || false;
			$scope.Data = {
				showRemoveIcon : false,
				cropperCtrl : {},
				ngModel : ""
			};
			$scope.Func = {
				open : function() {
					var modalInstance = $modal.open({
						templateUrl : 'app/lib/media/vtPhoto/vtPhotoCropModal.html',
						controller : 'modalInstanceCtrl',
						resolve : {
							aspRatio : function() {
								return $scope.ratio;
							},
							picInfo : function() {
								return $scope.Data.ngModel.$viewValue;
							},
							noTitleDescription : function() {
								return $scope.noTitleDescription;
							}
						}
					});
					modalInstance.result.then(function(picture) {
						$scope.Data.ngModel.$setViewValue(picture);
					});
				},
				openModal: function () {
					console.log($scope.Data.ngModel.$viewValue.hash)
				},
				onCancelClick : function() {
					$scope.Data.ngModel.$setViewValue();
				},
				onPhotoClick: function () {
					if ($scope.hasLargeSize || $scope.templateMode) {
						var modalInstance = $modal.open({
							templateUrl: "app/lib/media/vtPhoto/showPicModal/showPicModal.html",
							controller: 'showPicModalCtrl',
							resolve: {
								photo: function () {
									return $scope.Data.ngModel;
								},
							}
						});
					}
				}
			};
			var Run = function(){
				$scope.Data.cropperCtrl.aspectRatio = $scope.ratio;
			};
			Run();
		}
	}
}).controller('modalInstanceCtrl',['$scope', '$modalInstance', '$document', 'Upload', '$timeout', '$q', 'aspRatio', 'picInfo', 'noTitleDescription',
       function($scope, $modalInstance, $document, Upload, $timeout, $q ,aspRatio, picInfo, noTitleDescription) {
			$scope.Data = {
				addPicButton : true,
				showCrop : true,
				cropperCtrl : {},
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
						$scope.Data.picInfo.hash = data[0].hash;
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
						}, 1)
					}
				}
			};
			var Run = function(){
				if ($scope.Data.picInfo.hash) {
					$scope.Data.addPicButton = false;
					$scope.Data.showCrop = true;
					$scope.Data.cropperCtrl.src = 'files/?mode=view&fcode=' + $scope.Data.picInfo.hash;
				} else {
					$scope.Data.addPicButton = true;
					$scope.Data.showCrop = false;
				}
				if (aspRatio) {
					$scope.Data.cropperCtrl.aspectRatio = aspRatio;
				}
			};
			Run();
	}])
	.controller('showPicModalCtrl', function ($scope, $modalInstance, photo) {
		$scope.photo = photo;
		$scope.Func = {
			onCloseClick: function () {
				$modalInstance.dismiss();
			}
		}

	});
