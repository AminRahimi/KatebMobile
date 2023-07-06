angular.module('hameshhotkeyModule').controller('hameshhotkeyCtrl', function($scope, $state, hameshhotkeySrvc) {

	$scope.Data = {
		mode: 'view',
		searchMode: 'none',
		hameshhotkeyList: [],
		selectedhameshhotkey: {
		},
		originalhameshhotkey: {},
		validationClicked: false
	}
	
	$scope.Func = {
		onAddhameshhotkeyClick: function(){
			$scope.Data.mode = 'add';
			$scope.Func.reset();
		},
		onSelecthameshhotkey: function(hameshhotkey){
			hameshhotkeySrvc.gethameshhotkey(hameshhotkey.uid).then(function(response){
				$scope.Data.selectedhameshhotkey = response.data.originalElement;
				$scope.Data.originalhameshhotkey = angular.copy($scope.Data.selectedhameshhotkey);
				$scope.Data.mode='view';
			});
		},
		onEdithameshhotkeyClick: function(){
			$scope.Data.mode = 'edit';
		},
		onSavehameshhotkeyClick: function(){
			if($scope.hameshhotkeyForm.$valid){
				hameshhotkeySrvc.savehameshhotkey($scope.Data.selectedhameshhotkey).then(function(response){
					$scope.Controller.hameshhotkeyListController.refreshList()
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onUpdatehameshhotkeyClick: function(){
			if($scope.hameshhotkeyForm.$valid){
				hameshhotkeySrvc.updatehameshhotkey($scope.Data.selectedhameshhotkey).then(function(response){
					$scope.Controller.hameshhotkeyListController.refreshList()
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onDeletehameshhotkeyClick: function(){
			hameshhotkeySrvc.deletehameshhotkey($scope.Data.selectedhameshhotkey.uid).then(function(response){
				$scope.Func.resetForm();
				$scope.Func.reset();
				$scope.Controller.hameshhotkeyListController.refreshList();
			});
		},
		onCancelClick: function(){
			$scope.Data.selectedhameshhotkey = angular.copy($scope.Data.originalhameshhotkey);
			$scope.Func.resetForm();
		},
		
		onChangeSearchModeClick: function(mode){
			$scope.Data.searchMode = mode;
		},
		onSearchClick: function(advancedMode){
			if(advancedMode){
				$scope.Func.onChangeSearchModeClick('advanced');
				$scope.Controller.hameshhotkeyListController.searchQuery = $scope.Controller.hameshhotkeyAdvancedSearchController.searchQuery;
				$scope.Controller.hameshhotkeyListController.searchableFieldInfo = $scope.Controller.hameshhotkeyAdvancedSearchController.searchableFieldInfo;
			}else{
				$scope.Func.onChangeSearchModeClick('quick');
				$scope.Controller.hameshhotkeyListController.searchQuery = $scope.Controller.hameshhotkeySearchController.searchQuery;
				$scope.Controller.hameshhotkeyListController.searchableFieldInfo = $scope.Controller.hameshhotkeySearchController.searchableFieldInfo;			
			}
			$scope.Controller.hameshhotkeyListController.refreshList(true);
		},
		onExitSearchModeClick: function(){
			$scope.Func.onChangeSearchModeClick('none');
			$scope.Controller.hameshhotkeyAdvancedSearchController.searchQuery = {};
			$scope.Controller.hameshhotkeySearchController.searchQuery = {};
			$scope.Controller.hameshhotkeyListController.exitSearchMode();
		},
		
		reset: function(){
			$scope.Data.selectedhameshhotkey = {};
		},
		resetForm: function() {
			$scope.Data.mode = 'view';
			$scope.Data.validationClicked = false;
		}
		
	}
	
	$scope.Controller = {
		hameshhotkeyListController : {
			headers: [
				{key:'order'},
				{key:'name'},
				{key:'content'},		
				{key:'hotkey'},		
			],
			getList : hameshhotkeySrvc.getFullhameshhotkeyList,
			onListItemSelect : $scope.Func.onSelecthameshhotkey,
			searchFunction : hameshhotkeySrvc.searchhameshhotkey,
		},
		hameshhotkeySearchController: {
			advanced: false,
			searchableFieldInfo: [
				{key:"name", type:"string", label:"نام"},
				{key:"content", type:"string", label:"متن هامش"}
			],
			onSearchClick: $scope.Func.onSearchClick,
			onExitSearchModeClick: $scope.Func.onExitSearchModeClick
		},
		hameshhotkeyAdvancedSearchController: {
			advanced: true,
			searchableFieldInfo: [
				{key:"name", type:"string", label:"نام"},
				{key:"content", type:"string", label:"متن هامش"},
				{key:"hotkey", type:"string", label:"کلید میانبر"},
				{key:"order", type:"integer", label:"ترتیب"},
			],
			onSearchClick: $scope.Func.onSearchClick,
			onExitSearchModeClick: $scope.Func.onExitSearchModeClick
		}
	}
	
	var Run = function(){
		hameshhotkeySrvc.setOrgUid($state.params.orgUid);
	}
	
	Run();
});