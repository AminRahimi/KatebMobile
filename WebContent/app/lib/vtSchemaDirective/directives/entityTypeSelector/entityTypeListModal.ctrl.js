angular.module('schemaForm').controller('entityTypeListModalCtrl', function($scope, questionnaireSrvc,$modalInstance) {

	$scope.Data = {
		selected : null
	}

	$scope.Func = {
		getQuestionnaireList : function(start, len) {
			return questionnaireSrvc.getQuestionnaireList(start, len);
		},
		select : function(selected) {
//			return questionnaireSrvc.getQuestionnaire(uid).then(function(response) {
//				$scope.Data.selected = response.data;
//			});
			$modalInstance.close(selected);
		},
		searchActions : {
			onChangeSearchModeClick : function(mode) {
				$scope.Data.searchMode = mode;
			},
			onSearchClick : function(isAdvancedMode) {
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
			onExitSearchModeClick : function() {
				$scope.Func.searchActions.onChangeSearchModeClick('none');
				$scope.Apis.search.searchQuery = {};
				$scope.Apis.grid.exitSearchMode();
			}
		}
	}

	$scope.Apis = {
		search : {
			advanced : false,
			searchableFieldInfo : [ {
				key : "name",
				type : "string",
				label : "نام"
			} ],
			onSearchClick : $scope.Func.searchActions.onSearchClick,
			onExitSearchModeClick : $scope.Func.searchActions.onExitSearchModeClick
		},
		grid : {
			headers : [ {
				key : 'name'
			} ],
			getList : $scope.Func.getQuestionnaireList,
			onListItemSelect : function(selected) {
				$scope.Func.select(selected);
			},
			searchFunction : questionnaireSrvc.search
		},
		entityTypeCRUD : {

		}

	}

	var Run = function() {

	}

	Run();

});
