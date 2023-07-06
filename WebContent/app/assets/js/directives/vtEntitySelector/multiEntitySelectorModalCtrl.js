angular.module("vtEntitySelector").controller('vtMultiEntitySelector.multiEntitySelectorModalCtrl', function($scope, $modalInstance, entityKey, model, entityType, vtEntitySelectorSrvc) {
	$scope.itemsPagination = {
		totalItems : -1,
		currentPage : 1,
		perPage : 10,
		maxSize : 5,
		show : false,
		pageChanged : function() {
			getEntityPagedList(entityKey, parseInt($scope.itemsPagination.currentPage), 10);
		}
	};
	$scope.isSearchMode = false;
	var getEntityPagedList = function(entityKey, pageNum, pageSize) {
		return vtEntitySelectorSrvc.getEntityPagedList(entityKey, pageNum, pageSize).then(function(response) {
			$scope.items = response.data;
			$scope.itemsPagination.totalItems = response.data.totalCount;
			if ($scope.itemsPagination.totalItems <= $scope.itemsPagination.perPage) {
				$scope.itemsPagination.show = false;
			} else {
				$scope.itemsPagination.show = true;
			}
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
		vtEntitySelectorSrvc.searchEntity($scope.searchingFor.query, entityKey).then(function(response) {
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