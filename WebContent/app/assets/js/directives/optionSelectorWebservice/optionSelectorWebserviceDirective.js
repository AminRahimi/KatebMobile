angular.module("optionSelectWebservice", [  ]).directive('optionSelectWebservice', function() {
	return {
		restrict : 'EAC',
		// replace: true,
		templateUrl : 'app/assets/js/directives/optionSelectorWebservice/optionSelectorWebserviceTemplate.html',
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			api : "="
		},
		controller : function($scope, baseSelectSrvc, Restangular,$filter) {
			$scope.api ? $scope.api : $scope.api = {};
			$scope.api.reset = function() {
				$scope.selected = ""
			};

			$scope.Func = {
				onRefresh : function(query) {
					// console.log($scope.schema.typeParams.url);
					query= $filter('FaToEnAndYeKe')(query);
					return Restangular.all($scope.schema.typeParams.url.replace("api/", "").replace("{query}", query).replace("len=100", "len=10")).getList().then(function(response) {
						$scope.options = Restangular.stripRestangular(response.data);
					});
				}
			};

			$scope.onSelect = function(item, selected) {
				if($scope.schema.multiple){
					$scope.model = $scope.model || [];
					$scope.model = $scope.model.filter((modelItem)=>modelItem.uid!==selected.uid);
					$scope.model.push(selected);
					$scope.selected = null;
				}else{
					$scope.model = $scope.selected = selected;
				}
			};

			$scope.onRemove = function (item){
				$scope.model = $scope.model.filter((modelItem)=>modelItem.uid!==item.uid);
			};

			// $scope.$watch('model', function() {
			// if ($scope.options[$scope.schema.enumType]) {
			// for (var int = 0; int <
			// $scope.options[$scope.schema.enumType].length; int++) {
			// if ($scope.model && $scope.model.key ==
			// $scope.options[$scope.schema.enumType][int].key) {
			// $scope.selected = $scope.options[$scope.schema.enumType][int];
			// break;
			// }
			// }
			// }
			// });

		},
		link : function(scope, element, attrs, ctrls) {
		}
	};
});
