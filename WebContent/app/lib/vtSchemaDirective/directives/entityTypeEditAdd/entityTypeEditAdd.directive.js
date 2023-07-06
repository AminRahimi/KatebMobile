angular.module("schemaForm").directive("entityTypeEditAdd", function() {
	return {
		restrict : 'AE',
		templateUrl : 'app/lib/vtSchemaDirective/directives/entityTypeEditAdd/entityTypeEditAdd.temp.html',
		scope : {
			api : "=",
			model : "=",
			form : "="
		},
		controller : function($scope) {
			$scope.Data = {
				mode : "none",
				tmp : {
					model : null
				}
			}
			$scope.Func = {
				setMode : function(mode) {
					$scope.Data.mode = mode;
				},
				gotoEditMode : function() {
					$scope.Data.tmp.model = $scope.Func.correctForEdit($scope.model);
					$scope.Func.setMode("edit");
				},
				gotoAddMode : function() {
					$scope.Func.correctForAdd($scope.model);
					$scope.Func.setMode("add");
				},
				getFilledModel : function() {
					return $scope.Data.tmp.model
				},
				correctForEdit : function(_selectedObj) {
					var selectedObj = angular.copy(_selectedObj);
					return selectedObj
				},
				correctForAdd : function(_selectedObj) {
					$scope.Data.tmp.model = {
						docxExportTemplate : null,
						hotkey : "",
						key : "",
						name : "",
						schema : {
							"key" : "",
							"title" : "",
							"displayStringFunction" : "function(){return null}",
							"properties" : {},
							"extents" : {
								"enriched" : [],
								"list" : []
							},
							"viewGroups" : [ {
								"key" : "viewGroup1",
								"name" : "گروه1",
								"members" : [],
								"secretLevel" : 0
							} ],
							"searchIndexDepth" : null,
							"aspects" : {}
						},
						parentEntityTypeKey : null,
						weak : false
					};
				},
				setApis : function() {
					$scope.api.gotoEditMode = $scope.Func.gotoEditMode;
					$scope.api.setMode = $scope.Func.setMode;
					$scope.api.gotoAddMode = $scope.Func.gotoAddMode;
					$scope.api.getFilledModel = $scope.Func.getFilledModel;
				}
			}

			var Run = function() {

				$scope.Func.setApis();
				if (angular.isFunction($scope.api.onInit)) {
					$scope.api.onInit();
				}
			}
			Run();

		},
		link : function(scope, element, attrs) {
		}
	};
});