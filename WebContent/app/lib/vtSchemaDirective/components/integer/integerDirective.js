angular.module("integer", []).directive('integer', function($compile) {
	return {
		restrict : 'EAC',
		// replace: true,
		templateUrl : 'app/lib/vtSchemaDirective/components/integer/integerTemplate.html',
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			form : "="
		},
		require : [ 'ngModel', '?^form' ],
		// h ['persianDatepicker', '?^ngModel'],
		controller : function($scope, entitySrvc) {
			/*
			 * $scope.$watch('model',function(){
			 * $scope.ctrls.$setValidity('',$scope.form[$scope.field +
			 * "-widget"].$valid); });
			 */
			$scope.required = true;
			/*
			 * $scope.onAddNewTextInputClick = function() { if (!$scope.model) {
			 * $scope.model = []; } ; $scope.model.push({ string : "" }); };
			 */
		},
		link : function(scope, element, attrs, ctrls) {
			/*
			 * if (attrs.ngRequired) { scope.required = attrs.ngRequired;
			 * element.find("input").attr("ng-required", scope.required); }
			 * return $compile(element.contents())(scope);
			 */
			/*
			 * $(element).find("input").attr({ "ng-required" : scope.required,
			 * });
			 */
			// scope.ctrls=ctrls;
			// ctrls.$setValidity('',false)
			// var f=scope.form[scope.field].$setValidity;
			/*
			 * scope.$watch('model',function(){
			 * ctrls.$setValidity('',scope.form[scope.field].$valid); });
			 */
			/*
			 * scope.form[scope.field].$setValidity=function(a,b){ f(a,b);
			 * ctrls.$setValidity('',b); };
			 */

			// return $compile(element.contents())(scope);
		}
	};
});
