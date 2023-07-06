angular.module('vtDropdownMultiStringModule', []).directive('vtDropdownMultiString', function() {
	return {
		restrict: 'EA',
		templateUrl: 'app/lib/vtCartable/directives/vtCartableSearch/vtDropdownMultiString/vtDropdownMultiStringTemplate.html',
		scope: {
			model: "=",
			label: "="
		},
		controller: function($scope) {

			if(!$scope.model)
				$scope.model = [];

			$scope.add = function(input){
				if(!$scope.model)
					$scope.model = [];

				if (input && !$scope.checkDuplicate(input)) {
					$scope.model.push(input);
				}
				$scope.input = "";
			}

			$scope.checkDuplicate = function (input) {
				var flag = false;
				angular.forEach($scope.model, function (item) {
					if (item == input) {
						flag = true;
					}
				});
				return flag;
			}

			$scope.remove = function(index){
				$scope.model.splice(index, 1);
			}
		}
}});
