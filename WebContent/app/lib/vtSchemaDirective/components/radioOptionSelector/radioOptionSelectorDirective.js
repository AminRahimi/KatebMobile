angular.module("radioOptionSelect", [ 'ngFileUpload' ]).directive('radioOptionSelect', function($compile, $http) {
	return {
		restrict : 'EAC',
		// replace: true,
		templateUrl : 'app/lib/vtSchemaDirective/components/radioOptionSelector/radioOptionSelectorTemplate.html',
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			api:"="
		},
		controller : function($scope, baseSelectSrvc) {
			
			$scope.getBaseSelector = function(){
				$scope.options = {};
				baseSelectSrvc.getBaseSelectorList().then(function(response){
					for ( var index = 0; index < response.data.length; index++) {
						$scope.options[response.data[index].key] = response.data[index].members;
					}
				});
			};
					
			$scope.onSelect = function(index) {
				$scope.model=$scope.options[$scope.schema.enumType][index];
			};

			$scope.getBaseSelector();
			
			$scope.$watch('model',function(){
				if($scope.model){
					$scope.selected = $scope.model.key;
				}
			});
		},
		link : function(scope, element, attrs, ctrls) {
		}
	};
});
