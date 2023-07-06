angular.module("schemaForm").directive("entityTypeList", function() {
	return {
		restrict : 'AE',
		templateUrl : 'app/lib/vtSchemaDirective/directives/entityTypeList/entityTypeList.temp.html',
		scope : {
			api : "=",
			model : "="
		},
		controller : function($scope) {
			$scope.Data = {}

			$scope.Func = {

			}

			var Run = function() {
			}
			Run();

		},
		link : function(scope, element, attrs) {
		}
	};
});