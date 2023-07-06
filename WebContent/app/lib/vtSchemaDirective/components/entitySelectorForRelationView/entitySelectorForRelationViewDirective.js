angular.module("entitySelectorForRelationView", []).factory('entitySelectorForRelationViewSrvc', function() {
	return {
		correctModel : function(schemaOfFiled, globalModel, propNameOnGlobalModel) {
			delete globalModel[propNameOnGlobalModel];
		},
		findEntityByUIDAndUpdateUID : function(searchingModel, globalModel, propNameOnGlobalModel, newModel, isForward) {

			if (isForward) {
				globalModel[propNameOnGlobalModel]._uid = newModel.destEntityUid;
				globalModel[propNameOnGlobalModel]._displayString = (newModel.destination && newModel.destination._displayString) ? newModel.destination._displayString : globalModel[propNameOnGlobalModel]._displayString;

			} else {
				globalModel[propNameOnGlobalModel]._uid = newModel.sourceEntityUid;
				globalModel[propNameOnGlobalModel]._displayString = (newModel.source && newModel.source._displayString) ? newModel.source._displayString : globalModel[propNameOnGlobalModel]._displayString;
			}

		},
		correctDataModelForForm : function(globSchema, globalModel, propNameOnGlobalModel) {
			if (globalModel[propNameOnGlobalModel]["forward"]) {

				angular.forEach(globalModel[propNameOnGlobalModel]["forward"], function(forwardRelation) {
					if (forwardRelation.sourceEntityFieldName) {
						if (globSchema.properties[forwardRelation.sourceEntityFieldName] && globSchema.properties[forwardRelation.sourceEntityFieldName].multiple) {
							angular.isArray(globalModel[forwardRelation.sourceEntityFieldName]) ? globalModel[forwardRelation.sourceEntityFieldName].push({
								_uid : forwardRelation.destEntityUid,
								_displayString : forwardRelation.destEntityData?forwardRelation.destEntityData._displayString:""
							}) : globalModel[forwardRelation.sourceEntityFieldName] = [ {
								_uid : forwardRelation.destEntityUid,
								_displayString : forwardRelation.destEntityData ? forwardRelation.destEntityData._displayString:""
							} ];
						} else {
							globalModel[forwardRelation.sourceEntityFieldName] = {
								_uid : forwardRelation.destEntityUid,
								_displayString : forwardRelation.destEntityData ? forwardRelation.destEntityData._displayString:""
							}
						}

					}
				});

			}
			if (globalModel[propNameOnGlobalModel]["backward"]) {
				angular.forEach(globalModel[propNameOnGlobalModel]["backward"], function(backwardRelation) {
					if (backwardRelation.destEntityFieldName) {
						if (globSchema.properties[backwardRelation.destEntityFieldName] && globSchema.properties[backwardRelation.destEntityFieldName].multiple) {
							angular.isArray(globalModel[backwardRelation.destEntityFieldName]) ? globalModel[backwardRelation.destEntityFieldName].push({
								_uid : backwardRelation.sourceEntityUid,
								_displayString : backwardRelation.sourceEntityData?backwardRelation.sourceEntityData._displayString:""
							}) : globalModel[backwardRelation.destEntityFieldName] = [ {
								_uid : backwardRelation.sourceEntityUid,
								_displayString : backwardRelation.sourceEntityData?backwardRelation.sourceEntityData._displayString:""
							} ];
						} else {
							globalModel[backwardRelation.destEntityFieldName] = {
								_uid : backwardRelation.sourceEntityUid,
								_displayString : backwardRelation.sourceEntityData?backwardRelation.sourceEntityData._displayString:""
							}
						}

					}
				});
			}
		}
	}
}).directive('entitySelectorForRelationView', function($compile) {
	return {
		restrict : 'EAC',
		// replace: true,
		templateUrl : 'app/lib/vtSchemaDirective2/entitySelectorForRelationView/entitySelectorForRelationViewTemplate.html',
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			disable : "=",
			formModel : "=",
			api :"="
		},
		// h ['persianDatepicker', '?^ngModel'],
		controller : function($scope, entitySrvc, $modal,entitySelectorSrvc) {
			// entitySelectorModalTemplate.html
			$scope.entityKey = $scope.schema.typeParams.destEntityType;
			if ($scope.schema.widgetParams)
				$scope.isAddOnly = $scope.schema.widgetParams.addOnly;
			
			
			$scope.onRemoveSelectedClick=function(){
				$scope.model= $scope.selectedItem =undefined;
			}
			
			$scope.onEditSelectedClick = function(){
				entitySelectorSrvc.openEntityInfoModal($scope.model,$scope.entityKey).then(function(newModel){
					$scope.model._displayString = newModel._displayString;
				});
			}
			

			$scope.openEntityInfoModal = function(entity) {
				var modalInstance = $modal.open({
					templateUrl : 'app/lib/vtSchemaDirective2/entitySelectorForRelationView/partials/entityViewModalTemplate.html',
					controller : 'viewEntityModalCtrl',
					windowClass : 'modal-XLarge',
					backdrop : 'static',
					resolve : {
						entity : function() {
							return entity;
						},
						entityTypeKey : function() {
							return $scope.entityKey;
						}
					}
				});
				modalInstance.result.then(function(newModel) {
					$scope.model = angular.copy(newModel);

				}, function(a, b, c) {
					// console.log(a,b,c)
				}, function() {
					// console.log(2)
				});
			};

			$scope.openEntitySelectorModal = function() {

				var modalInstance = $modal.open({
					templateUrl : 'app/lib/vtSchemaDirective2/entitySelectorForRelationView/entitySelectorForRelationViewModalTemplate.html',
					controller : 'entitySelectorForRelationViewModalCtrl',
					windowClass : 'modal-XLarge',
					resolve : {
						/*
						 * items : function() { var entityKey =
						 * $scope.schema.widget.split("_")[1]; return
						 * entitySrvc.getEntityList(entityKey); },
						 */
						entityKey : function() {
							return $scope.schema.typeParams.destEntityType;
						},
						model : function() {
							return $scope.model;
						}
					}

				});

				modalInstance.result.then(function(selectedItem) {
					$scope.selectedItem = selectedItem;
					$scope.model = $scope.selectedItem;
					correct__$relationsModel();
					// $scope.model.display = $scope.model._uid

				}, function() {
				});
			};
			var correct__$relationsModel = function() {
				var isRelationOn__$relations = false;
				$scope.model.destEntityFieldName = $scope.schema.typeParams.destEntityFieldName;
				if ($scope.formModel['@relationable'] && $scope.formModel['@relationable']['forward']) {
					angular.forEach($scope.formModel['@relationable']['forward'], function(_relation) {
						if (_relation.sourceEntityFieldName == $scope.field) {
							isRelationOn__$relations = true;
							_relation.destEntityUid = $scope.model._uid;
							_relation.destEntityData = {
								_displayString : $scope.model._displayString
							}
							_relation.sourceEntityFieldName = $scope.field;
							if (_relation.isEdited || (!_relation.isEdited && !_relation.isAdded && !_relation.isDeleted)) {
								_relation.isEdited = true;
							}
						}
					});
				}
				if (!isRelationOn__$relations) {
					var tempRelation = angular.extend({
						destEntityUid : $scope.model._uid
					}, $scope.schema.typeParams);
					// $scope.schema.destEntityUid = entityModel[fieldName];
					tempRelation.isAdded = true;
					tempRelation.destEntityData = {
						_displayString : $scope.model._displayString
					}
					tempRelation.sourceEntityFieldName = $scope.field;
					if ($scope.formModel['@relationable'] && $scope.formModel['@relationable']['forward']) {
						$scope.formModel['@relationable']['forward'].push(tempRelation);
					} else if ($scope.formModel['@relationable'] && !$scope.formModel['@relationable']['forward']) {
						$scope.formModel['@relationable']['forward'] = [ tempRelation ];
					} else {
						$scope.formModel['@relationable'] = {
							'forward' : [ tempRelation ]
						};
					}
				}
			}
			$scope.onOpenAddNewEntityModal = function() {
				var modalInstance = $modal.open({
					templateUrl : 'app/lib/vtSchemaDirective2/entitySelectorForRelationView/partials/addEntityModalTemplate.html',
					controller : 'addEntityModalCtrl',
					windowClass : 'modalLarge',
					backdrop : 'static',
					size : 'lg',
					resolve : {
						entityTypeKey : function() {
							return $scope.schema.typeParams.destEntityType;
						}
					}

				});

				modalInstance.result.then(function(selectedItem) {
					$scope.selectedItem = selectedItem;
					$scope.model = $scope.selectedItem;
					correct__$relationsModel();
				}, function() {
				});
			};

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

angular.module("entitySelectorForRelationView").controller('entitySelectorForRelationViewModalCtrl', function($scope, $modalInstance, entitySrvc, entityKey, model) {
	$scope.itemsPagination = {
		totalItems : -1,
		currentPage : 1,
		perPage : 10,
		maxSize : 5,
		pageChanged : function() {
			getEntityPagedList(entityKey, parseInt($scope.itemsPagination.currentPage), 10);
		}
	};
	$scope.isSearchMode = false;
	var getEntityPagedList = function(entityKey, pageNum, pageSize) {
		return entitySrvc.getEntityPagedList(entityKey, pageNum, pageSize).then(function(response) {
			$scope.items = response.data;
			$scope.itemsPagination.totalItems = response.data.totalCount;
		});
	};
	getEntityPagedList(entityKey, 1, 10);

	$scope.selectedItem = model || {};

	// $scope.selectedItem = {};

	$scope.searchingFor = {
		query : ""
	};

	entitySrvc.getEntityType(entityKey).then(function(response) {
		$scope.jsonSchema = response.data.jsonSchema;
	});
	$scope.onSearchClick = function() {
		entitySrvc.searchEntity($scope.searchingFor.query, entityKey).then(function(response) {
			if (response.data[0]) {
				$scope.items = response.data[0].items;

			} else {
				$scope.items = null;
			}

			$scope.isSearchMode = true;
		});
	};
	$scope.onCancelSearchClick = function() {
		getEntityPagedList(entityKey, 1, 10).then(function() {
			$scope.isSearchMode = false;
			$scope.searchingFor.query = "";
		});
	}

	$scope.ok = function() {
		$modalInstance.close($scope.selectedItem);
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};

	$scope.onSelectItem = function(item) {
		selectItem(item);
	};

	var selectItem = function(item) {
		$scope.selectedItem = item;
	};

	$scope.isItemSelected = function(item) {
		return angular.equals(item, $scope.selectedItem);
	};
});


