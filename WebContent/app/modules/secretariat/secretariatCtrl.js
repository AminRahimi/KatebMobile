angular.module('secretariatModule').controller('secretariatCtrl', function() {
	
	// $scope.stateName=$state.current.name;
	// $scope.Data = {
	// 	secretariatList: sideMenu,
	// 	incommingUisref: "",
	// }

	// $scope.Func = {
	// 	toggleCollapseMenu:function (){
	//
	// 		document.querySelector('.panel-right-secretariat').classList.toggle('open');
	// 	},
	// 	onToggleMenuClick:function (){
	// 		$scope.Func.toggleCollapseMenu();
	// 	},
	// 	onMenuClick: function(secretariat, menu){
	// 		if($scope.Data.prevMenu)
	// 			$scope.Data.prevMenu.active = false;
	// 		menu.active = true;
	// 		$scope.Data.prevMenu = menu;
	// 		secretariatSrvc.setBackButton(menu.uiSref);
	// 		$state.go(menu.uiSref, {secUid: secretariat.uid});
	// 		$scope.Func.toggleCollapseMenu();
	// 	},
	//
	// 	gotoDefaultPage: function(){
	// 		if($scope.stateName === 'base.home.secretariat'){
	// 			//TODO go to first available menu of first secretariat
	// 		}
	// 	},
	// 	onAddIncommingClick: function(secretariat) {
	// 		var modalInstance = $modal.open({
	// 			templateUrl: 'app/modules/secretariat/incoming/incommingLetterTemplateList.html',
	// 			controller: 'incommingLetterTemplateListCtrl',
	// 			size: 'md'
	// 		});
	// 		modalInstance.result.then(function (incommingLetterTemplate) {
	// 			if ($state.current.name !== 'base.home.secretariat.incoming'){
	// 				secretariatSrvc.setBackButton($scope.Data.incommingUisref);
	// 				$state.go('base.home.secretariat.incoming', {
	// 					secUid: secretariat.uid,
	// 					tmpUid: incommingLetterTemplate.uid
	// 				});
	// 			}
	// 		});
	// 		$scope.Func.toggleCollapseMenu();
	// 	},
	// 	onAddIssuedClick: function(secretariat) {
	// 		$state.go('base.home.secretariat.issuedAdd', {secUid: secretariat.uid});
	// 		$scope.Func.toggleCollapseMenu();
	// 	},
	// 	onReserveClick: function (secretariat) {
	// 		$state.go('base.home.secretariat.reserve');
	// 		$scope.Func.toggleCollapseMenu();
	// 	},
	// 	isIncommingPage: function(){
	// 		return ($state.current.name === 'base.home.secretariat.incoming')
	// 	}
	// }
	
	
	var Run = function(){
		// FIXME
		// if (menuListItem.key === "INCOMMING") {
		// 	$scope.Data.incommingUisref = menuListItem.uiSref;
		// }


		// $scope.Func.gotoDefaultPage();
	}
	
	Run();
});