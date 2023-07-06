angular.module('letterFormTypeModule').controller('letterFormTypeCtrl', function ($scope, $state, letterFormTypeSrvc, utils) {

	$scope.Data = {
		selected: {},
		tmp: {
			selected: null
		},
		mode: "none",
	}

	$scope.Func = {
		events: {
			crud: {
				onGotoEditClick: function () {
					$scope.Data.tmp.selected = $scope.Func.correctForEdit($scope.Data.selected);
					$scope.Func.setMode("edit");
					$scope.Apis.entityTypeCRUD.gotoEditMode();
				},
				onGotoAddClick: function () {
					$scope.Apis.entityTypeCRUD.gotoAddMode();
					$scope.Func.setMode("add");
				},
				onSaveAddingClick: function () {
					var sendingData = angular.copy($scope.Apis.entityTypeCRUD.getFilledModel());
					return letterFormTypeSrvc.add(sendingData, $scope.Data.selected.enabled, sendingData.name).then(function (response) {
						$scope.Apis.grid.refreshList();
						$scope.Func.setMode("view");
					});
				},
				onUpdateClick: function () {
					var sendingData = angular.copy($scope.Apis.entityTypeCRUD.getFilledModel());
					return letterFormTypeSrvc.update(sendingData, $scope.Data.selected.uid, $scope.Data.selected.enabled).then(function (response) {
						$scope.Apis.grid.refreshList();
						$scope.Func.setMode("view");
					});
				},
				onCancelClick: function () {
					$scope.Func.setMode("view");
				},
				onDeleteClick: function () {
					utils.removeConfirmModal().then(function (res) {
						if (res) {
							letterFormTypeSrvc.deleteletterFormType($scope.Data.selected.uid).then(function (response) {
								$scope.Apis.grid.refreshList();
							});
							$scope.Func.setMode("view");
						}
					});
				}
			},
			onGotoDesignFormClick: function () {
				window.open('cm/#/' + $scope.Data.selected.entityType.key + '?page=letterFormType');
			},
			onGotoTreeViewClick: function () {
				$scope.Data.isGridMode = false;
			},
			onGotoGridViewClick: function () {
				$scope.Data.isGridMode = true;
			}

		},
		setMode: function (mode) {
			$scope.Data.mode = mode;
			$scope.Apis.entityTypeCRUD.setMode(mode);
		},
		correctForEdit: function (_selectedObj) {
			var selectedObj = angular.copy(_selectedObj);
			return selectedObj
		},
		select: function (uid) {
			return letterFormTypeSrvc.getletterFormType(uid, true, true).then(function (response) {
				$scope.Data.selected = response.data;
				$scope.Func.setMode("view");
			});
		},
		searchActions: {
			onChangeSearchModeClick: function (mode) {
				$scope.Data.searchMode = mode;
			},
			onSearchClick: function (isAdvancedMode) {
				if (isAdvancedMode) {
					$scope.Func.searchActions.onChangeSearchModeClick('advanced');
					$scope.Apis.grid.searchQuery = $scope.Apis.search.searchQuery;
					$scope.Apis.grid.searchableFieldInfo = $scope.Apis.search.searchableFieldInfo;
				} else {
					$scope.Func.searchActions.onChangeSearchModeClick('quick');
					$scope.Apis.grid.searchQuery = $scope.Apis.search.searchQuery;
					$scope.Apis.grid.searchableFieldInfo = $scope.Apis.search.searchableFieldInfo;
				}
				$scope.Apis.grid.refreshList(true);
			},
			onExitSearchModeClick: function () {
				$scope.Func.searchActions.onChangeSearchModeClick('none');
				$scope.Apis.search.searchQuery = {};
				$scope.Apis.grid.exitSearchMode();
			}
		}
	}

	$scope.Apis = {
		search: {
			advanced: false,
			searchableFieldInfo: [{
				key: "name",
				type: "string",
				label: "نام"
			}],
			onSearchClick: $scope.Func.searchActions.onSearchClick,
			onExitSearchModeClick: $scope.Func.searchActions.onExitSearchModeClick
		},
		grid: {
			headers: [{
				key: 'name'
			},
			{ key: 'enabled' },],
			getList: letterFormTypeSrvc.getletterFormTypeList,
			onListItemSelect: function (selected) {
				$scope.Func.select(selected.uid);
			},
			searchFunction: letterFormTypeSrvc.search,
		},
		entityTypeCRUD: {

		}

	}

	var Run = function () {
		letterFormTypeSrvc.setOrgUid($state.params.orgUid);
	}

	Run();
});