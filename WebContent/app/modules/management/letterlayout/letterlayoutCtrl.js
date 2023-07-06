angular.module('letterlayoutModule').controller('letterlayoutCtrl', function($scope, $state,$modal, letterlayoutSrvc,configObj) {

	$scope.Data = {
		mode: 'view',
		searchMode: 'none',
		letterlayoutList: [],
		selectedletterlayout: {
		},
		originalletterlayout: {},
		validationClicked: false,
		configObj:configObj,
		standardPaperSizeList:[
		{
				name:'A1',
				length:841,
				width:594
		},
		{
				name:'A2',
				length:594,
				width:420
		},
		{
				name:'A3',
				length:420,
				width:297
		},
		{
				name:'A4',
				length:297,
				width:210
		},
		{
				name:'A5',
				length:210,
				width:148
		},
		{
				name:'A6',
				length:148,
				width:105
		}
	]
	}
	
	$scope.Func = {
		onStandardPaperSizeSelect: function (selectedPageSize) {
			$scope.Data.selectedletterlayout.length = selectedPageSize.length;
			$scope.Data.selectedletterlayout.width = selectedPageSize.width;
		},
		onAddletterlayoutClick: function(){
			$scope.Data.mode = 'add';
			$scope.Func.reset();
		},
		onSelectletterlayout: function(letterlayout){
			$scope.Func.resetForm()
			letterlayoutSrvc.getletterlayout(letterlayout.uid).then(function(response){
				$scope.Data.selectedletterlayout = response.data.originalElement;
				$scope.Data.originalletterlayout = angular.copy($scope.Data.selectedletterlayout);
				$scope.Data.mode='view';
			});
		},
		onEditletterlayoutClick: function(){
			$scope.Data.mode = 'edit';
		},
		onSaveletterlayoutClick: function(){
			if($scope.letterlayoutForm.$valid){
				letterlayoutSrvc.saveletterlayout($scope.Data.selectedletterlayout).then(function(response){
					$scope.Controller.letterlayoutListController.refreshList()
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onUpdateletterlayoutClick: function(){
			if($scope.letterlayoutForm.$valid){
				letterlayoutSrvc.updateletterlayout($scope.Data.selectedletterlayout).then(function(response){
					$scope.Controller.letterlayoutListController.refreshList()
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onDeleteletterlayoutClick: function(){
			letterlayoutSrvc.deleteletterlayout($scope.Data.selectedletterlayout.uid).then(function(response){
				$scope.Func.resetForm();
				$scope.Func.reset();
				$scope.Controller.letterlayoutListController.refreshList();
			});
		},
		onCancelClick: function(){
			$scope.Data.selectedletterlayout = angular.copy($scope.Data.originalletterlayout);
			$scope.Func.resetForm();
		},
		
		onChangeSearchModeClick: function(mode){
			$scope.Data.searchMode = mode;
		},
		onSearchClick: function(advancedMode){
			if(advancedMode){
				$scope.Func.onChangeSearchModeClick('advanced');
				$scope.Controller.letterlayoutListController.searchQuery = $scope.Controller.letterlayoutAdvancedSearchController.searchQuery;
				$scope.Controller.letterlayoutListController.searchableFieldInfo = $scope.Controller.letterlayoutAdvancedSearchController.searchableFieldInfo;
			}else{
				$scope.Func.onChangeSearchModeClick('quick');
				$scope.Controller.letterlayoutListController.searchQuery = $scope.Controller.letterlayoutSearchController.searchQuery;
				$scope.Controller.letterlayoutListController.searchableFieldInfo = $scope.Controller.letterlayoutSearchController.searchableFieldInfo;			
			}
			$scope.Controller.letterlayoutListController.refreshList(true);
		},
		onExitSearchModeClick: function(){
			$scope.Func.onChangeSearchModeClick('none');
			$scope.Controller.letterlayoutAdvancedSearchController.searchQuery = {};
			$scope.Controller.letterlayoutSearchController.searchQuery = {};
			$scope.Controller.letterlayoutListController.exitSearchMode();
		},
		
		reset: function(){
			$scope.Data.selectedletterlayout = {};
		},
		resetForm: function() {
			$scope.Data.mode = 'view';
			$scope.Data.validationClicked = false;
			$scope.Data.standardPaperSize = null;
		},
		onShowEditLayoutModalClick: function(photoHash) {
			var modalInstance = $modal.open({
				templateUrl : 'app/modules/management/letterlayout/letterLayoutEditModal.html',
				controller : 'letterLayoutEditModalCtrl',
				size : 'lg',
				backdrop: 'static',
				resolve : {
					imageUrl: function() {
						return "files/?mode=view&fcode="+photoHash;
					},
					layoutAttributePositionsObj:function(){
						return {
							marginRight:{
								right : $scope.Data.selectedletterlayout.marginRight,
							},
							marginLeft:{
								left : $scope.Data.selectedletterlayout.marginLeft,
							},
							marginTop:{
								top : $scope.Data.selectedletterlayout.marginUp,
							},
							marginBottom:{
								bottom : $scope.Data.selectedletterlayout.marginDown
							},
							date: {
									left : $scope.Data.selectedletterlayout.datePositionX,
									top : $scope.Data.selectedletterlayout.datePositionY
								
							},
							attachment: {
									left : $scope.Data.selectedletterlayout.attachmentPositionX,
									top : $scope.Data.selectedletterlayout.attachmentPositionY
								
							},
							number: {
									left : $scope.Data.selectedletterlayout.numberPositionX,
									top : $scope.Data.selectedletterlayout.numberPositionY
								
							},
							postscript:{
									left : $scope.Data.selectedletterlayout.postscriptPositionX,
									top : $scope.Data.selectedletterlayout.postscriptPositionY
								
							}
						}
					}
					
				}
			});
			modalInstance.result.then(function(positionObj) {


				$scope.Data.selectedletterlayout.marginRight = positionObj.marginRight.right;
				$scope.Data.selectedletterlayout.marginLeft = positionObj.marginLeft.left;
				$scope.Data.selectedletterlayout.marginUp = positionObj.marginTop.top;
				$scope.Data.selectedletterlayout.marginDown = positionObj.marginBottom.bottom;
				$scope.Data.selectedletterlayout.datePositionX = positionObj.date.left;
				$scope.Data.selectedletterlayout.datePositionY = positionObj.date.top;
				$scope.Data.selectedletterlayout.attachmentPositionX = positionObj.attachment.left;
				$scope.Data.selectedletterlayout.attachmentPositionY = positionObj.attachment.top;
				$scope.Data.selectedletterlayout.numberPositionX = positionObj.number.left;
				$scope.Data.selectedletterlayout.numberPositionY = positionObj.number.top;
				$scope.Data.selectedletterlayout.postscriptPositionX = positionObj.postscript.left;
				$scope.Data.selectedletterlayout.postscriptPositionY = positionObj.postscript.top;



			});
		},
		
	}
	
	$scope.Controller = {
		letterlayoutListController : {
			headers: [
				{key:'name'},		
				{key:'enabled'}
			],
			getList : letterlayoutSrvc.getFullletterlayoutList,
			onListItemSelect : $scope.Func.onSelectletterlayout,
			searchFunction : letterlayoutSrvc.searchletterlayout,
		},
		letterlayoutSearchController: {
			advanced: false,
			searchableFieldInfo: [
				{key:"name", type:"string", label:"نام"},
				{key:"enabled", type:"bool", label:"فعال"}
			],
			onSearchClick: $scope.Func.onSearchClick,
			onExitSearchModeClick: $scope.Func.onExitSearchModeClick
		},
		letterlayoutAdvancedSearchController: {
			advanced: true,
			searchableFieldInfo: [
				{key:"name", type:"string", label:"نام"},
				{key:"enabled", type:"bool", label:"فعال"},
				{key:"length", type:"integer", label:"طول"},
				{key:"width", type:"integer", label:"عرض"},
				{key:"datePositionX", type:"integer", label:"محل تاریخ از چپ"},
				{key:"datePositionY", type:"integer", label:"محل تاریخ از بالا"},
				{key:"attachmentPositionX", type:"integer", label:"محل پیوست از چپ"},
				{key:"attachmentPositionY", type:"integer", label:"محل پیوست از بالا"},
				{key:"numberPositionX", type:"integer", label:"محل شماره از چپ"},
				{key:"numberPositionY", type:"integer", label:"محل شماره از بالا"},
				{key:"postscriptPositionY", type:"integer", label:"محل پی‌نوشت از بالا"},
				{key:"postscriptPositionX", type:"integer", label:"محل پی‌نوشت از چپ"},
				{key:"postscriptFontsize", type:"integer", label:"اندازه فونت پی‌نوشت"},
				{key:"postscriptText", type:"string", label:"متن پی‌نوشت"},
				{key:"marginLeft", type:"integer", label:"حاشیه چپ"},
				{key:"marginRight", type:"integer", label:"حاشیه راست"},
				{key:"marginUp", type:"integer", label:"حاشیه بالا"},
				{key:"marginDown", type:"integer", label:"حاشیه پایین"},
			],
			onSearchClick: $scope.Func.onSearchClick,
			onExitSearchModeClick: $scope.Func.onExitSearchModeClick
		}
	}
	
	var Run = function(){
		letterlayoutSrvc.setOrgUid($state.params.orgUid);
	}
	
	Run();
});



angular.module('letterlayoutModule').controller('letterLayoutEditModalCtrl', function($scope, imageUrl,$modalInstance,layoutAttributePositionsObj) {


	// $modalInstance.close(selected);

	
	$scope.Data = {
		imageUrl : imageUrl,
		layoutAttributePositionsObj:layoutAttributePositionsObj
	};

	$scope.apis = {
		letterLayoutVisualAttributeSetter:{}
	}

	$scope.Func = {
		onSaveClick : function(){
			$modalInstance.close($scope.apis.letterLayoutVisualAttributeSetter.getPositions())
		},
		onCancelClick : function (params) {
			$modalInstance.dismiss();
		}
    };

    var Run = function() {
		// setTimeout(() => {
			
			// $scope.Func.setInitialPositions(layoutAttributePositionsObj)
		// }, 2000);
    };

    Run();

});