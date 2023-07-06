angular.module('vtRangeRequired', []).directive('vtRangeRequired', function() {
	return {
		restrict : 'EA',
		require : 'ngModel',
		link : function(scope, elem, attr, ngModel) {
			scope.$watch(attr.downRange, function(value) {
				if (value && value > attr.upRange) {
					ngModel.$setValidity('vtRangeRequired', false);
					return parseInt(value);
				} else {
					ngModel.$setValidity('vtRangeRequired', true);
					return parseInt(value);
				}
			}, true);
			scope.$watch(attr.upRange, function(value) {
				if (value && value <= attr.downRange) {
					ngModel.$setValidity('vtRangeRequired', false);
					return parseInt(value);
				} else {
					ngModel.$setValidity('vtRangeRequired', true);
					return parseInt(value);
				}
			}, true);
		}
	}
});