/* schema-form - 0.0.1
 * Angular directives that produces form fields from json schema
 * https://your/lib/name/here
 */
(function() {
	angular.module("schemaForm", [ 'multiText', 'multiTextarea', 'fileSelect', 'imageSelect', 'multiFileSelect', 'bigText', 'attachFileSingle', 'attachFileMultiple', 'integer', 'optionSelect', 'multiOptionSelect', 'radioOptionSelect', 'addProperty', 'ngFileUpload', 'autoCompleteTagInput']);
}).call(this);

(function() {
	angular.module("schemaForm").directive("schemaFormField", function($compile, $templateCache, $templateRequest, formManagementSrvc) {
		return {
			restrict : "EA",
			replace : true,
			require : "^form",
			scope : {
				schema : "=",
				globSchema : "=",
				model : "=",
				field : "=",
				required : "=",
				isEditMode : "=",
				api : "=",
				label : "@",
				isFocused : "=",
				suffix : "="
			},
			controller : function($scope) {
				$scope.opened = false;
				$scope.api = $scope.api || {};
				$scope.api.validationClicked = false;
				$scope.open = function($event) {
					$event.preventDefault();
					$event.stopPropagation();
					$scope.opened = true;
				};

				var calcExpersionOfSExpersion = function(model, expObj) {

					if (expObj.type == "==") {
						return model[expObj.fieldName] == expObj.val
					} else if (expObj.type == ">") {
						return model[expObj.fieldName] > expObj.val
					} else if (expObj.type == ">=") {
						return model[expObj.fieldName] >= expObj.val
					} else if (expObj.type == "<") {
						return model[expObj.fieldName] < expObj.val
					} else if (expObj.type == "<=") {
						return model[expObj.fieldName] <= expObj.val
					} else {
						return false;
					}

				}

				var calcSExpersion = function(sExp) {
					var tmpVal1 = false;
					var tmpVal2 = false;

					if (angular.isArray(sExp[1])) {
						tmpVal1 = calcSExpersion(sExp[1]);
					} else if (angular.isObject(sExp[1])) {
						tmpVal1 = calcExpersionOfSExpersion($scope.model, sExp[1]);
					}

					if (angular.isArray(sExp[2])) {
						tmpVal2 = calcSExpersion(sExp[2]);
					} else if (angular.isObject(sExp[2])) {
						tmpVal2 = calcExpersionOfSExpersion($scope.model, sExp[2]);
					}

					if (sExp[0] == "AND") {
						return tmpVal1 && tmpVal2
					} else if (sExp[0] == "OR") {
						return tmpVal1 || tmpVal2
					}

				}

				$scope.Func = {
					isVisible : function() {
						if (angular.isDefined($scope.schema.widgetParam) && angular.isDefined($scope.schema.widgetParam.visible)) {
							if (angular.isArray($scope.schema.widgetParam.visible)) {
								return calcSExpersion($scope.schema.widgetParam.visible);
							} else if (angular.isObject($scope.schema.widgetParam.visible)) {
								return calcExpersionOfSExpersion($scope.model, $scope.schema.widgetParam.visible);
							}
						} else {
							return true
						}

					}
				}

			},
			link : function(scope, element, attrs, formController) {
				scope.formState = formController;
				var template;

				/* **************** ************** */
				var defaultWidget = {
					file : 'fileSelector',
					string : 'textBox',
					topic : 'popupTopicSelector',
					enum : 'optionSelector',
					attachment : 'attachFile',
					integer : 'intBox',
					tag : 'textBox'
				}
				if (scope.schema) {
					var path = "";
					if (scope.schema.type == "property") {
						path = "app/lib/vtSchemaDirective/schema-form-template/propertyadd.html";
					} else {
						
						path = formManagementSrvc.getHtmlPath(scope.schema.type, scope.schema.widget, scope.schema);
					}
					// var templateName = scope.schema.type;
					// if (scope.schema.widget) {
					// templateName = templateName +
					// scope.schema.widget;
					// if (scope.schema.widget == 'popupSelector')
					// templateName = scope.schema.widget;
					// } else if (defaultWidget[scope.schema.type]) {
					// templateName = templateName +
					// defaultWidget[scope.schema.type];
					// }
					// if (scope.schema.multiple)
					// templateName = templateName + 'multiple';

					// template = $templateCache.get(templateName);
					$templateRequest(path).then(function(html) {
						template = html;

						/* Design Mode */
						if (scope.api && scope.api.isSortable && scope.schema.type != 'property') {
							template = "<div class=\'row\' style=\'margin-left:0\'><div class=\'col-sm-10\'>" + template + "</div>" + "<div class=\'col-sm-2 form-control-static\' ng-class={\'showEditButton\':schema.showEditButton,\'hideEditButton\':!schema.showEditButton}>" + "<span class=\'glyphicon glyphicon-remove pull-left bigPropButton\'" + "aria-hidden=\'true\'" + "ng-click=\'api.onDeletePropertyClick(field)\'></span>" + "<span class=\'glyphicon glyphicon-edit pull-left bigPropButton\'" + "aria-hidden=\'true\'" + "ng-click=\'api.onEditPropClick(field)\'></span></div></div>" + "<hr class=\"formal-line\"></hr>";
						}
						/* *********** */

						element.html(template);
						$(element).find(".widget").attr({
							"ng-required" : scope.required,
							"name" : scope.field + "-" + scope.suffix
						});
						if (scope.schema.pattern) {
							element.find("input").attr("ng-pattern", "/" + scope.schema.pattern + "/");
						}

						$(element.find("div")[0]).attr("ng-show", "Func.isVisible()");

						if (scope.schema.widgetParams) {
							if (scope.schema.widgetParams.direction) {
								if (scope.schema.widgetParams.direction === "ltr") {
									element.find("input").css({
										"direction" : "ltr"
									});
								} else if (scope.schema.widgetParams.direction === "rtl") {
									element.find("input").css({
										"direction" : "rtl"
									});
								}
							}
						}
						return $compile(element.contents())(scope);

					});

				}
			}
		};
	});

}).call(this);

(function() {
	angular.module("schemaForm").directive("schemaFormFields", function($compile, $templateCache, $templateRequest, Restangular) {
		return {
			restrict : "EA",
			scope : {
				schema : "=",
				model : "=",
				isEditMode : "=",
				isCol7 : "=",
				api : "=",
				simpleView : "=",
				isPrint : "=?",
				hasRelation : "=?",
				userSecretLevel : "=?",
				customTemplate : "=?"
			},
			controller : function($scope) {
				$scope.apis = {};
				// //////////////
				// VALIDATION //
				// //////////////
				$scope.api.validationClicked = false;
				$scope.api.setValidation = function() {
					angular.forEach($scope.apis, function(value, key) {
						$scope.apis[key].validationClicked = true;
						$scope.api.validationClicked = true;
					});
				};
				$scope.api.resetValidation = function() {
					angular.forEach($scope.apis, function(value, key) {
						$scope.apis[key].validationClicked = false;
						$scope.api.validationClicked = false;
					});
				};
				// VALIDATION //
				$scope.api.getSuffix = function() {
					return "-" + $scope.suffix;
				}
				$scope.api.resetForm = function() {
					if ($scope.schema) {
						for (var int = 0; int < $scope.schema[$scope.goodGroups].length; int++) {
							for (var int2 = 0; int2 < $scope.schema[$scope.goodGroups][int].members.length; int2++) {
								if ($scope.apis[$scope.schema[$scope.goodGroups][int].members[int2]] && $scope.apis[$scope.schema[$scope.goodGroups][int].members[int2]].reset) {
									$scope.apis[$scope.schema[$scope.goodGroups][int].members[int2]].reset();
								}
							}
						}
					}
					$scope.api.resetValidation();
				};
				var isSingleTopicSelector = function(schemaOfFiled) {
					if (schemaOfFiled.widget && schemaOfFiled.type === "topic" && schemaOfFiled.widget === "popupTopicSelector" && !schemaOfFiled.multiple) {
						return true;
					}
					return false;
				};
				var isMultiTopicSelector = function(schemaOfFiled) {
					if (schemaOfFiled.widget && schemaOfFiled.type === "topic" && schemaOfFiled.widget === "popupTopicSelector" && schemaOfFiled.multiple) {
						return true;
					}
					return false;
				};

				var getCurrentTopicAndPushToNewModelByFiledName = function(newEntityModel, entityField, isMulti, isValid) {

					var topicSrvc = angular.injector([ 'ng', 'topicSelector' ]).get('topicSelector.topicSrvc');

					topicSrvc.getCurrentTopicId().then(function(response) {
						if (response.data) {
							var currentTopic = response.data;
							if (isValid) {
								var indexOf = -1;
								var pushData = {
									displayString : currentTopic.displayString,
									_uid : currentTopic._uid
								};
								for (var index = 0; index < newEntityModel[entityField].length; index++) {
									if (newEntityModel[entityField][index]._uid == currentTopic._uid)
										indexOf = index;
								}
								if (indexOf == -1)
									newEntityModel[entityField].push(pushData);
							} else {
								if (isMulti) {
									newEntityModel[entityField] = [ {
										displayString : currentTopic.displayString,
										_uid : currentTopic._uid
									} ];
								} else {
									newEntityModel[entityField] = {
										displayString : currentTopic.displayString,
										_uid : currentTopic._uid
									};
								}
							}
						}
					});
				};

				$scope.api.correctDataModelForForm = function(_globSchema, _model, addTopic) {
					var tempDataModel = angular.copy(_model);
					for (fieldName in tempDataModel) {
						var schemaOfFiled = _globSchema.properties[fieldName];
						if (schemaOfFiled) {
							var widget = schemaOfFiled.widget;
							if (schemaOfFiled.type && schemaOfFiled.type === "date") {
								tempDataModel[fieldName] = new Date(tempDataModel[fieldName]);
							} else if (isSingleTopicSelector(schemaOfFiled)) {
							} else if (schemaOfFiled.type && schemaOfFiled.type === "relation") {
							} else if (schemaOfFiled.type && schemaOfFiled.type === "tag") {
								var temp = [];
								angular.forEach(tempDataModel[fieldName], function(r, index) {
									temp.push({
										text : r
									});
								});
								tempDataModel[fieldName] = temp;
							}
						} else if (fieldName == '__$relations') {

							var entitySelectorForRelationViewSrvc = angular.injector([ 'ng', 'entitySelectorForRelationView' ]).get('entitySelectorForRelationViewSrvc');

							entitySelectorForRelationViewSrvc.correctDataModelForForm(_globSchema, tempDataModel, "__$relations");
						}
					}
					if (addTopic) {
						getCurrentTopicAndPushToNewModelByFiledName(tempDataModel, 'topics', true, true);
					}
					return tempDataModel;
				};

				$scope.api.generateNewEntityModel = function(_globSchema, newEntityModel) {
					for (entityField in _globSchema.properties) {
						var schemaOfFiled = _globSchema.properties[entityField];
						if (schemaOfFiled) {
							var widget = schemaOfFiled.widget;
							if (widget && widget.split("_")[0] === "date") {
								// newEntityModel[entityField] = "";
							} else if (isSingleTopicSelector(schemaOfFiled)) {
								getCurrentTopicAndPushToNewModelByFiledName(newEntityModel, entityField);
							} else if (isMultiTopicSelector(schemaOfFiled)) {
								getCurrentTopicAndPushToNewModelByFiledName(newEntityModel, entityField, true);
							}
						}
					}

				};

				$scope.api.correctModel = function(_globSchema, _model) {
					_model = Restangular.stripRestangular(_model);
					if (!_model) {

						corectingModel = angular.copy($scope.model);
					} else {
						corectingModel = angular.copy(_model);
					}
					for (fieldName in corectingModel) {
						var schemaOfFiled = _globSchema.properties[fieldName];
						if (corectingModel[fieldName] && schemaOfFiled) {

							if (angular.isDate(corectingModel[fieldName])) {
								corectingModel[fieldName] = corectingModel[fieldName].getTime();
							}
							if (schemaOfFiled.type == "double") {
								corectingModel[fieldName] = parseFloat(corectingModel[fieldName])
							}
							if (schemaOfFiled.type == "file") {
								if (angular.isArray(corectingModel[fieldName])) {
									angular.forEach(corectingModel[fieldName], function(fileModel, fileModelIndex) {
										corectingModel[fieldName][fileModelIndex] = corectingModel[fieldName][fileModelIndex].hash;
									});
								} else {
									corectingModel[fieldName] = corectingModel[fieldName].hash;
								}
							}
							if (schemaOfFiled.type == "attachment") {
								if (angular.isArray(corectingModel[fieldName])) {
									angular.forEach(corectingModel[fieldName], function(fileModel, fileModelIndex) {
										corectingModel[fieldName][fileModelIndex] = {
											"title" : corectingModel[fieldName][fileModelIndex].title,
											"fileName" : corectingModel[fieldName][fileModelIndex].file ? corectingModel[fieldName][fileModelIndex].file.name : corectingModel[fieldName][fileModelIndex].fileName,
											"hash" : corectingModel[fieldName][fileModelIndex].file ? corectingModel[fieldName][fileModelIndex].file.hash : corectingModel[fieldName][fileModelIndex].hash,
											"downloadLink" : ""
										}
									});
								} else {
									corectingModel[fieldName] = {
										"title" : corectingModel[fieldName].title,
										"fileName" : corectingModel[fieldName].file ? corectingModel[fieldName].file.name : corectingModel[fieldName].fileName,
										"hash" : corectingModel[fieldName].file ? corectingModel[fieldName].file.hash : corectingModel[fieldName].hash,
										"downloadLink" : ""
									}

								}
							}
							if (angular.isArray(corectingModel[fieldName]) && schemaOfFiled.type != "tag") {
								for (var i = 0; i < corectingModel[fieldName].length; i++) {
									if (corectingModel[fieldName][i] && corectingModel[fieldName][i]._uid) {
										corectingModel[fieldName][i] = corectingModel[fieldName][i]._uid;
									}
								}
							} else {
								if (corectingModel[fieldName]._uid) {
									corectingModel[fieldName] = corectingModel[fieldName]._uid;
								}
							}

							if (angular.isDate(corectingModel[fieldName])) {
								corectingModel[fieldName] = corectingModel[fieldName].getTime();
							}

							// if (angular.isArray(corectingModel[fieldName])) {
							// for (var i = 0; i <
							// corectingModel[fieldName].length; i++) {
							// if (corectingModel[fieldName][i]._uid) {
							// corectingModel[fieldName][i] =
							// corectingModel[fieldName][i]._uid;
							// }
							// }
							// } else {
							// if (corectingModel[fieldName]._uid) {
							// corectingModel[fieldName] =
							// corectingModel[fieldName]._uid;
							// }
							// }

							if (corectingModel[fieldName] && corectingModel[fieldName].length == 0) {
								delete corectingModel[fieldName];
							}
							if (schemaOfFiled && schemaOfFiled.type && schemaOfFiled.type === "relation") {

								var multiRelationSelectorSrvc = angular.injector([ 'ng', 'multiRelationSelector' ]).get('multiRelationSelectorSrvc');

								multiRelationSelectorSrvc.correctModel(schemaOfFiled, corectingModel, fieldName);
							}
							if (schemaOfFiled && schemaOfFiled.type && schemaOfFiled.type === "relation_view" && schemaOfFiled.multiple) {

								var multiEntitySelectorForRelationViewSrvc = angular.injector([ 'ng', 'multiEntitySelectorForRelationView' ]).get('multiEntitySelectorForRelationViewSrvc');

								multiEntitySelectorForRelationViewSrvc.correctModel(schemaOfFiled, corectingModel, fieldName);
							} else if (schemaOfFiled && schemaOfFiled.type && schemaOfFiled.type === "relation_view" && !schemaOfFiled.multiple) {

								var entitySelectorForRelationViewSrvc = angular.injector([ 'ng', 'entitySelectorForRelationView' ]).get('entitySelectorForRelationViewSrvc');

								entitySelectorForRelationViewSrvc.correctModel(schemaOfFiled, corectingModel, fieldName);
							}

						}
					}

					if (angular.isDefined(corectingModel['__$relations']) && ((corectingModel['__$relations'].backward && corectingModel['__$relations'].backward.length) || (corectingModel['__$relations'].forward && corectingModel['__$relations'].forward.length))) {
						var multiRelationSelector2Srvc = angular.injector([ 'ng', 'multiRelationSelector2' ]).get('multiRelationSelector2Srvc');

						multiRelationSelector2Srvc.correctModel({}, corectingModel, '__$relations');
					}

					return corectingModel

				}
			},
			link : function(scope, element, attrs) {

				scope.suffix = new Date().getTime();
				scope.goodGroups = 'viewGroups';
				scope.isFocused = {};

				scope.$watch("schema", function(){
						var viewGroup = scope.schema[scope.goodGroups][0];
						viewGroup.isTabActive = true;
						scope.selectedViewGroup = viewGroup;
				});

				scope.onChangeTabActiveIndexClick = function(viewGroup) {
					if (scope.selectedViewGroup) {
						scope.selectedViewGroup.isTabActive = false
					}
					viewGroup.isTabActive = true;
					scope.selectedViewGroup = viewGroup;
				}
				scope.api.setMode = function(mode) {
					if (mode === "SEARCH") {
						var _groups = [];
						var searchGroups = angular.copy(scope.schema.viewGroups);

						_.filter(scope.schema.properties, function(prop) {
							return prop.searchable
						});
						_.each(searchGroups, function(group) {
							group.members = _.filter(group.members, function(field) {
								if (scope.schema.properties[field]) {
									scope.schema.properties[field].required = false;
									return scope.schema.properties[field].searchable
								}
							});
							if (group.members.length !== 0) {
								_groups.push(group);
							}
						});
						if (_groups.length)
							scope.schema.searchGroups = _groups;
					}
					scope.goodGroups = 'searchGroups';
				}

				// Watch editMode for focus first element of form
				// FIXME: watch is bad
				scope.$watch('isEditMode', function(newVal, oldVal) {
					if (scope.schema && scope.schema.properties) {
						// var firstFieldName =
						// Object.keys(scope.schema.properties)[0];
						var firstFieldName = scope.schema.viewGroups[0].members[0];
						scope.isFocused[firstFieldName] = newVal;
					}
				});
				scope.$watch('api.selectedViewGroupIndex', function(newVal, oldVal) {
					if (scope.schema && scope.api && scope.api.selectedViewGroupIndex) {
						scope.selectedViewGroup = scope.schema.viewGroups[scope.api.selectedViewGroupIndex];
					}

				});
				scope.$watch('model', function(newVal, oldVal) {
					if (scope.model) {
						for (var index = 0; index < Object.keys(scope.model).length; index++) {
							if (scope.schema && scope.schema.properties[Object.keys(scope.model)[index]] && scope.schema.properties[Object.keys(scope.model)[index]].type == 'date') {
								scope.model[Object.keys(scope.model)[index]] = new Date(scope.model[Object.keys(scope.model)[index]]);
							}
						}
					}
				});

				scope.isWrap = function($index) {
					var schemaFormFieldsWidth = $("schema-form-fields").width();
					var schemaFormFieldWidth = $("schema-form-field").width();
					var possibleCountInRow = Math.floor(schemaFormFieldsWidth / schemaFormFieldWidth);
					if ((($index + 1) % possibleCountInRow) === 1) {
						return true;
					} else {
						return false;
					}
				};

				if (scope.api.onInit) {
					scope.api.onInit()
				}
				if (scope.api.isSortable)
					scope.selectedViewGroup = scope.schema.viewGroups[scope.api.selectedViewGroupIndex];
				
				if (scope.customTemplate) {
					$templateRequest(scope.customTemplate).then(function(html) {
						template = html;
						element.html(template);
						return $compile(element.contents())(scope);
					});
					// template = $templateCache.get("print");
				}else if (scope.isPrint) {
					$templateRequest("app/lib/vtSchemaDirective/schema-form-template/print.html").then(function(html) {
						template = html;
						element.html(template);
						return $compile(element.contents())(scope);
					});
					// template = $templateCache.get("print");
				} else if (scope.api.isSortable) {
					$templateRequest("app/lib/vtSchemaDirective/schema-form-template/sortableSchema.html").then(function(html) {
						template = html;
						element.html(template);
						return $compile(element.contents())(scope);
					});
					// template = $templateCache.get("sortableSchema");
				} else if (scope.simpleView) {
					$templateRequest("app/lib/vtSchemaDirective/schema-form-template/simpleSchemaFormFields.html").then(function(html) {
						template = html;
						element.html(template);
						return $compile(element.contents())(scope);
					});
					// template =
					// $templateCache.get("simpleSchemaFormFields.html");
				} else if (scope.hasRelation) {
					$templateRequest("app/lib/vtSchemaDirective/schema-form-template/schemaFormFieldsWithRelation.html").then(function(html) {
						template = html;
						element.html(template);
						return $compile(element.contents())(scope);
					});
				} else if (!scope.hasRelation) {
					$templateRequest("app/lib/vtSchemaDirective/schema-form-template/schemaFormFields.html").then(function(html) {
						template = html;
						element.html(template);
						return $compile(element.contents())(scope);
					});
				}

			}
		};
	});

}).call(this);