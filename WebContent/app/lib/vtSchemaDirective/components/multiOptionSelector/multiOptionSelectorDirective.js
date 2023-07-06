angular.module("multiOptionSelect", []).factory('multiOptionSelect_baseSelectSrvc', [ 'Restangular', function(Restangular) {
	return {
		getBaseSelectorList : function() {
			return Restangular.all('enum_type/items').getList();
		}
	};
} ]).directive('multiOptionSelect', function() {
	return {
		restrict : 'EAC',
		// replace: true,
		templateUrl : 'app/lib/vtSchemaDirective/components/multiOptionSelector/multiOptionSelectorTemplate.html',
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			api : "="
		},
		controller : function($scope, multiOptionSelect_baseSelectSrvc, $element) {
			$scope.api ? $scope.api : $scope.api = {};
			$scope.Data = {
				selected : []
			}

			$scope.getBaseSelector = function() {
				$scope.options = {};
				multiOptionSelect_baseSelectSrvc.getBaseSelectorList().then(function(response) {
					for (var index = 0; index < response.data.length; index++) {
						$scope.options[response.data[index].key] = response.data[index].members;
					}
					$scope.initialSelected();
				});
			};

			$scope.onSelect = function() {
				$scope.model = [];
				for (var int = 0; int < $scope.Data.selected.length; int++) {
					if ($scope.Data.selected[int])
						$scope.model.push($scope.options[$scope.schema.typeParams.enumType][int])
				}
			};

			$scope.initialSelected = function() {
				if ($scope.options[$scope.schema.typeParams.enumType] && $scope.model) {
					for (var jnt = 0; jnt < $scope.model.length; jnt++) {
						for (var int = 0; int < $scope.options[$scope.schema.typeParams.enumType].length; int++) {
							if ($scope.model[jnt].key == $scope.options[$scope.schema.typeParams.enumType][int].key) {
								$scope.Data.selected[int] = true;
							}
						}
					}
				}
			}
			$scope.getBaseSelector();

		},
		link : function(scope, element, attrs, ctrls) {
			scope.api.reset = function() {
				scope.Data.selected.splice(0, scope.Data.selected.length);
			};

		}
	};
});
