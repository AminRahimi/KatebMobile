angular.module('templateModule').controller('templateCtrl', function($scope, $state, $sce, templateSrvc) {

	$scope.Data = {
		mode: 'view',
		searchMode: 'none',
		templateList: [],
		selectedtemplate: {
		},
		originaltemplate: {},
		validationClicked: false
	}
	
	$scope.Func = {
		onAddtemplateClick: function(){
			$scope.Data.mode = 'add';
			$scope.Func.reset();
			//CKEDITOR.instances.editor1.document.getBody().setStyle('background-image', "url('app/assets/img/brandIcon.png')");
		},
		onSelecttemplate: function(template){
			templateSrvc.gettemplate(template.uid).then(function(response){
				$scope.Data.selectedtemplate = response.data.originalElement;
				$scope.Data.originaltemplate = angular.copy($scope.Data.selectedtemplate);
				// $scope.Data.ckeditor.setData($scope.Data.selectedtemplate.textTemplate);
				$scope.Data.mode='view';
			});
		},
		onEdittemplateClick: function(){
			$scope.Data.mode = 'edit';
		},
		onSavetemplateClick: function(){
			if($scope.templateForm.$valid){
				// $scope.Data.selectedtemplate.textTemplate = $scope.Data.ckeditor.getData();
				templateSrvc.savetemplate($scope.Data.selectedtemplate).then(function(response){
					$scope.Controller.templateListController.refreshList()
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onUpdatetemplateClick: function(){
			if($scope.templateForm.$valid){
				// $scope.Data.selectedtemplate.textTemplate = $scope.Data.ckeditor.getData();
				templateSrvc.updatetemplate($scope.Data.selectedtemplate).then(function(response){
					$scope.Controller.templateListController.refreshList()
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onDeletetemplateClick: function(){
			templateSrvc.deletetemplate($scope.Data.selectedtemplate.uid).then(function(response){
				$scope.Func.resetForm();
				$scope.Func.reset();
				$scope.Controller.templateListController.refreshList();
			});
		},
		onCancelClick: function(){
			$scope.Data.selectedtemplate = angular.copy($scope.Data.originaltemplate);
			// $scope.Data.ckeditor.setData($scope.Data.originaltemplate.textTemplate);
			$scope.Func.resetForm();
		},
		
		onChangeSearchModeClick: function(mode){
			$scope.Data.searchMode = mode;
		},
		onSearchClick: function(advancedMode){
			if(advancedMode){
				$scope.Func.onChangeSearchModeClick('advanced');
				$scope.Controller.templateListController.searchQuery = $scope.Controller.templateAdvancedSearchController.searchQuery;
				$scope.Controller.templateListController.searchableFieldInfo = $scope.Controller.templateAdvancedSearchController.searchableFieldInfo;
			}else{
				$scope.Func.onChangeSearchModeClick('quick');
				$scope.Controller.templateListController.searchQuery = $scope.Controller.templateSearchController.searchQuery;
				$scope.Controller.templateListController.searchableFieldInfo = $scope.Controller.templateSearchController.searchableFieldInfo;			
			}
			$scope.Controller.templateListController.refreshList(true);
		},
		onExitSearchModeClick: function(){
			$scope.Func.onChangeSearchModeClick('none');
			$scope.Controller.templateAdvancedSearchController.searchQuery = {};
			$scope.Controller.templateSearchController.searchQuery = {};
			$scope.Controller.templateListController.exitSearchMode();
		},
		
		trustAsHtml: function(string){
			return $sce.trustAsHtml(string);
		},
		reset: function(){
			$scope.Data.selectedtemplate = {};
			// $scope.Data.ckeditor.setData("");
		},
		resetForm: function() {
			$scope.Data.mode = 'view';
			$scope.Data.validationClicked = false;
		}
		
	}
	
	$scope.Controller = {
		templateListController : {
			headers: [
				{key:'name'},
				{key:'enabled'}	
			],
			getList : templateSrvc.getFulltemplateList,
			onListItemSelect : $scope.Func.onSelecttemplate,
			searchFunction : templateSrvc.searchtemplate,
		},
		templateSearchController: {
			advanced: false,
			searchableFieldInfo: [
				{key:"name", type:"string", label:"نام"},
				{key:"enabled", type:"bool", label:"فعال"}
			],
			onSearchClick: $scope.Func.onSearchClick,
			onExitSearchModeClick: $scope.Func.onExitSearchModeClick
		},
		templateAdvancedSearchController: {
			advanced: true,
			searchableFieldInfo: [
				{key:"name", type:"string", label:"نام"},
				{key:"enabled", type:"bool", label:"فعال"}
			],
			onSearchClick: $scope.Func.onSearchClick,
			onExitSearchModeClick: $scope.Func.onExitSearchModeClick
		}
	}
	
	var Run = function(){
		// templateSrvc.setOrgUid($state.params.orgUid);
		// $scope.Data.ckeditor = CKEDITOR.replace('editor1');
	}
	
	Run();
});