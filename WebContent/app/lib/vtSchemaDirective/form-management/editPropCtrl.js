angular.module('vtFormManagement').controller(
		'editPropCtrl',
		function($scope, entitySrvc, $modalInstance, toaster, property, entityTypeList, baseSelectorList, components) {
			$scope.Data = {
				newProperty : angular.copy(property),
				baseSelectorList : baseSelectorList,
				components : angular.copy(components),
				schemaFormApi : {},
				widgetParamModel : angular.copy(property).widgetParam || {}
			}

			$scope.Func = {
				createWidgetsList : function() {
				
				},

				init : function() {
					for (var int = 0; int < $scope.Data.components.length; int++) {
						if ($scope.Data.newProperty.typeComponent == $scope.Data.components[int]) {
							$scope.Data.newProperty.typeComponent = $scope.Data.components[int];
							$scope.Func.onSelectType();
						}
					}
					if ($scope.Data.newProperty.type == 'enum')
						for (var jnt = 0; jnt < baseSelectorList.length; jnt++)
							if ($scope.Data.newProperty.enumType == baseSelectorList[jnt].key)
								$scope.Data.newProperty.enumType = baseSelectorList[jnt];

					$scope.Data.selectedWidget = $scope.Data.newProperty.widget;
					angular.forEach($scope.Data.components,function(cmp){
						if(cmp.type==$scope.Data.newProperty.type){
							$scope.Data.newProperty.typeComponent=cmp;
							$scope.widgets = $scope.Data.newProperty.typeComponent.widgets;
							// if ($scope.widgets.length < 2)
							$scope.Data.selectedWidget = $scope.widgets[0];
							if($scope.Data.newProperty.typeComponent.type=='enum'){								
								$scope.Data.newProperty.enumType = $scope.Data.newProperty.enumType ||  $scope.Data.baseSelectorList[0];
							}							
						}
					});
				},
				onSelectType : function() {					
					$scope.widgets = $scope.Data.newProperty.typeComponent.widgets;
					// if ($scope.widgets.length < 2)
					$scope.Data.selectedWidget = $scope.widgets[0];
					if($scope.Data.newProperty.typeComponent.type=="enum"){
						$scope.Data.newProperty.enumType = $scope.Data.baseSelectorList[0];
					}
				},

				/*
				 * *********** Done ************
				 * ****************************************
				 */
				onUpdatePropertyClick : function() {
					$scope.Data.newProperty.title = $scope.Func.correctUrlValidation($scope.Data.newProperty.title);
					if ($scope.Func.checkUrlValidation($scope.Data.newProperty.title)) {
						if ($scope.Func.checkPropInput()) {
							if ($scope.Data.newProperty.multiple == undefined)
								$scope.Data.newProperty.multiple = false;
						}
					}
					$scope.Data.newProperty.type = $scope.Data.newProperty.typeComponent.type;
					$scope.Data.newProperty.widget = $scope.Data.selectedWidget.widget;
					$scope.Data.newProperty.isStatic = $scope.Data.selectedWidget.isStatic;
					$scope.Data.newProperty.widgetParam = $scope.Data.widgetParamModel;
					if ($scope.Data.newProperty.enumType)
						$scope.Data.newProperty.enumType = $scope.Data.newProperty.enumType.key;
					$modalInstance.close($scope.Data.newProperty);
				},
				onReturnClick : function() {
					$modalInstance.dismiss('return');
				},

				/*
				 * *********** Check ************
				 * ****************************************
				 */
				checkPropInput : function() {
					$scope.hasError = false;
					$scope.hasError_pTitle = false;
					$scope.hasError_pName = false;
					$scope.hasError_widget = false;
					if ($scope.Data.newProperty.title == "") {
						$scope.hasError = true;
						$scope.hasError_pTitle = true;
					}
					if ($scope.Data.newProperty.label == "") {
						$scope.hasError = true;
						$scope.hasError_pName = true;
					}
					if ($scope.Data.selectedWidget == "") {
						$scope.hasError = true;
						$scope.hasError_widget = true;
					}
					return !$scope.hasError;
				},

				checkUrlValidation : function(string) {
					if (string.indexOf('!') > -1 || string.indexOf('*') > -1 || string.indexOf('\'') > -1 || string.indexOf('(') > -1 || string.indexOf(')') > -1 || string.indexOf(';') > -1 || string.indexOf(',') > -1 || string.indexOf('@') > -1 || string.indexOf('&') > -1 || string.indexOf('=') > -1 || string.indexOf('+') > -1 || string.indexOf('$') > -1 || string.indexOf('/') > -1
							|| string.indexOf('?') > -1 || string.indexOf('%') > -1 || string.indexOf('#') > -1 || string.indexOf('[') > -1 || string.indexOf(']') > -1) {
						return false;
					}
					return true;
				},
				correctUrlValidation : function(str) {
					return str.replace(/ /g, "_").replace(/!/g, "").replace(/\*/g, "").replace(/\\/g, "").replace(/\(/g, "").replace(/\)/g, "").replace(/;/g, "").replace(/,/g, "").replace(/&/g, "").replace(/=/g, "").replace(/\+/g, "").replace(/\$/g, "").replace(/\//g, "").replace(/\?/g, "").replace(/%/g, "").replace(/#/g, "").replace(/\[/g, "").replace(/\]/g, "").replace(/@/g, "");
				},

			}

			$scope.Func.createWidgetsList();
			$scope.Func.init();

		});