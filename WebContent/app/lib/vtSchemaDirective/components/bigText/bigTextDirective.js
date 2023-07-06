angular.module("bigText", []).directive('bigText', function($compile) {
	return {
		restrict : 'EAC',
		templateUrl : 'app/lib/vtSchemaDirective/components/bigText/bigTextTemplate.html',
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			api : "="
		},
		controller : function($scope, $modal) {
			if ($scope.schema.widgetParams)
				$scope.direction = $scope.schema.widgetParams.direction;
			else
				$scope.direction = 'rtl';

			$scope.openBigTextModal = function() {

				var modalInstance = $modal.open({
					templateUrl : 'app/lib/vtSchemaDirective/components/bigText/bigTextModalTemplate.html',
					controller : 'bigTextModalCtrl',
					resolve : {
						model : function() {
							return $scope.model;
						},
						isEditMode : function() {
							return $scope.isEditMode;
						},
						direction : function() {
							return $scope.direction;
						}
					}

				});

				modalInstance.result.then(function(model) {
					$scope.model = model;
				}, function() {
				});
			};

		},
		link : function(scope, element, attrs, ctrls) {
		}
	};
});