angular.module("multiTextarea", []).directive('multiTextarea', function($compile) {
	return {
		restrict : 'EAC',
		// replace: true,
		templateUrl : 'app/lib/vtSchemaDirective/components/multiTextarea/multiTextareaTemplate.html',
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			api : "="
		},
		// h ['persianDatepicker', '?^ngModel'],
		controller : function($scope, entitySrvc) {
			$scope.onAddNewTextareaClick = function() {
				if (!$scope.model) {
					$scope.model = [];
				}
				;
				$scope.model.push('');
			};
			$scope.onRemoveTextAreaClick = function(textAreaModel, index) {
				/*
				 * _.find($scope.model, function(_textAreaModel, index) { if
				 * (_textAreaModel.$$hashKey == textAreaModel.$$hashKey) {
				 */
				$scope.model.splice(index, 1);
				/*
				 * return true } })
				 */
			}
		},
		link : function(scope, element, attrs, ctrls) {
			/*
			 * if (attrs.ngRequired) { scope.required = attrs.ngRequired;
			 * element.find("input").attr("ng-required", scope.required); }
			 * return $compile(element.contents())(scope);
			 */
		}
	};
});
