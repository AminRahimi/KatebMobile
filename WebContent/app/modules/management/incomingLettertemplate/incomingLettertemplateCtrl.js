angular.module('incomingLettertemplateModule').controller('incomingLettertemplateCtrl', function($scope, $state, $sce, incomingLettertemplateSrvc) {

	$scope.Data = {
		mode: 'view',
		searchMode: 'none',
		incomingLettertemplateList: [],
		selectedincomingLettertemplate: {
		},
		originalincomingLettertemplate: {},
		validationClicked: false
	}
	
	$scope.Func = {
		onAddincomingLettertemplateClick: function(){
			$scope.Data.mode = 'add';
			$scope.Func.reset();
			//CKEDITOR.instances.editor1.document.getBody().setStyle('background-image', "url('app/assets/img/brandIcon.png')");
		},
		onSelectincomingLettertemplate: function(incomingLettertemplate){
			incomingLettertemplateSrvc.getincomingLettertemplate(incomingLettertemplate.uid).then(function(response){
				$scope.Data.selectedincomingLettertemplate = response.data.originalElement;
				$scope.Data.originalincomingLettertemplate = angular.copy($scope.Data.selectedincomingLettertemplate);
				// $scope.Data.ckeditor.setData($scope.Data.selectedincomingLettertemplate.textTemplate);
				$scope.Data.mode='view';
			});
		},
		onEditincomingLettertemplateClick: function(){
			$scope.Data.mode = 'edit';
		},
		onSaveincomingLettertemplateClick: function(){
			if($scope.incomingLettertemplateForm.$valid){
				// $scope.Data.selectedincomingLettertemplate.textTemplate = $scope.Data.ckeditor.getData();
				incomingLettertemplateSrvc.saveincomingLettertemplate($scope.Data.selectedincomingLettertemplate).then(function(response){
					$scope.Controller.incomingLettertemplateListController.refreshList()
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onUpdateincomingLettertemplateClick: function(){
			if($scope.incomingLettertemplateForm.$valid){
				// $scope.Data.selectedincomingLettertemplate.textTemplate = $scope.Data.ckeditor.getData();
				incomingLettertemplateSrvc.updateincomingLettertemplate($scope.Data.selectedincomingLettertemplate).then(function(response){
					$scope.Controller.incomingLettertemplateListController.refreshList()
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onDeleteincomingLettertemplateClick: function(){
			incomingLettertemplateSrvc.deleteincomingLettertemplate($scope.Data.selectedincomingLettertemplate.uid).then(function(response){
				$scope.Func.resetForm();
				$scope.Func.reset();
				$scope.Controller.incomingLettertemplateListController.refreshList();
			});
		},
		onCancelClick: function(){
			$scope.Data.selectedincomingLettertemplate = angular.copy($scope.Data.originalincomingLettertemplate);
			// $scope.Data.ckeditor.setData($scope.Data.originalincomingLettertemplate.textTemplate);
			$scope.Func.resetForm();
		},
		
		onChangeSearchModeClick: function(mode){
			$scope.Data.searchMode = mode;
		},
		onSearchClick: function(advancedMode){
			if(advancedMode){
				$scope.Func.onChangeSearchModeClick('advanced');
				$scope.Controller.incomingLettertemplateListController.searchQuery = $scope.Controller.incomingLettertemplateAdvancedSearchController.searchQuery;
				$scope.Controller.incomingLettertemplateListController.searchableFieldInfo = $scope.Controller.incomingLettertemplateAdvancedSearchController.searchableFieldInfo;
			}else{
				$scope.Func.onChangeSearchModeClick('quick');
				$scope.Controller.incomingLettertemplateListController.searchQuery = $scope.Controller.incomingLettertemplateSearchController.searchQuery;
				$scope.Controller.incomingLettertemplateListController.searchableFieldInfo = $scope.Controller.incomingLettertemplateSearchController.searchableFieldInfo;			
			}
			$scope.Controller.incomingLettertemplateListController.refreshList(true);
		},
		onExitSearchModeClick: function(){
			$scope.Func.onChangeSearchModeClick('none');
			$scope.Controller.incomingLettertemplateAdvancedSearchController.searchQuery = {};
			$scope.Controller.incomingLettertemplateSearchController.searchQuery = {};
			$scope.Controller.incomingLettertemplateListController.exitSearchMode();
		},
		
		trustAsHtml: function(string){
			return $sce.trustAsHtml(string);
		},
		reset: function(){
			$scope.Data.selectedincomingLettertemplate = {};
			// $scope.Data.ckeditor.setData("");
		},
		resetForm: function() {
			$scope.Data.mode = 'view';
			$scope.Data.validationClicked = false;
		}
		
	}
	
	$scope.Controller = {
		incomingLettertemplateListController : {
			headers: [
				{key:'name'},
				{key:'enabled'}	
			],
			getList : incomingLettertemplateSrvc.getFullincomingLettertemplateList,
			onListItemSelect : $scope.Func.onSelectincomingLettertemplate,
			searchFunction : incomingLettertemplateSrvc.searchincomingLettertemplate,
		},
		incomingLettertemplateSearchController: {
			advanced: false,
			searchableFieldInfo: [
				{key:"name", type:"string", label:"نام"},
				{key:"enabled", type:"bool", label:"فعال"}
			],
			onSearchClick: $scope.Func.onSearchClick,
			onExitSearchModeClick: $scope.Func.onExitSearchModeClick
		},
		incomingLettertemplateAdvancedSearchController: {
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
		incomingLettertemplateSrvc.setOrgUid($state.params.orgUid);
		// $scope.Data.ckeditor = CKEDITOR.replace('editor1');
	}
	
	Run();
});