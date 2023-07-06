angular.module('vtNumberValidator', []).directive('vtNumberValidator', function() {
	return {
		restrict : 'EA',
		require : 'ngModel',
		link : function(scope, elem, attr, ngModel) {
			ngModel.$parsers.unshift(function(value) {
				var ret = "";
				symbolMap = {
					'۱' : '1',
					'۲' : '2',
					'۳' : '3',
					'۴' : '4',
					'۵' : '5',
					'۶' : '6',
					'۷' : '7',
					'۸' : '8',
					'۹' : '9',
					'۰' : '0',
				};
				value = value.toString();
				for (var i = 0; i < value.length; i++)
					if (symbolMap[value[i]])
						ret += symbolMap[value[i]];
					else
						ret += value[i];
				if (!isNaN(ret) || ret == '' || ret == null || ret == undefined) {
					ngModel.$setValidity('vtNumberValidator', true);
				} else {
					ngModel.$setValidity('vtNumberValidator', false);
				}
				return ret;
			});
		}
	}
});