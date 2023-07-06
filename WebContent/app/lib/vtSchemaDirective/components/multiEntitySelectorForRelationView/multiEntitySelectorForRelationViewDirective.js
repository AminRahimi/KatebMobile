angular.module("multiEntitySelectorForRelationView", [ 'multiRelationSelector2' ]).factory('multiEntitySelectorForRelationViewSrvc', function() {
	return {
		correctModel : function(schemaOfFiled, globalModel, propNameOnGlobalModel) {
			delete globalModel[propNameOnGlobalModel];
		},
		findEntityByUIDAndUpdateUID : function(searchingModel, globalModel, propNameOnGlobalModel, newModel, isForward) {

			if (isForward) {
				angular.forEach(globalModel[propNameOnGlobalModel], function(_model) {
					if (_model._uid == searchingModel.destEntityUid) {
						_model._uid = newModel.destEntityUid;
						_model.displayString = (newModel.destination && newModel.destination.displayString) ? newModel.destination.displayString : _model.displayString;
					}
				});
			} else {
				angular.forEach(globalModel[propNameOnGlobalModel], function(_model) {
					if (_model._uid == searchingModel.sourceEntityUid) {
						_model._uid = newModel.sourceEntityUid;
						_model.displayString = (newModel.source && newModel.source.displayString) ? newModel.source.displayString : _model.displayString;
					}
				});
			}

		},
		isRelationInReltionView : function(destEntityFieldName, globalModel, schemaOfForm) {
			var isRelationInReltionView = false;
			angular.forEach(globalModel, function(_model, _propName) {
				if (schemaOfForm.properties[_propName] && schemaOfForm.properties[_propName].typeParams && schemaOfForm.properties[_propName].typeParams.destEntityFieldName && schemaOfForm.properties[_propName].typeParams.destEntityFieldName == destEntityFieldName) {
					return isRelationInReltionView = true;
				}
			});
			return isRelationInReltionView;
		}
	}
}).directive('multiEntitySelectorForRelationView', function() {
	return {
		restrict : 'EAC',
		// replace: true,
		templateUrl : 'app/lib/vtSchemaDirective2/multiEntitySelector/multiEntitySelectorTemplate.html',
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			formModel : "=",
			globSchema : "=",
			api :"="
		},
		controller : function($scope, entitySrvc, $modal, multiRelationSelector2Srvc) {
			$scope.entityKey = $scope.schema.typeParams.destEntityType;
			if ($scope.schema.widgetParams)
				$scope.isAddOnly = $scope.schema.widgetParams.addOnly;

			$scope.openEntityInfoModal = function(entity) {
				var modalInstance = $modal.open({
					templateUrl : 'app/lib/vtSchemaDirective2/entitySelector/partials/entityViewModalTemplate.html',
					controller : 'viewEntityModalCtrl',
					windowClass : 'modal-XLarge',
					backdrop : 'static',
					resolve : {
						entity : function() {
							var tempEntity = angular.copy(entity);
							delete tempEntity.originalElement;
							delete tempEntity['@relationable'];
							return tempEntity;
						},
						entityTypeKey : function() {
							return $scope.entityKey;
						}
					}
				});
				modalInstance.result.then(function(newModel) {
					for (var int = 0; int < $scope.model.length; int++) {
						if ($scope.model[int]._uid == newModel._uid) {
							$scope.model[int] = newModel;
						}
					}

				}, function(a, b, c) {
					// console.log(a,b,c)
				}, function() {
					// console.log(2)
				});
			};

			$scope.openEntityMultiSelectorModal = function() {

				var modalInstance = $modal.open({
					templateUrl : 'app/lib/vtSchemaDirective2/multiEntitySelector/multiEntitySelectorModalTemplate.html',
					controller : 'entityMultiSelectorModalCtrl',
					windowClass : 'modalLarge',
					resolve : {
						entityKey : function() {
							return $scope.entityKey;
						},
						model : function() {
							return angular.copy($scope.model);
						},
						entityType : function() {
							var entityKey = $scope.entityKey;
							return entitySrvc.getEntityType(entityKey);
						}
					}
				});

				modalInstance.result.then(function(selectedItems) {
					$scope.selectedItems = selectedItems;
					if ($scope.selectedItems.length) {
						// check who is deleted or new added
						// for each selected check is not in the model array
						// (tag it removed) and who is new added (tag it added)
						var removedEntityList = [];
						angular.forEach($scope.model, function(_beforSelectedEntity) {
							var isfound = _.find($scope.selectedItems, function(_newSelectedEntity) {
								if (_beforSelectedEntity._uid == _newSelectedEntity._uid) {
									return true
								} else {
									return false
								}
							});
							if (!isfound) {
								removedEntityList.push(_beforSelectedEntity);
							}
						});
						var addedEntityList = [];
						angular.forEach($scope.selectedItems, function(_newSelectedEntity) {
							var isfound = _.find($scope.model, function(_beforSelectedEntity) {
								if (_beforSelectedEntity._uid == _newSelectedEntity._uid) {
									return true
								} else {
									return false
								}
							});
							if (!isfound) {
								addedEntityList.push(_newSelectedEntity);
							}
						});
						

						angular.forEach(removedEntityList, function(_removedEntity) {
							multiRelationSelector2Srvc.addOrUpdateEditedOrUpdatedRelationByRelationViewWidget($scope.schema, _removedEntity, $scope.formModel, $scope.globSchema, $scope.field, "REMOVE");
						});

						
						angular.forEach(addedEntityList, function(_addedEntity) {
							multiRelationSelector2Srvc.addOrUpdateEditedOrUpdatedRelationByRelationViewWidget($scope.schema, _addedEntity, $scope.formModel, $scope.globSchema, $scope.field, "ADD");
						});
						$scope.model = [];
						for (var i = 0; i < $scope.selectedItems.length; i++) {
							$scope.model.push($scope.selectedItems[i]);
						}
					} else {
						angular.forEach($scope.model, function(_removedEntity) {
							multiRelationSelector2Srvc.addOrUpdateEditedOrUpdatedRelationByRelationViewWidget($scope.schema, _removedEntity, $scope.formModel, $scope.globSchema, $scope.field, "REMOVE");
						});
						$scope.model = $scope.selectedItems;
					}

				}, function() {
				});
			};

			$scope.onRemoveEntityClick = function(entity) {

				angular.forEach($scope.model, function(key, index) {
					if (entity._uid === key._uid) {
						$scope.model.splice(index, 1);
						
						multiRelationSelector2Srvc.addOrUpdateEditedOrUpdatedRelationByRelationViewWidget($scope.schema, entity, $scope.formModel, $scope.globSchema, $scope.field, "REMOVE");
						
					}
				});

			};

			$scope.onOpenAddNewEntityModal = function() {

				var modalInstance = $modal.open({
					templateUrl : 'app/lib/vtSchemaDirective2/entitySelector/partials/addEntityModalTemplate.html',
					// FIXME:this (addEntityModalCtrl) is depend on
					// entitySelectorDirective
					controller : 'addEntityModalCtrl',
					windowClass : 'modalLarge',
					backdrop : 'static',
					size : 'lg',
					resolve : {
						entityTypeKey : function() {
							return $scope.entityKey;
						}
					}

				});

				modalInstance.result.then(function(selectedItem) {
					/*
					 * if (!$scope.model) { $scope.model = []; }
					 * 
					 * $scope.model.push(selectedItem);
					 */

					if (selectedItem) {

						if ($scope.selectedItems && angular.isArray($scope.selectedItems)) {
							$scope.selectedItems.push(selectedItem);
						} else {
							$scope.selectedItems = [ selectedItem ];
						}

						multiRelationSelector2Srvc.addOrUpdateEditedOrUpdatedRelationByRelationViewWidget($scope.schema, selectedItem, $scope.formModel, $scope.globSchema, $scope.field, "ADD");

						if ($scope.model && angular.isArray($scope.model)) {
							$scope.model.push(selectedItem);
						} else {
							$scope.model = [ selectedItem ];
						}
					}

				}, function() {
				});
			};
		},
		link : function(scope, element, attrs, ctrls) {
		}
	};
});

angular.module("multiEntitySelectorForRelationView").controller('entityMultiSelectorModalCtrl', function($scope, $modalInstance, entityKey, model, entityType, entitySrvc) {
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
	$scope.onCancelSearchClick = function() {
		getEntityPagedList(entityKey, 1, 10).then(function() {
			$scope.isSearchMode = false;
			$scope.searchingFor.query = "";
		});
	}
	getEntityPagedList(entityKey, 1, 10);

	$scope.jsonSchema = entityType.data.jsonSchema;
	$scope.selectedItems = model || [];
	$scope.searchingFor = {
		query : ""
	};
	$scope.onSearchClick = function() {
		entitySrvc.searchEntity($scope.searchingFor.query, entityKey).then(function(response) {
			$scope.items = response.data[0] ? response.data[0].items : [];
			$scope.isSearchMode = true;
		});
	};
	$scope.ok = function() {
		$modalInstance.close($scope.selectedItems);
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};

	$scope.onSelectItem = function(item) {
		addRemoveFromSelectedItems(item);
	};

	var addRemoveFromSelectedItems = function(item) {
		if (!isInSelectedItems(item, true)) {
			saveToSelectedItems(item);
		}
	};
	var saveToSelectedItems = function(item) {
		$scope.selectedItems.push(item);
	};
	var isInSelectedItems = function(item, doRemove) {
		if ($scope.selectedItems.length) {
			for (var i = 0; i < $scope.selectedItems.length; i++) {
				if (angular.equals(item._uid, $scope.selectedItems[i]._uid)) {
					if (doRemove) {
						$scope.selectedItems.splice(i, i + 1);
					}
					return true;
				}
			}
		}
		return false;

	};

	$scope.isItemSelected = function(item) {
		return isInSelectedItems(item);
	};
});