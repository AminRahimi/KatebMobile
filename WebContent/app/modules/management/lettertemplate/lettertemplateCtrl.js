angular.module('lettertemplateModule').controller('lettertemplateCtrl', function($scope, $state, $sce, lettertemplateSrvc) {

	$scope.Data = {
		mode: 'view',
		searchMode: 'none',
		lettertemplateList: [],
		selectedlettertemplate: {
		},
		originallettertemplate: {},
		validationClicked: false
	}
	
	$scope.Func = {
		onAddlettertemplateClick: function(){
			$scope.Data.mode = 'add';
			$scope.Func.reset();
			//CKEDITOR.instances.editor1.document.getBody().setStyle('background-image', "url('app/assets/img/brandIcon.png')");
		},
		onSelectlettertemplate: function(lettertemplate){
			lettertemplateSrvc.getlettertemplate(lettertemplate.uid).then(function(response){
				$scope.Data.selectedlettertemplate = response.data.originalElement;
				$scope.Data.originallettertemplate = angular.copy($scope.Data.selectedlettertemplate);
				// $scope.Data.ckeditor.setData($scope.Data.selectedlettertemplate.textTemplate);
				$scope.Data.mode='view';
			});
		},
		onEditlettertemplateClick: function(){
			$scope.Data.mode = 'edit';
		},
		onSavelettertemplateClick: function(){
			if($scope.lettertemplateForm.$valid){
				// $scope.Data.selectedlettertemplate.textTemplate = $scope.Data.ckeditor.getData();
				lettertemplateSrvc.savelettertemplate($scope.Data.selectedlettertemplate).then(function(response){
					$scope.Controller.lettertemplateListController.refreshList()
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onUpdatelettertemplateClick: function(){
			if($scope.lettertemplateForm.$valid){
				// $scope.Data.selectedlettertemplate.textTemplate = $scope.Data.ckeditor.getData();
				lettertemplateSrvc.updatelettertemplate($scope.Data.selectedlettertemplate).then(function(response){
					$scope.Controller.lettertemplateListController.refreshList()
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onDeletelettertemplateClick: function(){
			lettertemplateSrvc.deletelettertemplate($scope.Data.selectedlettertemplate.uid).then(function(response){
				$scope.Func.resetForm();
				$scope.Func.reset();
				$scope.Controller.lettertemplateListController.refreshList();
			});
		},
		onCancelClick: function(){
			$scope.Data.selectedlettertemplate = angular.copy($scope.Data.originallettertemplate);
			// $scope.Data.ckeditor.setData($scope.Data.originallettertemplate.textTemplate);
			$scope.Func.resetForm();
		},
		
		onChangeSearchModeClick: function(mode){
			$scope.Data.searchMode = mode;
		},
		onSearchClick: function(advancedMode){
			if(advancedMode){
				$scope.Func.onChangeSearchModeClick('advanced');
				$scope.Controller.lettertemplateListController.searchQuery = $scope.Controller.lettertemplateAdvancedSearchController.searchQuery;
				$scope.Controller.lettertemplateListController.searchableFieldInfo = $scope.Controller.lettertemplateAdvancedSearchController.searchableFieldInfo;
			}else{
				$scope.Func.onChangeSearchModeClick('quick');
				$scope.Controller.lettertemplateListController.searchQuery = $scope.Controller.lettertemplateSearchController.searchQuery;
				$scope.Controller.lettertemplateListController.searchableFieldInfo = $scope.Controller.lettertemplateSearchController.searchableFieldInfo;			
			}
			$scope.Controller.lettertemplateListController.refreshList(true);
		},
		onExitSearchModeClick: function(){
			$scope.Func.onChangeSearchModeClick('none');
			$scope.Controller.lettertemplateAdvancedSearchController.searchQuery = {};
			$scope.Controller.lettertemplateSearchController.searchQuery = {};
			$scope.Controller.lettertemplateListController.exitSearchMode();
		},
		
		trustAsHtml: function(string){
			return $sce.trustAsHtml(string);
		},
		reset: function(){
			$scope.Data.selectedlettertemplate = {};
			// $scope.Data.ckeditor.setData("");
		},
		resetForm: function() {
			$scope.Data.mode = 'view';
			$scope.Data.validationClicked = false;
		}
		
	}
	
	$scope.Controller = {
		lettertemplateListController : {
			headers: [
				{key:'name'},
				{key:'enabled'}	
			],
			getList : lettertemplateSrvc.getFulllettertemplateList,
			onListItemSelect : $scope.Func.onSelectlettertemplate,
			searchFunction : lettertemplateSrvc.searchlettertemplate,
		},
		lettertemplateSearchController: {
			advanced: false,
			searchableFieldInfo: [
				{key:"name", type:"string", label:"نام"},
				{key:"enabled", type:"bool", label:"فعال"}
			],
			onSearchClick: $scope.Func.onSearchClick,
			onExitSearchModeClick: $scope.Func.onExitSearchModeClick
		},
		lettertemplateAdvancedSearchController: {
			advanced: true,
			searchableFieldInfo: [
				{key:"name", type:"string", label:"نام"},
				{key:"enabled", type:"bool", label:"فعال"},
				{key:"textTemplate", type:"string", label:"متن قالب"},
			],
			onSearchClick: $scope.Func.onSearchClick,
			onExitSearchModeClick: $scope.Func.onExitSearchModeClick
		}
	}
	
	var Run = function(){
		lettertemplateSrvc.setOrgUid($state.params.orgUid);
		// $scope.Data.ckeditor = CKEDITOR.replace('editor1');
	}
	
	Run();
});