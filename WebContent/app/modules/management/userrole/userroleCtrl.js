angular.module('userroleModule').controller('userroleCtrl', function($scope, utils, userroleSrvc) {

	$scope.Data = {
		mode : 'view',
		searchMode : 'none',
		userroleList : [],
		selecteduserrole : {
		},
		originaluserrole : {},
		validationClicked : false,
		featureList : []
	}
	
	$scope.Func = {
		onAdduserroleClick : function(){
			$scope.Data.mode = 'add';
			$scope.Data.selecteduserrole = {features: $scope.Data.featureList};
		},
		onSelectuserrole : function(userrole){
			userroleSrvc.getuserrole(userrole.uid).then(function(response){
				$scope.Data.selecteduserrole = response.data.originalElement;
				$scope.Data.originaluserrole = angular.copy($scope.Data.selecteduserrole);
				$scope.Data.mode='view';
			});
		},
		onEdituserroleClick : function(){
			$scope.Data.mode = 'edit';
		},
		onSaveuserroleClick : function(){
			if($scope.userroleForm.$valid){
				userroleSrvc.saveuserrole($scope.Data.selecteduserrole).then(function(response){
					$scope.Controller.userroleListController.refreshList()
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onUpdateuserroleClick : function(){
			if($scope.userroleForm.$valid){
				userroleSrvc.updateuserrole($scope.Data.selecteduserrole).then(function(response){
					$scope.Controller.userroleListController.refreshList()
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onDeleteuserroleClick : function(){
			utils.removeConfirmModal().then(function (res) {
				if (res) {
					userroleSrvc.deleteuserrole($scope.Data.selecteduserrole.uid).then(function(response){
						$scope.Func.resetForm();
						$scope.Func.reset();
						$scope.Controller.userroleListController.refreshList();
					});
				}
			});
		},
		onCancelClick : function(){
			$scope.Data.selecteduserrole = angular.copy($scope.Data.originaluserrole);
			$scope.Func.resetForm();
		},
		
		onChangeSearchModeClick: function(mode){
			$scope.Data.searchMode = mode;
		},
		onSearchClick : function(advancedMode){
			if(advancedMode){
				$scope.Func.onChangeSearchModeClick('advanced');
				$scope.Controller.userroleListController.searchQuery = $scope.Controller.userroleAdvancedSearchController.searchQuery;
				$scope.Controller.userroleListController.searchableFieldInfo = $scope.Controller.userroleAdvancedSearchController.searchableFieldInfo;
			}else{
				$scope.Func.onChangeSearchModeClick('quick');
				$scope.Controller.userroleListController.searchQuery = $scope.Controller.userroleSearchController.searchQuery;
				$scope.Controller.userroleListController.searchableFieldInfo = $scope.Controller.userroleSearchController.searchableFieldInfo;			
			}
			$scope.Controller.userroleListController.refreshList(true);
		},
		onExitSearchModeClick : function(){
			$scope.Func.onChangeSearchModeClick('none');
			$scope.Controller.userroleAdvancedSearchController.searchQuery = {};
			$scope.Controller.userroleSearchController.searchQuery = {};
			$scope.Controller.userroleListController.exitSearchMode();
		},
		
		getfeatureList : function(){
			userroleSrvc.getExtendfeatureList().then(function(response){
				$scope.Data.featureList = response.data.originalElement;
				_.map($scope.Data.featureList, function(feature) {
					feature.active = false;
					return feature;
				});
			});
		},
		
		reset : function(){
			$scope.Data.selecteduserrole = {};
		},
		resetForm : function() {
			$scope.Data.mode = 'view';
			$scope.Data.validationClicked = false;
		}
	}
	
	$scope.Controller = {
		userroleListController : {
			headers : [
				{key:'name'},		
				{key:'description'},		
			],
			getList : userroleSrvc.getFulluserroleList,
			onListItemSelect : $scope.Func.onSelectuserrole,
			searchFunction : userroleSrvc.searchuserrole,
		},
		userroleSearchController : {
			advanced : false,
			searchableFieldInfo : [
				{key:"name",type:"string",label:"عنوان"},
			],
			onSearchClick : $scope.Func.onSearchClick,
			onExitSearchModeClick : $scope.Func.onExitSearchModeClick
		},
		userroleAdvancedSearchController : {
			advanced : true,
			searchableFieldInfo : [
				{key:"name",type:"string",label:"عنوان"},
				{key:"description",type:"string",label:"توضیحات"},
			],
			onSearchClick : $scope.Func.onSearchClick,
			onExitSearchModeClick : $scope.Func.onExitSearchModeClick
		}
	}
	
	var Run = function(){
		$scope.Func.getfeatureList();
	}
	
	Run();
});