angular.module('vtDropdownMultiselect', []).directive("vtDropdownMultiselect", function() {
	return {
		restrict : 'AE',
		templateUrl : "app/lib/vtCartable/directives/vtCartableSearch/vtDropdownMultiselect/vtDropdownMultiselectTemplate.html",
		scope : {
			model : '=',
			options:'=',
			label:"@"
		},
		controller : function($scope, $rootScope) {

			$scope.model = $scope.model || [];

			$scope.Controller = {
				multiSelectorsController : {
					multiSelectTranslate : {
						buttonDefaultText : $scope.label,
						searchPlaceholder : 'جستجو',
						checkAll : 'انتخاب همه',
						uncheckAll : 'حذف همه',
						dynamicButtonTextSuffix : 'مورد'
					},
					multiSelectSettings : {
						externalIdProp : '',
						displayProp : 'title',
						enableSearch : false,
						scrollableHeight : '300px',
						scrollable : false,
						idProp : 'uid',
						showCheckAll : false,
						showUncheckAll : false,
						dynamicTitle: false
					}
				}
			}

		},
		link : function(scope, element, attrs, ctrls) {
		}
	};
});
