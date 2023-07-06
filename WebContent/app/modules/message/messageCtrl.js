angular.module('messageModule').controller('messageCtrl', function($scope, $state) {

	$scope.Data = {
		menuList: [
			{title: 'دریافت شده', uiSref: 'base.home.message.inbox'},
			{title: 'ارسال شده', uiSref: 'base.home.message.send'}
		]
	};
	
	$scope.Func = {
		onRefreshPageClick: function () {
			$state.reload();
		}
	};
	
});