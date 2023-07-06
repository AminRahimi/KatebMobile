angular.module('secretariatManagementModule').controller('secretariatManagementCtrl', 
		function($scope, $state, secretariatManagementSrvc) {

	$scope.Data = {
		mode: 'view',
		searchMode: 'none',
		secretariatList: [],
		selectedsecretariat: {
			indicatorBookRecievers: [],
			indicatorBookSenders: [],
			secretariesPositionAssignments: []
		},
		originalsecretariat: {
			indicatorBookRecievers: [],
			indicatorBookSenders: []
		},
		getindicatorList: [],
		secretaryPositionList: [],
		validationClicked: false
	}
	
	$scope.Func = {
		onAddsecretariatClick: function(){
			$scope.Data.mode = 'add';
			$scope.Func.reset();
		},
		onSelectsecretariat: function(secretariat){
			secretariatManagementSrvc.getsecretariat(secretariat.uid).then(function(response){
				if(!response.data.originalElement.indicatorBookSenders)response.data.originalElement.indicatorBookSenders=[];
				if(!response.data.originalElement.indicatorBookRecievers)response.data.originalElement.indicatorBookRecievers=[];
				$scope.Data.selectedsecretariat = response.data.originalElement;
				$scope.Data.originalsecretariat = angular.copy($scope.Data.selectedsecretariat);
				$scope.Func.initiatesecretaryPosition();
				$scope.Data.mode='view';
			});
		},
		onEditsecretariatClick: function(){
			$scope.Data.mode = 'edit';
			$scope.Func.setSecretariatPosition();
		},
		onSavesecretariatClick: function(){
			if($scope.secretariatForm.$valid){
				secretariatManagementSrvc.savesecretariat($scope.Data.selectedsecretariat).then(function(response){
					$scope.Controller.secretariatListController.refreshList()
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onUpdatesecretariatClick: function(){
			if($scope.secretariatForm.$valid){
				secretariatManagementSrvc.updatesecretariat($scope.Data.selectedsecretariat).then(function(response){
					$scope.Controller.secretariatListController.refreshList()
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onDeletesecretariatClick: function(){
			secretariatManagementSrvc.deletesecretariat($scope.Data.selectedsecretariat.uid).then(function(response){
				$scope.Func.resetForm();
				$scope.Func.reset();
				$scope.Controller.secretariatListController.refreshList();
			});
		},
		onCancelClick: function(){
			$scope.Data.selectedsecretariat = angular.copy($scope.Data.originalsecretariat);
			$scope.Func.initiatesecretaryPosition();
			$scope.Func.resetForm();
		},
		
		onChangeSearchModeClick: function(mode){
			$scope.Data.searchMode = mode;
		},
		onSearchClick: function(advancedMode){
			if(advancedMode){
				$scope.Func.onChangeSearchModeClick('advanced');
				$scope.Controller.secretariatListController.searchQuery = $scope.Controller.secretariatAdvancedSearchController.searchQuery;
				$scope.Controller.secretariatListController.searchableFieldInfo = $scope.Controller.secretariatAdvancedSearchController.searchableFieldInfo;
			}else{
				$scope.Func.onChangeSearchModeClick('quick');
				$scope.Controller.secretariatListController.searchQuery = $scope.Controller.secretariatSearchController.searchQuery;
				$scope.Controller.secretariatListController.searchableFieldInfo = $scope.Controller.secretariatSearchController.searchableFieldInfo;			
			}
			$scope.Controller.secretariatListController.refreshList(true);
		},
		onExitSearchModeClick: function(){
			$scope.Func.onChangeSearchModeClick('none');
			$scope.Controller.secretariatAdvancedSearchController.searchQuery = {};
			$scope.Controller.secretariatSearchController.searchQuery = {};
			$scope.Controller.secretariatListController.exitSearchMode();
		},
		
		getindicatorList: function(){
			secretariatManagementSrvc.getindicatorList().then(function(response){
				$scope.Data.indicatorList = response.data.originalElement;
			});
		},
		getsecretaryPositionList: function(){
			secretariatManagementSrvc.getsecretaryPositionList().then(function(response){
				for ( var int = 0; int < response.data.originalElement.length; int++) {
					$scope.Data.secretaryPositionList.push(response.data.originalElement[int]);					
				}
			});
		},
		onSelectsecretaryPosition: function(secretaryPosition){
			$scope.Data.secretaryPosition = secretaryPosition;
			$scope.Data.selectedsecretariat.secretaryPosition = {
				uid:$scope.Data.secretaryPosition.uid,
				title:$scope.Data.secretaryPosition.title
			};
		},
		initiatesecretaryPosition: function(){
			$scope.Data.secretaryPosition = null;
			if($scope.Data.selectedsecretariat.secretaryPosition){
				for ( var int = 0; int < $scope.Data.secretaryPositionList.length; int++) {
					if($scope.Data.secretaryPositionList[int].uid==$scope.Data.selectedsecretariat.secretaryPosition.uid)
						$scope.Data.secretaryPosition = $scope.Data.secretaryPositionList[int];
				}
			}
		},
		
		reset: function(){
			$scope.Data.selectedsecretariat = {
					indicatorBookRecievers: [],
					indicatorBookSenders: [],
					secretariesPositionAssignments: []
			};
			$scope.Data.secretaryPosition = null;
		},
		resetForm: function() {
			$scope.Data.mode = 'view';
			$scope.Data.validationClicked = false;
		},


		onAddSecretaryClick: function () {
			var item = {
				accessRegisterInternal: false,
				accessRegisterIssued: false,
				accessRegisterIncomming: false
			};
			$scope.Data.selectedsecretariat.secretariesPositionAssignments.push(item);
		},
		onRemoveSecretaryClick: function (index) {
			$scope.Data.selectedsecretariat.secretariesPositionAssignments.splice(index, 1);	
		},
		setSecretariatPosition: function () {
			$scope.Data.selectedsecretariat.secretariesPositionAssignments.forEach(function (item, index) {
				$scope.Data.secretaryPositionList.forEach(function (itemInList) {
					if(itemInList.uid === item.position.uid){
						item.position = itemInList;
					}
				});
			});
		}

		
	}
	
	$scope.Controller = {
		secretariatListController : {
			headers: [
				{key:'name'},		
				{key:'enabled'},		
				{key:'secretaryPosition.title', label:'سمت سردبیر'},
			],
			getList : secretariatManagementSrvc.getFullsecretariatList,
			onListItemSelect : $scope.Func.onSelectsecretariat,
			searchFunction : secretariatManagementSrvc.searchsecretariat,
		},
		secretariatSearchController: {
			advanced: false,
			searchableFieldInfo: [
				{key:"name", type:"string", label:"نام"},
				{key:"enabled", type:"bool", label:"فعال"},
				{key:"secretaryPosition", type:"enum", label:"سمت دبیر", itemList:$scope.Data.secretaryPositionList},
			],
			onSearchClick: $scope.Func.onSearchClick,
			onExitSearchModeClick: $scope.Func.onExitSearchModeClick
		},
		secretariatAdvancedSearchController: {
			advanced: true,
			searchableFieldInfo: [
				{key:"name", type:"string", label:"نام"},
				{key:"enabled", type:"bool", label:"فعال"},
				{key:"secretaryPosition", type:"enum", label:"سمت سردبیر", itemList:$scope.Data.secretaryPositionList},
			],
			onSearchClick: $scope.Func.onSearchClick,
			onExitSearchModeClick: $scope.Func.onExitSearchModeClick
		},
		multiSelectorsController: {
			multiSelectTranslate : {
				buttonDefaultText : 'انتخاب دفاتر اندیکاتوری',
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
		},
	}
	
	var Run = function(){
		secretariatManagementSrvc.setOrgUid($state.params.orgUid);
		$scope.Func.getsecretaryPositionList();
		$scope.Func.getindicatorList();
	}
	
	Run();
});