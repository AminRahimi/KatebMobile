angular.module("vtEntitySelector").controller('vtEntitySelector.entitySelectorModalCtrl', function($scope, $modalInstance, vtEntitySelectorSrvc, entityKey, model) {
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
		return vtEntitySelectorSrvc.getEntityPagedList(entityKey, pageNum, pageSize).then(function(response) {
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

	vtEntitySelectorSrvc.getEntityType(entityKey).then(function(response) {
		$scope.jsonSchema = response.data.jsonSchema;
	});
	$scope.onSearchClick = function() {
		vtEntitySelectorSrvc.searchEntity($scope.searchingFor.query, entityKey).then(function(response) {
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