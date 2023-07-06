angular.module("multiText", []).directive('multiText', function($compile) {
	return {
		restrict : 'EAC',
		// replace: true,
		templateUrl : 'app/lib/vtSchemaDirective/components/multiText/multiTextTemplate.html',
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			api:"="
		},
		// h ['persianDatepicker', '?^ngModel'],
		controller : function($scope, $modal) {
			$scope.api?$scope.api:$scope.api={};
			$scope.api.reset=function(){
				$scope.tempStr="";
			};
			$scope.removeTextInput = function(inp){
				$scope.model.splice($scope.model.indexOf(inp),1);
			};
			
			$scope.onAddNewTextInputClick = function() {
				if(!$scope.model)
					$scope.model=[];
				if($scope.tempStr!="")// && $scope.model.indexOf($scope.tempStr)==-1)
					$scope.model.push($scope.tempStr);
				$scope.tempStr = "";
			};
		},
		link : function(scope, element, attrs, ctrls) {
		}
	};
});
