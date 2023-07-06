angular.module('indicatorbookModule').controller('indicatorbookCtrl', function($scope, $state, indicatorbookSrvc) {

	$scope.Data = {
		mode: 'view',
		searchMode: 'none',
		indicatorbookList: [],
		selectedindicatorbook: {
		},
		originalindicatorbook: {},
		validationClicked: false
	}
	
	$scope.Func = {
		onAddindicatorbookClick: function(){
			$scope.Data.mode = 'add';
			$scope.Func.reset();
		},
		onSelectindicatorbook: function(indicatorbook){
			indicatorbookSrvc.getindicatorbook(indicatorbook.uid).then(function(response){
				$scope.Data.selectedindicatorbook = response.data.originalElement;
				$scope.Data.originalindicatorbook = angular.copy($scope.Data.selectedindicatorbook);
				$scope.Data.mode='view';
			});
		},
		onEditindicatorbookClick: function(){
			$scope.Data.mode = 'edit';
		},
		onSaveindicatorbookClick: function(){
			if($scope.indicatorbookForm.$valid){
				indicatorbookSrvc.saveindicatorbook($scope.Data.selectedindicatorbook).then(function(response){
					$scope.Controller.indicatorbookListController.refreshList()
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onUpdateindicatorbookClick: function(){
			if($scope.indicatorbookForm.$valid){
				indicatorbookSrvc.updateindicatorbook($scope.Data.selectedindicatorbook).then(function(response){
					$scope.Controller.indicatorbookListController.refreshList()
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onDeleteindicatorbookClick: function(){
			indicatorbookSrvc.deleteindicatorbook($scope.Data.selectedindicatorbook.uid).then(function(response){
				$scope.Func.resetForm();
				$scope.Func.reset();
				$scope.Controller.indicatorbookListController.refreshList();
			});
		},
		onCancelClick: function(){
			$scope.Data.selectedindicatorbook = angular.copy($scope.Data.originalindicatorbook);
			$scope.Func.resetForm();
		},
		
		onChangeSearchModeClick: function(mode){
			$scope.Data.searchMode = mode;
		},
		onSearchClick: function(advancedMode){
			if(advancedMode){
				$scope.Func.onChangeSearchModeClick('advanced');
				$scope.Controller.indicatorbookListController.searchQuery = $scope.Controller.indicatorbookAdvancedSearchController.searchQuery;
				$scope.Controller.indicatorbookListController.searchableFieldInfo = $scope.Controller.indicatorbookAdvancedSearchController.searchableFieldInfo;
			}else{
				$scope.Func.onChangeSearchModeClick('quick');
				$scope.Controller.indicatorbookListController.searchQuery = $scope.Controller.indicatorbookSearchController.searchQuery;
				$scope.Controller.indicatorbookListController.searchableFieldInfo = $scope.Controller.indicatorbookSearchController.searchableFieldInfo;			
			}
			$scope.Controller.indicatorbookListController.refreshList(true);
		},
		onExitSearchModeClick: function(){
			$scope.Func.onChangeSearchModeClick('none');
			$scope.Controller.indicatorbookAdvancedSearchController.searchQuery = {};
			$scope.Controller.indicatorbookSearchController.searchQuery = {};
			$scope.Controller.indicatorbookListController.exitSearchMode();
		},
		
		reset: function(){
			$scope.Data.selectedindicatorbook = {};
		},
		resetForm: function() {
			$scope.Data.mode = 'view';
			$scope.Data.validationClicked = false;
		}
		
	}
	
	$scope.Controller = {
		indicatorbookListController : {
			headers: [
				{key:'name'},		
				{key:'enabled'},		
				{key:'format',label:"قانون"},		
				{key:'zeroInStartYear',label:"فیلتر همه نامه‌ها"},		
			],
			getList : indicatorbookSrvc.getFullindicatorbookList,
			onListItemSelect : $scope.Func.onSelectindicatorbook,
			searchFunction : indicatorbookSrvc.searchindicatorbook,
		},
		indicatorbookSearchController: {
			advanced: false,
			searchableFieldInfo: [
				{key:"name", type:"string", label:"نام"},
				{key:"enabled", type:"bool", label:"فعال"},
				// {key:"format", type:"string", label:"قانون"}
			],
			onSearchClick: $scope.Func.onSearchClick,
			onExitSearchModeClick: $scope.Func.onExitSearchModeClick
		},
		indicatorbookAdvancedSearchController: {
			advanced: true,
			searchableFieldInfo: [
				{key:"name", type:"string", label:"نام"},
				{key:"enabled", type:"bool", label:"فعال"},
				// {key:"format", type:"string", label:"قانون"},
				{key:"zeroInStartYear", type:"bool", label:"ابتدای سال صفر شود"},
				{key:"counter", type:"integer", label:"شماره شروع"},
			],
			onSearchClick: $scope.Func.onSearchClick,
			onExitSearchModeClick: $scope.Func.onExitSearchModeClick
		}
	}
	
	var Run = function(){
		indicatorbookSrvc.setOrgUid($state.params.orgUid);
	}
	
	Run();
});