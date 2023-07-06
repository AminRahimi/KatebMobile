angular.module('groupModule').controller('groupCtrl', function($scope, $state, groupSrvc, utils) {

	$scope.Data = {
		mode: 'view',
		searchMode: 'none',
		groupList: [],
		selectedgroup: {
			container: {
				users: [],
				positions: [],
				positionUserAssignemts: []
			}
		},
		originalgroup: {
			container: {
				users: [],
				positions: [],
				positionUserAssignemts: []
			}
		},
		validationClicked: false
	}
	
	$scope.Func = {
		onAddgroupClick: function(){
			$scope.Data.mode = 'add';
			$scope.Func.reset();
		},
		onSelectgroup: function(group){
			groupSrvc.getgroup(group.uid).then(function(response){
				$scope.Data.selectedgroup = response.data.originalElement;
				$scope.Data.originalgroup = angular.copy($scope.Data.selectedgroup);
				$scope.Data.mode='view';
			});
		},
		onEditgroupClick: function(){
			$scope.Data.mode = 'edit';
		},
		onSavegroupClick: function(){
			if($scope.groupForm.$valid){
				groupSrvc.savegroup($scope.Data.selectedgroup).then(function(response){
					$scope.Controller.groupListController.refreshList()
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onUpdategroupClick: function(){
			if($scope.groupForm.$valid){
				groupSrvc.updategroup($scope.Data.selectedgroup).then(function(response){
					$scope.Controller.groupListController.refreshList()
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onDeletegroupClick: function(){
			utils.removeConfirmModal().then(function (res) {
				if(res) {
					groupSrvc.deletegroup($scope.Data.selectedgroup.uid).then(function(response){
						$scope.Func.resetForm();
						$scope.Func.reset();
						$scope.Controller.groupListController.refreshList();
					});
				}
			});
		},
		onCancelClick: function(){
			$scope.Data.selectedgroup = angular.copy($scope.Data.originalgroup);
			$scope.Func.resetForm();
		},
		
		onChangeSearchModeClick: function(mode){
			$scope.Data.searchMode = mode;
		},
		onSearchClick: function(advancedMode){
			if(advancedMode){
				$scope.Func.onChangeSearchModeClick('advanced');
				$scope.Controller.groupListController.searchQuery = $scope.Controller.groupAdvancedSearchController.searchQuery;
				$scope.Controller.groupListController.searchableFieldInfo = $scope.Controller.groupAdvancedSearchController.searchableFieldInfo;
			}else{
				$scope.Func.onChangeSearchModeClick('quick');
				$scope.Controller.groupListController.searchQuery = $scope.Controller.groupSearchController.searchQuery;
				$scope.Controller.groupListController.searchableFieldInfo = $scope.Controller.groupSearchController.searchableFieldInfo;			
			}
			$scope.Controller.groupListController.refreshList(true);
		},
		onExitSearchModeClick: function(){
			$scope.Func.onChangeSearchModeClick('none');
			$scope.Controller.groupAdvancedSearchController.searchQuery = {};
			$scope.Controller.groupSearchController.searchQuery = {};
			$scope.Controller.groupListController.exitSearchMode();
		},
		
		reset: function(){
			$scope.Data.selectedgroup = {
				container: {
					users: [],
					positions: [],
					positionUserAssignemts: []
				}
			};
		},
		resetForm: function() {
			$scope.Data.mode = 'view';
			$scope.Data.validationClicked = false;
		}
		
	};
	
	$scope.Controller = {
		groupListController : {
			headers: [
				{key:'name'}
			],
			getList : groupSrvc.getFullgroupList,
			onListItemSelect : $scope.Func.onSelectgroup,
			searchFunction : groupSrvc.searchgroup,
		},
		groupSearchController: {
			advanced: false,
			searchableFieldInfo: [
				{key:"name", type:"string", label:"نام"},
			],
			onSearchClick: $scope.Func.onSearchClick,
			onExitSearchModeClick: $scope.Func.onExitSearchModeClick
		},
		groupAdvancedSearchController: {
			advanced: true,
			searchableFieldInfo: [
				{key:"name", type:"string", label:"نام"},
			],
			onSearchClick: $scope.Func.onSearchClick,
			onExitSearchModeClick: $scope.Func.onExitSearchModeClick
		},
		userTypeaheadApi: {
			getList: groupSrvc.getUserList
		},
		positionsTypeaheadApi: {
			getList: groupSrvc.getPositionList
		},
		positionUserAssignemtsTypeaheadApi: {
			getList: groupSrvc.getpositionUserAssignemtsList
		}
	};
	
	var Run = function(){
		groupSrvc.setOrgUid($state.params.orgUid);
	};
	
	Run();
});