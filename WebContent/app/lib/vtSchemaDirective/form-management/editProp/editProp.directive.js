angular.module("vtFormManagement").directive("editProp", function() {
	return {
		restrict : 'AE',
		templateUrl : 'app/lib/vtSchemaDirective/form-management/editProp/editProp.template.html',
		scope : {
			api : "=",
			typeList : "=",
			baseSelectorList : "=",
			property : "="
		},
		controller : function($scope, entitySrvc, toaster, formManagementSrvc) {

			$scope.Data = {
				newProperty : angular.copy($scope.property),
				baseSelectorList : $scope.baseSelectorList,
				components : angular.copy(formManagementSrvc.getComponent()),
				schemaFormApi : {},
				schemaFormApiForTypeParams : {},
				fileWidgetParamApi : {},
				widgetParamModel : ($scope.property && $scope.property.widgetParams) ? angular.copy($scope.property.widgetParams) : {},
				typeParamsModel : ($scope.property && $scope.property.typeParams) ? angular.copy($scope.property.typeParams) : {}
			}

			$scope.Func = {
				createWidgetsList : function() {
					// $scope.Data.types = [ {
					// fa : "متن",
					// en : "string"
					// }, {
					// fa : "عدد",
					// en : "integer"
					// }, {
					// fa : "تاریخ",
					// en : "date"
					// }, {
					// fa : "فایل",
					// en : "file"
					// }, {
					// fa : "ضمیمه فایل",
					// en : "attachment"
					// }, {
					// fa : "انتخابگر پایه",
					// en : "enum"
					// }, {
					// fa : "برچسب",
					// en : "tag"
					// } ];
					// $scope.Data.widgets = {
					// file : [ "fileSelector", "imageSelector" ],
					// attachment : [ "attachFile" ],
					// date : [ "jalali", "gregorian" ],
					// string : [ "textBox", "textarea", "bigText" ],
					// integer : [ "intBox" ],
					// enum : [ "optionSelector", "radio" ],
					// tag : [ 'textBox' ]
					// };
					// $scope.Data.Translate = {
					// fileSelector : "انتخابگر فایل",
					// imageSelector : "انتخابگر تصویر",
					// bigText : "ویرایش‌گر متن طولانی",
					// textBox : "ویرایشگر عادی",
					// textarea : "ویرایشگر متن",
					// jalali : "جلالی",
					// gregorian : "گرگوریان",
					// radio : "رادیو",
					// optionSelector : "منوی کشویی"
					// };

					// for (var index = 0; index < entityTypeList.length;
					// index++) {
					// if
					// (!$scope.Data.widgets[entityTypeList[index].entityKey]) {
					// $scope.Data.types.push({
					// fa : entityTypeList[index].name,
					// en : entityTypeList[index].entityKey
					// });
					// $scope.Data.widgets[entityTypeList[index].entityKey] = [
					// "popupSelector" ];
					// }
					// }
				},

				init : function() {
					if ($scope.Data.newProperty) {
						for (var int = 0; int < $scope.Data.components.length; int++) {
							if ($scope.Data.newProperty.typeComponent == $scope.Data.components[int]) {
								$scope.Data.newProperty.typeComponent = $scope.Data.components[int];
								$scope.Func.onSelectType();
							}
						}

						$scope.Data.newProperty.multiple = $scope.Data.newProperty.multiple ? true : false;

						$scope.Data.selectedWidget = $scope.Data.newProperty.widget;
						if ($scope.Data.newProperty.typeComponent == 'enum')
							for (var jnt = 0; jnt < baseSelectorList.length; jnt++)
								if ($scope.Data.newProperty.enumType == baseSelectorList[jnt].key)
									$scope.Data.newProperty.enumType = baseSelectorList[jnt];

						if ($scope.Data.newProperty.widget == "popupSelector") {
							$scope.Data.newProperty.typeComponent = _.find($scope.Data.components, function(_component) {
								return _component.type == "entitySelector"
							});
							$scope.Func.onSelectType();
							$scope.Data.selectedWidget = _.find($scope.widgets, function(_widget) {
								return !_widget.isHidden
							});
							$scope.Data.selectedEntityType = _.find($scope.typeList, function(_entityType) {
								return _entityType.key == $scope.Data.newProperty.type
							});

						}

						angular.forEach($scope.Data.components, function(cmp) {
							if (cmp.type == $scope.Data.newProperty.type) {
								$scope.Data.newProperty.typeComponent = cmp;
								$scope.widgets = $scope.Data.newProperty.typeComponent.widgets;
								// if ($scope.widgets.length < 2)
								$scope.Data.selectedWidget = $scope.widgets[0];
								if ($scope.Data.newProperty.typeComponent.type == 'enum') {

									$scope.Data.newProperty.enumType = _.find($scope.Data.baseSelectorList, function(_baseSelector) {
										return _baseSelector.key == $scope.Data.newProperty.typeParams.enumType
									});
									$scope.Data.newProperty.enumType = $scope.Data.newProperty.enumType || $scope.Data.baseSelectorList[0];
								}
							}
						});

						$scope.Data.widgetParamModel = ($scope.property && $scope.property.widgetParams) ? angular.copy($scope.property.widgetParams) : {};
						$scope.Data.typeParamsModel = ($scope.property && $scope.property.typeParams) ? angular.copy($scope.property.typeParams) : {};

					}
				},
				onSelectType : function() {
					$scope.widgets = $scope.Data.newProperty.typeComponent.widgets;
					// if ($scope.widgets.length < 2)
					$scope.Data.selectedWidget = $scope.widgets[0];
					if ($scope.Data.newProperty.typeComponent.type == "enum") {
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

					$scope.Data.newProperty.type = function() {
						if ($scope.Data.newProperty.typeComponent.type == "entitySelector") {
							return $scope.Data.selectedEntityType.key
						} else {
							return $scope.Data.newProperty.typeComponent.type;
						}
					}();
					$scope.Data.newProperty.widget = $scope.Data.selectedWidget.widget;
					$scope.Data.newProperty.isStatic = $scope.Data.selectedWidget.isStatic;
					$scope.Data.newProperty.widgetParams = $scope.Data.widgetParamModel;

					$scope.Data.newProperty.typeParams = $scope.Data.newProperty.typeParams || {};

					angular.extend($scope.Data.newProperty.typeParams, $scope.Data.typeParamsModel);
					if ($scope.Data.newProperty.enumType) {
						$scope.Data.newProperty.typeParams.enumType = $scope.Data.newProperty.enumType.key;
					}
					if (_.isEmpty($scope.Data.newProperty.typeParams)) {
						delete $scope.Data.newProperty.typeParams
					}

					$scope.api.onSaveClick($scope.Data.newProperty);
				},
				onReturnClick : function() {
					
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
					if (string.indexOf('!') > -1 || string.indexOf('*') > -1 || string.indexOf('\'') > -1 || string.indexOf('(') > -1 || string.indexOf(')') > -1 || string.indexOf(';') > -1 || string.indexOf(',') > -1 || string.indexOf('@') > -1 || string.indexOf('&') > -1 || string.indexOf('=') > -1 || string.indexOf('+') > -1 || string.indexOf('$') > -1 || string.indexOf('/') > -1 || string.indexOf('?') > -1 || string.indexOf('%') > -1 || string.indexOf('#') > -1 || string.indexOf('[') > -1 || string.indexOf(']') > -1) {
						return false;
					}
					return true;
				},
				correctUrlValidation : function(str) {
					return str.replace(/ /g, "_").replace(/!/g, "").replace(/\*/g, "").replace(/\\/g, "").replace(/\(/g, "").replace(/\)/g, "").replace(/;/g, "").replace(/,/g, "").replace(/&/g, "").replace(/=/g, "").replace(/\+/g, "").replace(/\$/g, "").replace(/\//g, "").replace(/\?/g, "").replace(/%/g, "").replace(/#/g, "").replace(/\[/g, "").replace(/\]/g, "").replace(/@/g, "");
				},
				regenerate : function() {

					$scope.Data.newProperty = angular.copy($scope.property);

					$scope.Data.baseSelectorList = $scope.baseSelectorList;

					$scope.Data.fileWidgetParamApi = {};

					$scope.Func.createWidgetsList();
					$scope.Func.init();
				}

			}

			var Run = function() {
				$scope.Func.createWidgetsList();
				$scope.Func.init();
				$scope.api.regenerate = $scope.Func.regenerate;
			}

			Run();

		},
		link : function(scope, element, attrs) {
		}
	};
});