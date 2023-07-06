angular.module('externalorganizationModule').controller('memberModalCtrl',['$scope', '$modal', '$modalInstance', 'member', 'mode',
       function($scope, $modal, $modalInstance, member, mode) {
	
	$scope.Data={
		mode: mode,
		memberList: [],
		validationClicked: false,
	}
	
	$scope.Func = {
		onSaveClick: function(finish) {
			if ($scope.memberModalForm.$valid) {
				$scope.Data.memberList.push($scope.Data.member)
				if(finish)
					$modalInstance.close($scope.Data.memberList);
				else
					$scope.Func.reset();
				
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onUpdateClick: function(){
			if ($scope.memberModalForm.$valid) {
				$modalInstance.close($scope.Data.member);
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onFinishClick: function(){
			$modalInstance.close($scope.Data.memberList);
		},
		onCancelClick: function() {
			$modalInstance.dismiss();
		},
		
		reset: function(){
			$scope.Data.member = {};
			$scope.Data.validationClicked = false;
		}
		
	}
	
	var Run = function(){
		if($scope.Data.mode == 'add')
			$scope.Data.member = {};
		else if($scope.Data.mode == 'edit')
			$scope.Data.member = angular.copy(member);
	}
	
	Run();
	
	
}]);