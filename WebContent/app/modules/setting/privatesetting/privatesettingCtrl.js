angular.module('privatesettingModule').controller('privatesettingCtrl', function($scope, $rootScope, privatesettingSrvc) {

	$scope.Data = {
		mode: 'view',
		selectedprivatesetting: {
			puas: []
		},
		originalprivatesetting: {
			puas: []
		},
		validationClicked: false
	}
	
	$scope.Func = {
		getprivatesetting: function(){
			privatesettingSrvc.getprivatesetting().then(function(response){
				$scope.Data.selectedprivatesetting = response.data.originalElement;
				$scope.Data.originalprivatesetting = angular.copy($scope.Data.selectedprivatesetting);
				$scope.Data.mode='view';
			});
		},
		onEditprivatesettingClick: function(){
			$scope.Data.mode = 'edit';
		},
		onUpdateprivatesettingClick: function(){
			if($scope.privatesettingForm.$valid){
				privatesettingSrvc.saveprivatesetting($scope.Data.selectedprivatesetting).then(function(response){
					$scope.Controller.privatesettingListController.refreshList()
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onCancelClick: function(){
			$scope.Data.selectedprivatesetting = angular.copy($scope.Data.originalprivatesetting);
			$scope.Func.resetForm();
		},
		
		getpuaList: function(){
			privatesettingSrvc.getpositionUserAssignemtsList().then(function(response){
				$scope.Data.puaList = response.data.originalElement;
			});
		},
		
		reset: function(){
			$scope.Data.selectedprivatesetting = {
				puas: []
			};
		},
		resetForm: function() {
			$scope.Data.mode = 'view';
			$scope.Data.validationClicked = false;
		}
	}
	
	$scope.Controller = {
			multiSelectorsController: {
				multiSelectTranslate : {
					buttonDefaultText : 'انتخاب سمت‌ها',
					searchPlaceholder : 'جستجو',
					checkAll : 'انتخاب همه',
					uncheckAll : 'حذف همه',
					dynamicButtonTextSuffix : 'مورد انتخاب شده'
				},
				multiSelectSettings : {
					externalIdProp : '',
					displayProp : 'title',
					enableSearch : true,
					scrollableHeight : '300px',
					scrollable : true,
					idProp : 'uid',
					showCheckAll : true,
					showUncheckAll : true
				}
			}
	}
	
	var Run = function(){
		privatesettingSrvc.setOrgUid($rootScope.currentUserOrg.uid);
		$scope.Func.getprivatesetting();
		$scope.Func.getpuaList();
	}
	
	Run();
});