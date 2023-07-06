angular.module('schemaForm').filter('emptyValueLabelFilter', function() {
	return function(input, key, JSONSchemaProp) {
		if (!input) {
			if (JSONSchemaProp[key] && JSONSchemaProp[key].widgetParams) {
				return JSONSchemaProp[key].widgetParams.emptyValueLabel;
			} else {
				return "-"
			}
		} else if (angular.isObject(input)) {
			return input.displayString;
		} else {
			return input;
		}
	};
});
