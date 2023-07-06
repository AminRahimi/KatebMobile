angular.module("optionSelect", [ 'ngFileUpload' ]).directive('optionSelect', function($compile, $http, toaster) {
	return {
		restrict : 'EAC',
		// replace: true,
		templateUrl : 'app/lib/vtSchemaDirective/components/optionSelector/optionSelectorTemplate.html',
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			api : "=",
			isInnerOption : "=?"
		},
		controller : function($scope, baseSelectSrvc, $modal) {
			$scope.api ? $scope.api : $scope.api = {};
			$scope.api.reset = function() {
				$scope.selected = ""
			};
			$scope.getBaseSelector = function() {
				$scope.options = {};
				baseSelectSrvc.getBaseSelectorList().then(function(response) {
					for (var index = 0; index < response.data.length; index++) {
						$scope.options[response.data[index].key] = response.data[index].members;
						// if(response.data[index].key==$scope.schema.enumType)
						// $scope.options = response.data[index].members;
					}
				});
			};

			$scope.onSelect = function() {
				$scope.model = $scope.selected;
			};

			if (!$scope.isInnerOption) {
				$scope.getBaseSelector();
			} else {
				$scope.options = {
					"op" : $scope.schema.typeParams.type_options
				};
			}

			$scope.$watch('model', function() {
				if ($scope.schema.typeParams && $scope.options[$scope.schema.typeParams.enumType]) {
					for (var int = 0; int < $scope.options[$scope.schema.typeParams.enumType].length; int++) {
						if ($scope.model && $scope.model.key == $scope.options[$scope.schema.typeParams.enumType][int].key) {
							$scope.selected = $scope.options[$scope.schema.typeParams.enumType][int];
							break;
						}
					}
				}
			});

		},
		link : function(scope, element, attrs, ctrls) {
		}
	};
});
