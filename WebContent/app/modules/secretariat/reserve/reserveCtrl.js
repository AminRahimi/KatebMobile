angular.module('secretariatModule').controller('reserveCtrl',
	function($scope, $state, $rootScope, $sce, secretariatSrvc, vtShowMessageSrvc, configObj, $timeout,reserveSrvc) {
	$scope.Data = {
		reserve: '',
		configObj: configObj,
		puaList: [],
		}

        $scope.Func = {
            getTabList: function () {
					$scope.Data.tabList = [{
						id: 0,
						title: 'اطلاعات نامه',
					},]
            },
            deactiveTabs: function () {
					for (var int = 0; int < $scope.Data.tabList.length; int++) {
						$scope.Data.tabList[int].active = false;
					}
			},
			getPua: function (query) {
				reserveSrvc.getPua( query).then(function (response) {
					$scope.Data.puaList = response.data.originalElement;
				})
			},
			onTabClick: function (tab) {
					$scope.Data.selectedTab = tab;
					$scope.Func.deactiveTabs();
					tab.active = true;
			},
			onCloseClick: function () {
				$state.go("base.home.secretariat")
			},
			onSaveClick: function () {
				reserveSrvc.SaveReservation( $scope.Data.reserve).then(function (response) {
					$scope.Data.reserve = null;
					$state.go("base.home.secretariat.reserveList")
				})
			}
		}

	$scope.Controller = {
			
		}

		var Run = function () {
			reserveSrvc.setOrgUid($scope.Data.configObj.userConfig.organization.uid);
            $scope.Func.getTabList();
            $scope.Func.getPua();
            $scope.Func.onTabClick($scope.Data.tabList[0]);
		}

		Run();

});
