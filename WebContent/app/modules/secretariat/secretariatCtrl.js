angular.module('secretariatModule').controller('secretariatCtrl', function(sideMenu, $scope, $state, homeSrvc, secretariatSrvc, $modal) {
	
	$scope.stateName=$state.current.name;
	$scope.Data = {
		secretariatList: [],
		incommingUisref: "",
	}

	$scope.Func = {
		getSideMenu: function () {
				$scope.Data.menuList = homeSrvc.generateSecretariatMenu();
				// $scope.Data.menuList.forEach(function (menu) {
				// 	menu.active = false;
				// });
				$scope.Data.secretariatList = sideMenu;
				$scope.Data.secretariatList.forEach(function (item) {
					item.menuList = angular.copy($scope.Data.menuList);
					item.menu.forEach(function (menuItem) {
						item.menuList.forEach(function (menuListItem) {
							if (menuListItem.key === "INCOMMING") {
								$scope.Data.incommingUisref = menuListItem.uiSref;
							}
							menuListItem.active = false;
							if (menuListItem.key === menuItem.key) {
								
								menuListItem.count = menuItem.counter;
							}
						})
					});
				});
				$scope.Func.gotoDefaultPage();
			},
			
			onMenuClick: function(secretariat, menu){
				if($scope.Data.prevMenu)
					$scope.Data.prevMenu.active = false;
				menu.active = true;
				$scope.Data.prevMenu = menu;
				secretariatSrvc.setBackButton(menu.uiSref);
				$state.go(menu.uiSref, {secUid: secretariat.uid});
			},
			
			gotoDefaultPage: function(){
				if($scope.stateName == 'home.secretariat'){
					//TODO go to first available menu of first secretariat
				}
			},
		onAddIncommingClick: function(secretariat) {
			var modalInstance = $modal.open({
				templateUrl: 'app/modules/secretariat/incoming/incommingLetterTemplateList.html',
				controller: 'incommingLetterTemplateListCtrl',
				size: 'md'
			});
			modalInstance.result.then(function (incommingLetterTemplate) {
				if ($state.current.name !== 'home.secretariat.incoming'){	
					secretariatSrvc.setBackButton($scope.Data.incommingUisref);
					$state.go('home.secretariat.incoming', {
						secUid: secretariat.uid,
						tmpUid: incommingLetterTemplate.uid
					});
				}
			});
		},
		onAddIssuedClick: function(secretariat) {
			$state.go('home.secretariat.issuedAdd', {secUid: secretariat.uid});
		},
		onReserveClick: function (secretariat) {
			$state.go('home.secretariat.reserve');
		},
		isIncommingPage: function(){
			return ($state.current.name === 'home.secretariat.incoming')
		}
	}
	
	
	var Run = function(){
		$scope.Func.getSideMenu();
	}
	
	Run();
});