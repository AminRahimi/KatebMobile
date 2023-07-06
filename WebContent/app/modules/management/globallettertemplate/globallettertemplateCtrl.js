angular.module('globallettertemplateModule').controller('globallettertemplateCtrl', function($scope, $state, $sce, globallettertemplateSrvc) {

	$scope.Data = {
		mode: 'view',
		searchMode: 'none',
		globallettertemplateList: [],
		selectedgloballettertemplate: {
		},
		originalgloballettertemplate: {},
		validationClicked: false
	}
	
	$scope.Func = {
		onAddGlobalLetterTemplateClick: function(){
			$scope.Data.mode = 'add';
			$scope.Func.reset();
			//CKEDITOR.instances.editor1.document.getBody().setStyle('background-image', "url('app/assets/img/brandIcon.png')");
		},
		onSelectGlobalLetterTemplate: function(globallettertemplate){
			globallettertemplateSrvc.getGlobalLetterTemplate(globallettertemplate.uid).then(function(response){
				$scope.Data.selectedgloballettertemplate = response.data.originalElement;
				$scope.Data.originalgloballettertemplate = angular.copy($scope.Data.selectedgloballettertemplate);
				$scope.Data.ckeditor.setData($scope.Data.selectedgloballettertemplate.data.textBody);
				$scope.Data.mode='view';
			});
		},
		onEditgloballettertemplateClick: function(){
			$scope.Data.mode = 'edit';
		},
		onSavegloballettertemplateClick: function(){
			if($scope.globallettertemplateForm.$valid){
				$scope.Data.selectedgloballettertemplate.data = {'bodyType':'text' ,'textBody': $scope.Data.ckeditor.getData()};
				globallettertemplateSrvc.savegloballettertemplate($scope.Data.selectedgloballettertemplate).then(function(response){
					$scope.Controller.globalLetterTemplateListController.refreshList();
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onUpdategloballettertemplateClick: function(){
			if($scope.globallettertemplateForm.$valid){
				$scope.Data.selectedgloballettertemplate.data = {'bodyType':'text' ,'textBody': $scope.Data.ckeditor.getData()};
				globallettertemplateSrvc.updategloballettertemplate($scope.Data.selectedgloballettertemplate).then(function(response){
					$scope.Controller.globalLetterTemplateListController.refreshList()
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onDeletegloballettertemplateClick: function(){
			globallettertemplateSrvc.deletegloballettertemplate($scope.Data.selectedgloballettertemplate.uid).then(function(response){
				$scope.Func.resetForm();
				$scope.Func.reset();
				$scope.Controller.globalLetterTemplateListController.refreshList();
			});
		},
		onCancelClick: function(){
			$scope.Data.selectedgloballettertemplate = angular.copy($scope.Data.originalgloballettertemplate);
			$scope.Data.ckeditor.setData($scope.Data.originalgloballettertemplate.data.textBody);
			$scope.Func.resetForm();
		},
		
		onChangeSearchModeClick: function(mode){
			$scope.Data.searchMode = mode;
		},
		onSearchClick: function(advancedMode){
			if(advancedMode){
				$scope.Func.onChangeSearchModeClick('advanced');
				$scope.Controller.globalLetterTemplateListController.searchQuery = $scope.Controller.globallettertemplateAdvancedSearchController.searchQuery;
				$scope.Controller.globalLetterTemplateListController.searchableFieldInfo = $scope.Controller.globallettertemplateAdvancedSearchController.searchableFieldInfo;
			}else{
				$scope.Func.onChangeSearchModeClick('quick');
				$scope.Controller.globalLetterTemplateListController.searchQuery = $scope.Controller.globalLetterTemplateSearchController.searchQuery;
				$scope.Controller.globalLetterTemplateListController.searchableFieldInfo = $scope.Controller.globalLetterTemplateSearchController.searchableFieldInfo;
			}
			$scope.Controller.globalLetterTemplateListController.refreshList(true);
		},
		onExitSearchModeClick: function(){
			$scope.Func.onChangeSearchModeClick('none');
			$scope.Controller.globallettertemplateAdvancedSearchController.searchQuery = {};
			$scope.Controller.globalLetterTemplateSearchController.searchQuery = {};
			$scope.Controller.globalLetterTemplateListController.exitSearchMode();
		},
		
		trustAsHtml: function(string){
			return $sce.trustAsHtml(string);
		},
		reset: function(){
			$scope.Data.selectedgloballettertemplate = {};
			$scope.Data.ckeditor.setData("");
		},
		resetForm: function() {
			$scope.Data.mode = 'view';
			$scope.Data.validationClicked = false;
		}
		
	}
	
	$scope.Controller = {
		globalLetterTemplateListController : {
			headers: [
				{key:'name'},
				{key:'enabled'}	
			],
			getList : globallettertemplateSrvc.getFullGlobalLetterTemplateList,
			onListItemSelect : $scope.Func.onSelectGlobalLetterTemplate,
			searchFunction : globallettertemplateSrvc.searchGlobalLetterTemplate,
		},
		globalLetterTemplateSearchController: {
			advanced: false,
			searchableFieldInfo: [
				{key:"name", type:"string", label:"نام"},
				{key:"enabled", type:"bool", label:"فعال"}
			],
			onSearchClick: $scope.Func.onSearchClick,
			onExitSearchModeClick: $scope.Func.onExitSearchModeClick
		},
		globallettertemplateAdvancedSearchController: {
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
		globallettertemplateSrvc.setOrgUid();
		// $scope.Data.ckeditor = CKEDITOR.replace('editor1');
		CKEditor5.editorClassic.ClassicEditor.create(
			document.querySelector( '#editor1' ),
			angular.module('app').ckeditorConfig).then(function(editor){
			$scope.Data.ckeditor = editor;
		});
	}
	
	Run();
});