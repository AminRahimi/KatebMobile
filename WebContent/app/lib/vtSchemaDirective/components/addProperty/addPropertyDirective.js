angular.module("addProperty", [ 'ngFileUpload' ]).directive('addProperty', function($compile, $http, toaster) {
	return {
		restrict : 'EAC',
		// replace: true,
		templateUrl : 'app/lib/vtSchemaDirective/components/addProperty/addPropertyTemplate.html',
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			api : "="
		},
		controller : function($scope, entitySrvc, baseSelectSrvc) {
			$scope.Data = {
				newProperty : {},
				hasError_validProp : false,
				hasError_duplicateProp : false,
				validationClicked : false,
				mainForm : {}
			}

			$scope.Func = {
				getRequired : function() {
					entitySrvc.getEntityTypeList(1, -1).then(function(response) {
						$scope.Data.entityTypeList = response.data;
						$scope.entityType = $scope.Data.entityTypeList[0];
					});
					baseSelectSrvc.getBaseSelectorList().then(function(response) {
						$scope.Data.baseSelectorList = response.data;
					});
					$scope.Data.dragItem = $scope.api.getDragItem();
				},
				onAddPropertyClick : function() {
					if ($scope.Data.mainForm.$valid) {
						$scope.Data.newProperty.title = $scope.Func.correctUrlValidation($scope.Data.newProperty.title);
						if ($scope.Func.checkUrlValidation($scope.Data.newProperty.title)) {
							if (!$scope.api.checkDuplicateProp($scope.Data.newProperty)) {
								$scope.Func.addProperty();
								$scope.Data.addProp = false;
								$scope.Data.hasError_validProp = false;
								$scope.Data.hasError_duplicateProp = false;
							} else {
								$scope.Data.hasError_duplicateProp = true;
							}
						} else {
							$scope.Data.hasError_validProp = true;
						}
					} else {
						$scope.Data.validationClicked = true;
					}
				},
				addProperty : function() {
					var prop = {
						title : $scope.Data.newProperty.title,
						label : $scope.Data.newProperty.label,
						type : function() {
							if ($scope.Data.dragItem.widget == 'popupSelector') {
								return $scope.entityType.entityKey;
							} else {
								return $scope.Data.dragItem.type;
							}

						}(),
						typeParams : function() {
							var typeParams = undefined;
							if ($scope.Data.dragItem.type == 'relation') {
								typeParams = $scope.entityTypeForRelation ? {
									destType : $scope.entityTypeForRelation.entityKey
								} : undefined
							} else {
								typeParams = undefined;
							}

							if ($scope.Data.newProperty.enumType) {
								typeParams = {
									enumType : $scope.Data.newProperty.enumType.key
								}
							}
							return typeParams
						}(),
						widget : $scope.Data.dragItem.widget,
						multiple : $scope.Data.dragItem.multiple,

					};
					$scope.api.onAddPropertyClick(prop);
				},

				onCancelClick : function() {
					$scope.api.onDeletePropertyClick($scope.field);
				},

				/*
				 * *********** Check ************
				 * ****************************************
				 */

				checkUrlValidation : function(string) {
					if (string.indexOf('!') > -1 || string.indexOf('*') > -1 || string.indexOf('\'') > -1 || string.indexOf('(') > -1 || string.indexOf(')') > -1 || string.indexOf(';') > -1 || string.indexOf(',') > -1 || string.indexOf('@') > -1 || string.indexOf('&') > -1 || string.indexOf('=') > -1 || string.indexOf('+') > -1 || string.indexOf('$') > -1 || string.indexOf('/') > -1 || string.indexOf('?') > -1 || string.indexOf('%') > -1 || string.indexOf('#') > -1 || string.indexOf('[') > -1 || string.indexOf(']') > -1) {
						return false;
					}
					return true;
				},
				correctUrlValidation : function(str) {
					return str.replace(/ /g, "_").replace(/!/g, "").replace(/\*/g, "").replace(/\\/g, "").replace(/\(/g, "").replace(/\)/g, "").replace(/;/g, "").replace(/,/g, "").replace(/&/g, "").replace(/=/g, "").replace(/\+/g, "").replace(/\$/g, "").replace(/\//g, "").replace(/\?/g, "").replace(/%/g, "").replace(/#/g, "").replace(/\[/g, "").replace(/\]/g, "").replace(/@/g, "");
				},

			}
			$scope.Func.getRequired();

		},
		link : function(scope, element, attrs, ctrls) {
		}
	};
});
