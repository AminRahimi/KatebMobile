angular.module("vtFormManagement").directive('fileWidgetParam2', function($compile, $http) {
	return {
		restrict : 'EAC',
		// replace: true,
		templateUrl : 'app/lib/vtSchemaDirective/form-management/widgetDirectives/addProperty/fileWidgetParamTemplate.html',
		scope : {
			widget : "=",
			isMultiple : "=",
			widgetParams : "=",
			api : "="
		},
		controller : function($scope) {
			$scope.widgetParams = $scope.widgetParams || {};

			$scope.Data = {
				tmpAddingExt : "",
				listOfExt : function() {
					if ($scope.widgetParams.validExtensions) {
						return $scope.widgetParams.validExtensions.split(",");
					} else {
						return [];
					}
				}(),
				widgetParams : {
					sizeLimit : $scope.widgetParams.sizeLimit || 10048576
				}
			}

			// $scope.multiSelect = {
			// options : ($scope.widget == 'fileSelector') ?
			// $scope.Data.fileExts : $scope.Data.imgExts,
			// selectedFileFromMultiselect : function() {
			// if ($scope.widgetParams.validExtensions) {
			// var validExtensions =
			// $scope.widgetParams.validExtensions.split(",");
			// var tmpSelected = [];
			// angular.forEach(validExtensions, function(_ext) {
			// var foundExtObj = _.find($scope.Data.fileExts, function(fileExt)
			// {
			// return fileExt.label == _ext;
			// });
			// if (angular.isObject(foundExtObj)) {
			// tmpSelected.push(foundExtObj);
			// }
			// });
			//
			// return tmpSelected;
			// } else {
			// return [];
			// }
			//
			// }(),
			// selectedImgFromMultiselect : function() {
			// if ($scope.widgetParams.validExtensions) {
			// var validExtensions =
			// $scope.widgetParams.validExtensions.split(",");
			// var tmpSelected = [];
			// angular.forEach(validExtensions, function(_ext) {
			// var foundExtObj = _.find($scope.Data.imgExts, function(imgExts) {
			// return imgExts.label == _ext;
			// });
			// if (angular.isObject(foundExtObj)) {
			// tmpSelected.push(foundExtObj);
			// }
			// });
			//
			// return tmpSelected;
			// } else {
			// return [];
			// }
			//
			// }(),
			// multiSelectTranslate : {
			// buttonDefaultText : 'فیلتر بر اساس',
			// searchPlaceholder : 'جستجو',
			// checkAll : 'انتخاب همه',
			// uncheckAll : 'حذف همه',
			// dynamicButtonTextSuffix : 'مورد'
			// },
			// multiSelectSettings : {
			// externalIdProp : '',
			// displayProp : 'label',
			// enableSearch : false,
			// // scrollableHeight : '200px',
			// scrollable : false,
			// idProp : 'id',
			// showCheckAll : true,
			// showUncheckAll : true
			// },
			// multiSelectEvents : {
			// onItemSelect : function(fieldInfo) {
			// },
			// onItemDeselect : function(fieldInfo) {
			// }
			// }
			// }
			$scope.api = {
				getWidgetParams : function() {
					// if ($scope.widget == 'fileSelector') {
					// $scope.Data.widgetParams.validExtensions =
					// _.pluck($scope.multiSelect.selectedFileFromMultiselect,
					// 'label').join(",");
					// } else {
					// $scope.Data.widgetParams.validExtensions =
					// _.pluck($scope.multiSelect.selectedImgFromMultiselect,
					// 'label').join(",");
					// }

					$scope.Data.widgetParams.validExtensions = $scope.Data.listOfExt.join(",");

					return $scope.Data.widgetParams;
				}
			}

			$scope.Func = {
				onAddExtClick : function(addingExt) {
					$scope.Data.listOfExt.push(addingExt);
					$scope.Data.tmpAddingExt = "";
				},
				onDeleteExtClick : function(deletingExt, index) {
					$scope.Data.listOfExt.splice(index, 1);
				}
			}

		},
		link : function(scope, element, attrs, ctrls) {
		}
	};
});
