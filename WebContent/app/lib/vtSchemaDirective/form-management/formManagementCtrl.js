angular.module("vtFormManagement").controller(
		'vtFormManagement.FormManagementCtrl',
		function($scope, $rootScope, $state, $modal, toaster, entitySrvc, baseSelectSrvc, $location, $timeout, formManagementSrvc) {
			if (!$scope.schemaFieldKey)
				$scope.schemaFieldKey = 'jsonSchema';

			$rootScope.pageTitle = 'طراحی فرم';
			$scope.Data = {
				viewGroupListsortableOptions : {
					handle: '.viewGroup-handle'
				},
				apis : {},
				formItem : {
					title : '',
					properties : {},
					viewGroups : []
				},
				dragItem : {
					picName : '',
					type : '',
					widget : '',
				},
				newProperty : {
					title : '',
					label : ''
				},
				addProp : false,
			}

			$scope.Func = {

				onRemoveViewGroupClick : function(index) {

					angular.forEach($scope.Data.formItem.viewGroups[index].members, function(_member) {
						delete $scope.Data.formItem.properties[_member];
						if ($scope.Data.formItem.staticSections) {
							delete $scope.Data.formItem.staticSections[_member];
						}
					});

					$scope.Data.formItem.viewGroups.splice(index, 1);

				},

				/*
				 * ********************* Component (Right)
				 * *************************
				 */
				onInitSchemaField : function(index) {
					$scope.Data.apis[index] = angular.copy($scope.schemaFormViewModalApi);
					$scope.Data.apis[index].selectedViewGroupIndex = index;
				},
				getFormComponents : function() {
					// TODO: call a service that read components list form
					// external file or server.
					$scope.Data.components = formManagementSrvc.getComponent();
				},
				getRequiredList : function() {
					entitySrvc.getEntityTypeList().then(function(response) {
						$scope.Data.entityTypeList = response.data;
					});
					baseSelectSrvc.getBaseSelectorList().then(function(response) {
						$scope.Data.baseSelectorList = response.data;
					});
				},
				onStartDragFunction : function(event, position, dragItem, widget) {
					$scope.Data.dragItem = widget;
					$scope.Data.dragItem.type = dragItem.type;
					$scope.DragNewProp = true;

					if ($scope.Data.formItem.properties['addProp']) {
						for (var j = 0; j < $scope.Data.formItem.viewGroups.length; j++) {
							if ($scope.Data.formItem.viewGroups[j].members.indexOf('addProp') != -1) {
								$scope.Func.deleteProp('addProp', $scope.tabActiveIndex);
								break;
							}
						}
					}
				},
				onStopDragFunction : function(event, position, dragItem) {
					// $scope.Func.resetDragItem();
				},
				correctEntityTypeSchemaForSend:function(entityTypeSchema,schemaFieldKey){
					angular.forEach(entityTypeSchema.jsonSchema.staticSections, function(_propVal, _prpKey) {
						entityTypeSchema.jsonSchema.staticSections["#"+_prpKey] = angular.copy(entityTypeSchema.jsonSchema.staticSections[_prpKey]);
						delete  entityTypeSchema.jsonSchema.staticSections[_prpKey];
					});
					
					angular.forEach(entityTypeSchema[schemaFieldKey].viewGroups, function(_viewGroup,indexOfViewGroup) {
						angular.forEach(_viewGroup.members, function(_member, indexOfMember) {
							if (entityTypeSchema[schemaFieldKey].staticSections && entityTypeSchema[schemaFieldKey].staticSections["#"+_member]) {
								entityTypeSchema[schemaFieldKey].viewGroups[indexOfViewGroup].members[indexOfMember] = "#" + _member;
							}
						});
					});
					
					return entityTypeSchema;
				},

				/* ********************* Form (Left) ************************* */
				getForm : function() {
					$scope.Func.changeTab(0);

					$scope.getFormFn($scope.entityTypeKey).then(function(response) {
						$scope.Data.newEntityType = response.data;
						
						$scope.Data.formItem = $scope.Data.newEntityType[$scope.schemaFieldKey];
						if ($scope.Data.formItem.properties == undefined)
							$scope.Data.formItem.properties = {};
						// $scope.Func.clearNewProp();
					});
				},
				helpForDrag : function() {
					var modalInstance = $modal.open({
						templateUrl : "app/lib/vtSchemaDirective/form-management/help.html",
						controller : 'helpCtrl',
						size : 'sm'
					});
					modalInstance.result.then(function() {
					}, function() {
					});
				},
				onAddGroupClick : function() {
					var modalInstance = $modal.open({
						templateUrl : "app/lib/vtSchemaDirective/form-management/addViewGroup.html",
						controller : 'addViewGroupCtrl',
						size : 'sm',
						resolve : {
							viewGroup : function() {
								return {
									id : '',
									name : ''
								};
							}
						}
					});
					modalInstance.result.then(function(viewGroup) {
						if (!$scope.Data.formItem.viewGroups)
							$scope.Data.formItem.viewGroups = [];
						$scope.Data.formItem.viewGroups.push({
							id : viewGroup.id,
							name : viewGroup.name,
							members : []
						})
						// $scope.Func.clearNewProp();
						$scope.Func.changeTab($scope.Data.formItem.viewGroups.length - 1);
					}, function() {
					});
				},
				onEditGroupClick : function(viewGroup) {
					var modalInstance = $modal.open({
						templateUrl : "app/lib/vtSchemaDirective/form-management/addViewGroup.html",
						controller : 'addViewGroupCtrl',
						size : 'sm',
						resolve : {
							viewGroup : function() {
								return {
									id : viewGroup.id,
									name : viewGroup.name
								};
							}
						}
					});

					modalInstance.result.then(function(editedViewGroup) {
						viewGroup.id = editedViewGroup.id;
						viewGroup.name = editedViewGroup.name;
					}, function() {
					});
				},
				changeTab : function(index) {
					$scope.tabActiveIndex = index;
					if ($scope.Data.apis && $scope.Data.apis[index])
						$scope.Data.apis[index].selectedViewGroupIndex = index;
					// $scope.Func.clearNewProp();
				},

				onSelectEntityType : function(entityType) {
					$scope.Data.dragItem.type = entityType.entityKey;
				},
				onSelectEnumType : function(enumType) {
					$scope.enumType = enumType;
				},
				onAddProperty : function(index) {
					var title = 'addProp';
					var prop = {
						type : 'property',
						widget : 'add'
					};
					$scope.Data.formItem.properties[title] = prop;
					$scope.Data.formItem.viewGroups[index].members.splice($scope.insertPropIndex, 0, title);

				},
				deleteProp : function(prop, index) {
					if ($scope.Data.formItem.staticSections) {
						delete $scope.Data.formItem.staticSections[prop];
					}
					delete $scope.Data.formItem.properties[prop];
					$scope.Data.formItem.viewGroups[index].members.splice($scope.Data.formItem.viewGroups[index].members.indexOf(prop), 1);
				},
				editProperty : function(prop) {
					var modalInstance = $modal.open({
						templateUrl : "app/lib/vtSchemaDirective/form-management/editPropTemplate.html",
						controller : 'editPropCtrl',
						size : 'md',
						resolve : {
							property : function() {
								var temp = null;
								if ($scope.Data.formItem.properties[prop]) {
									temp = $scope.Data.formItem.properties[prop];
								} else if ($scope.Data.formItem.staticSections && $scope.Data.formItem.staticSections[prop]) {
									temp = $scope.Data.formItem.staticSections[prop];
								}
								temp['title'] = prop;
								return temp;
							},
							entityTypeList : function() {
								return $scope.Data.entityTypeList;
							},
							baseSelectorList : function() {
								return $scope.Data.baseSelectorList;
							},
							components : function() {
								return $scope.Data.components;
							}
						}
					});

					modalInstance.result.then(function(newProperty) {
						var tempTitle = newProperty.title;
						// delete newProperty.title;
						delete $scope.Data.formItem.properties[prop];
						if ($scope.Data.formItem.staticSections) {
							delete $scope.Data.formItem.staticSections[tempTitle];
						}
						var tmpViewGroups = angular.copy($scope.Data.formItem.viewGroups);
						delete $scope.Data.formItem.viewGroups;

						$timeout(function() {
							if (newProperty.isStatic) {
								if (!$scope.Data.formItem.staticSections) {
									$scope.Data.formItem.staticSections = {};
								}
								$scope.Data.formItem.staticSections[tempTitle] = newProperty;
							} else {
								$scope.Data.formItem.properties[tempTitle] = newProperty;
							}
							$scope.Data.formItem.viewGroups = angular.copy(tmpViewGroups);
							angular.forEach($scope.Data.formItem.viewGroups, function(_viewGroup) {
								angular.forEach(_viewGroup.members, function(_member, indexOfMember) {
									if (_member == prop) {
										_viewGroup.members[indexOfMember] = tempTitle;
									}
								});
							});
						}, 1);
					}, function() {
					});
				},
				clearNewProp : function() {
					$scope.Data.newProperty.title = '';
					$scope.Data.newProperty.label = '';
				},

				/*
				 * ********************* Functionality (Up)
				 * *************************
				 */
				onSaveFormClick : function() {
					$scope.Data.formItem["extents"] = $scope.Data.formItem["extents"] || {};
					$scope.Data.newEntityType[$scope.schemaFieldKey] = $scope.Data.formItem;

					$scope.Data.newEntityType = $scope.Func.correctEntityTypeSchemaForSend($scope.Data.newEntityType,$scope.schemaFieldKey);
					
					
					$scope.updateFormFn($scope.Data.newEntityType).then(function() {
						$scope.onReturnClickFn();
					});
					/*
					 * questionnaireSrvc.updatequestionnaire($scope.Data.newEntityType).then(function() {
					 * $state.go("home.management.questionnaire", {}); });
					 */
				},
				onReturnClick : function() {
					$scope.onReturnClickFn();
				},

				/*
				 * ********************* Error Checking (Down)
				 * *************************
				 */
				checkPropInput : function() {
					$scope.hasError = false;
					$scope.hasError_pTitle = false;
					$scope.hasError_pName = false;
					if ($scope.Data.newProperty.title == "") {
						$scope.hasError = true;
						$scope.hasError_pTitle = true;
					}
					if ($scope.Data.newProperty.label == "") {
						$scope.hasError = true;
						$scope.hasError_pName = true;
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

			$scope.droppable = {
				onDrop : "droppable.onDropFunction()",
				onDropFunction : function(event, position) {

					// calculate position in properties list
					$scope.insertPropIndex = 0;
					var elements = document.getElementsByClassName("sortableSchema");
					var tabs = document.getElementsByClassName("bhoechie-tab-content");
					for (var index = 0; index < elements.length; index++) {
						var topPositopn = elements[index].getBoundingClientRect().top - tabs[0].getBoundingClientRect().top;
						if (position.position.top < topPositopn) {
							$scope.insertPropIndex = index;
							break;
						}
					}

					if ($scope.DragNewProp) {
						$scope.Func.clearNewProp();
						$scope.Func.onAddProperty($scope.tabActiveIndex);
						$scope.DragNewProp = false;
						$scope.Func.getFormComponents();
					}
				},
			}

			$scope.Func.getForm();
			$scope.Func.getFormComponents();
			$scope.Func.getRequiredList();
			$scope.schemaFormViewModalApi = {
				isSortable : true,
				selectedViewGroupIndex : $scope.tabActiveIndex,
				onInit : function() {
				},
				onEditPropClick : function(prop) {
					$scope.Func.editProperty(prop);
				},
				onDeletePropertyClick : function(prop) {
					$scope.Func.deleteProp(prop, $scope.tabActiveIndex);
				},
				onAddPropertyClick : function(prop) {
					var tempTitle = prop.title;
					$scope.Func.deleteProp('addProp', $scope.tabActiveIndex);
					delete prop.title;
					$scope.Data.formItem.properties[tempTitle] = prop;
					$scope.Data.formItem.viewGroups[$scope.tabActiveIndex].members.splice($scope.insertPropIndex, 0, tempTitle);
				},
				getDragItem : function() {
					return $scope.Data.dragItem;
				},
				checkDuplicateProp : function(prop) {
					if ($scope.Data.formItem.properties[prop.title] || ($scope.Data.formItem.staticSections && $scope.Data.formItem.staticSections[prop.title]))
						return true;
					return false;
				}
			}
		});