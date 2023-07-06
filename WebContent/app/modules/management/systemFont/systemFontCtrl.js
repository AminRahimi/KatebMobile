angular.module('systemFontModule').controller('systemFontCtrl', function($scope, $state, systemFontSrvc) {

	$scope.Data = {
		mode: 'view',
		selectedsystemFont: {},
		defaultSecretariat:{},
		originalsystemFont: {},
		indicatorBookList: [],
        validationClicked: false,
        fileAttach:true,
		selectedFont:''
	}
	
	$scope.Func = {
		getsystemFont: function(){
			systemFontSrvc.getsystemFont().then(function(response){
				$scope.Data.selectedsystemFont = response.data.originalElement;
				$scope.Data.originalsystemFont = angular.copy($scope.Data.selectedsystemFont);
				$scope.Data.mode='view';
			});
		},
		onSelectFont: function (font) {
			systemFontSrvc.getFontItem(font.uid).then(function(response){
				$scope.Data.selectedFont = response.data.originalElement;
				console.log($scope.Data.selectedFont )
				$scope.Data.mode='view';
			});
		},
        onAddFontClick: function () {
				$scope.Data.mode='add';
            
        },
		onEditsystemFontClick: function(){
			$scope.Data.mode = 'edit';
        },
		onSaveFontClick: function () {
			if ($scope.Data.mode != 'edit') {
				var selectedFont = {
					"name": $scope.Data.selectedFont.name,
					"enabled": $scope.Data.selectedFont.enabled,
					"file": {
						"hash":$scope.Data.selectedFont.hash
					}
				}
				if (!$scope.Data.selectedFont.enabled) {
						selectedFont.enabled = false;
				} else {
						selectedFont.enabled = true;
				 }
				systemFontSrvc.savesystemFont(selectedFont).then(function () {
				$scope.Data.mode = 'view';
					$scope.Controller.systemFontListController.refreshList();
					$scope.Data.selectedFont = {}
			})
			} else {
				$scope.Func.editSystemFont()
			}
		},
		editSystemFont: function () {
			var enableFont = {
				enabled:$scope.Data.selectedFont.enabled
			}
				systemFontSrvc.editSystemFont(enableFont,$scope.Data.selectedFont.uid).then(function () {
				$scope.Data.mode = 'view';
				$scope.Controller.systemFontListController.refreshList();
			})
		},
        onCancelClick: function () {
			$scope.Data.mode = 'view';
		},
		onDeleteFontClick: function () {
			systemFontSrvc.deleteFont($scope.Data.selectedFont.uid).then(function () {
				$scope.Data.mode = 'view';
				$scope.Controller.systemFontListController.refreshList();
			})
            
        },
		
	}
	$scope.Controller = {
		systemFontListController : {
			headers: [
				{key:"name", type:"string", label:"نام"},
				{key:"enabled", type:"bool", label:"فعال"}
			],
			getList : systemFontSrvc.getFontList,
			onListItemSelect : $scope.Func.onSelectFont,
			// searchFunction : letterlayoutSrvc.searchletterlayout,
		},
		systemFontListSearchController: {
			advanced: false,
			searchableFieldInfo: [
				{key:"name", type:"string", label:"نام"},
				{key:"enabled", type:"bool", label:"فعال"}
			],
			onSearchClick: $scope.Func.onSearchClick,
			onExitSearchModeClick: $scope.Func.onExitSearchModeClick
		},
	}
	var Run = function () {
		systemFontSrvc.setOrgUid($state.params.orgUid);
	}
	
	Run();
});