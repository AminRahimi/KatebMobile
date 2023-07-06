angular.module('cartableModule').controller('transferModalCtrl', function($scope, $rootScope, $modalInstance, cartableKatebSrvc, isExternal) {
	
	$scope.Data = {
		selectedUser: null,
		text: "",
        isExternal: isExternal
	};
	$scope.userList = [];
	
	$scope.onTransferClick = function(){
		var data = {
			text: $scope.Data.text,
			selectedUser: $scope.Data.selectedUser
		}
		$modalInstance.close(data);
	}
	$scope.onCancelClick = function(){
		$modalInstance.dismiss();
	}
	
	$scope.getUserList = function(){
		cartableKatebSrvc.getUserList($rootScope.currentUserOrg.uid).then(function(response){
			$scope.userList = response.data;
		});
	}

    $scope.getParapherList = function (response) {
        cartableKatebSrvc.getParapherList($rootScope.currentUserOrg.uid).then(function(response){
            $scope.userList = response.data.originalElement;
        });
	}

    if ($scope.Data.isExternal)
        $scope.getParapherList();
    else
        $scope.getUserList();
});