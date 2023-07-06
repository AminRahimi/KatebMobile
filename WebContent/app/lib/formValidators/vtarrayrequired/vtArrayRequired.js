angular.module('vtArrayRequired', []).directive('vtArrayRequired', function() {
	return {
		restrict : 'EA',
		require : 'ngModel',
		link : function(scope, elem, attr, ngModel) {
			scope.$watch(attr.ngModel, function(value) {
				if (value && value.length > 0) {
					ngModel.$setValidity('vtArrayRequired', true);
					return value;
				} else {
					ngModel.$setValidity('vtArrayRequired', false);
					return value;
				}
			}, true);
		}
	}
});