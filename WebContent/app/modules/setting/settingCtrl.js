angular.module('SettingModule').controller('settingCtrl', ['$scope','$rootScope','$state', 'homeSrvc',
   function($scope, $rootScope, $state, homeSrvc) {

	$scope.Data = {};
	
	$scope.Func = {
			getMenuList : function(){
				$scope.Data.menuList = [ ];
			}
	};
	
	$scope.Func.getMenuList();
	
}]);