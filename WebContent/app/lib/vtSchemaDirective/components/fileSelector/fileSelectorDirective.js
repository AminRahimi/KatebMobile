angular.module("fileSelect", [ 'ngFileUpload' ]).directive('fileSelect', function($compile, $http, toaster,$filter) {
	return {
		restrict : 'EAC',
		// replace: true,
		require: '?ngModel',
		templateUrl : 'app/lib/vtSchemaDirective/components/fileSelector/fileSelectorTemplate.html',
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			api:"="
		},
		// h ['persianDatepicker', '?^ngModel'],
		controller : function($scope,$filter,$element, CM_CONFIG) {
			
			
			/*$scope.schema.typeParams = {
				sizeLimit : 3
			};*/
			
			
			
			
			$scope.removeFile = function(){
				$scope.model = null;
				$element.find('.file').next().find("input").val("");
			};
			$scope.onFileSelect = function(file) {
				
				$scope.imageSize = $scope.schema.typeParams && $scope.schema.typeParams.sizeLimit ? parseFloat($scope.schema.typeParams.sizeLimit)*1048576 : 10048576;
				$scope.sizeTitle = $scope.imageSize>=1048576 ? Math.round(parseFloat($scope.imageSize/1048576))+" MB " : parseFloat($scope.imageSize/1024)+" KB ";
				
				var validExtensions  = ($scope.schema.typeParams && $scope.schema.typeParams.validExtensions) ?  $scope.schema.typeParams.validExtensions : null;
				
				
				
				
				
				//check file types
				if(validExtensions){
					var fileType = file[0].name.substring(file[0].name.lastIndexOf('.') + 1);
					validExtensions= validExtensions.split(",");
					if (validExtensions.indexOf(fileType) == -1) {
						toaster.pop("error", "", "فرمت فایل انتخابی، پشتیبانی نمی‌شود");
						$element.find('.file').next().find("input").val($scope.model ? $scope.model.name :"");
						return false;
					}else{
					}
				}else{
				}
				
				
				if (file[0].size > $scope.imageSize) {
					toaster.pop("error", "", " حجم فایل بیش از مقدار "+ $filter('EnToFaNumber')($scope.sizeTitle)+" می‌باشد ...");
					$element.find('.file').next().find("input").val($scope.model ? $scope.model.name :"");
					return false
				}else{
				}
				
				var fd = new FormData();
				fd.append("file", file[0]);
				//FIXME
				// if (file[0].type.split("/")[0]=="image") {
				if (file.length > 1) {
					toaster.pop("error", "", "فقط می‌توانید یک فایل را انتخاب کنید ...");
					$element.find('.file').next().find("input").val($scope.model ? $scope.model.name :"");
					return false
					//$scope.setViewValueModel = false; 
				} else {
				} 
				
				$http.post(CM_CONFIG.uploadUrl, fd, {
					withCredentials : true,
					headers : {
						'Content-Type' : undefined
					},
					transformRequest : angular.identity
				}).success(function(response) {
					$scope.model = response[0];
				}).error(function() {
					toaster.pop('info', '', 'مشکلی در آپلود فایل بوجود آمده است');
				});

			};
			
			$scope.initFileStyle=function(){
				$($element).find(".file").filestyle({
					buttonText : ""
				});
			}
			$scope.getDownloadLink = function(file){
				return CM_CONFIG.baseUrl + file.downloadLink;
			}
			
			
//			$element.find('.remove').click(function() {
//				$element.find('.file').next().find("input").val("");
//			});
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
			scope.ngModel=ctrls;
			/*
			 * if (attrs.ngRequired) { scope.required = attrs.ngRequired;
			 * element.find("input").attr("ng-required", scope.required); }
			 * return $compile(element.contents())(scope);
			 */
		}
	};
});
