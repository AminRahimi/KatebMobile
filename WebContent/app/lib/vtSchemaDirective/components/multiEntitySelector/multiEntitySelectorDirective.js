angular.module("schemaForm").directive('multiEntitySelector', function() {
	return {
		restrict : 'EAC',
		// replace: true,
		require: 'ngModel',
		templateUrl : 'app/lib/vtSchemaDirective/components/multiEntitySelector/multiEntitySelectorTemplate.html',
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			api:"="
		},
		controller : function($scope, entitySrvc, $modal) {
			$scope.entityKey = $scope.schema.type;
			if ($scope.schema.widgetParams)
				$scope.isAddOnly = $scope.schema.widgetParams.addOnly;

			$scope.openEntityInfoModal = function(entity) {
				var modalInstance = $modal.open({
					templateUrl : 'app/lib/vtSchemaDirective/components/entitySelector/partials/entityViewModalTemplate.html',
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
					templateUrl : 'app/lib/vtSchemaDirective/components/multiEntitySelector/multiEntitySelectorModalTemplate.html',
					controller : 'entityMultiSelectorModalCtrl',
					windowClass : 'modalLarge',
					resolve : {
						entityKey : function() {
							return $scope.entityKey;
						},
						model : function() {
							return $scope.model;
						},
						entityType : function() {
							var entityKey = $scope.schema.type;
							return entitySrvc.getEntityType(entityKey);
						}
					}
				});

				modalInstance.result.then(function(selectedItems) {
					$scope.ngModel.$setDirty();
					$scope.selectedItems = selectedItems;
					if ($scope.selectedItems.length) {
						$scope.model = [];
						for (var i = 0; i < $scope.selectedItems.length; i++) {
							$scope.model.push($scope.selectedItems[i]);
						}
					}

				}, function() {
				});
			};

			$scope.onRemoveEntityClick = function(entity) {
				$scope.ngModel.$setDirty();
				angular.forEach($scope.model, function(key, index) {
					if (entity._uid === key._uid) {
						$scope.model.splice(index, 1);
					}
				});

			};

			$scope.onOpenAddNewEntityModal = function() {

				var modalInstance = $modal.open({
					templateUrl : 'app/lib/vtSchemaDirective/components/entitySelector/partials/addEntityModalTemplate.html',
					// FIXME:this (addEntityModalCtrl) is depend on
					// entitySelectorDirective
					controller : 'addEntityModalCtrl',
					windowClass : 'modalLarge',
					backdrop : 'static',
					size : 'lg',
					resolve : {
						entityTypeKey : function() {
							return $scope.schema.type;
						}
					}

				});

				modalInstance.result.then(function(selectedItem) {
					$scope.ngModel.$setDirty();
					if (!$scope.model) {
						$scope.model = [];
					}
					$scope.model.push(selectedItem);
				}, function() {
				});
			};
		},
		link : function(scope, element, attrs, ctrls) {
			scope.ngModel = ctrls;
		}
	};
});

angular.module("schemaForm").controller('entityMultiSelectorModalCtrl', function($scope, $modalInstance, entityKey, model, entityType, entitySrvc) {
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
						$scope.onRemove(i);
					}
					return true;
				}
			}
		}
		return false;

	};
	
	$scope.onRemove = function(i){
		$scope.selectedItems.splice(i, 1);
	}

	$scope.isItemSelected = function(item) {
		return isInSelectedItems(item);
	};
});