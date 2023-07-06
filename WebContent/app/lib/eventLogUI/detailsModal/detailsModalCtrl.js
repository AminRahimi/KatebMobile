
angular.module("logModule").controller('detailsModalCtrl', function($scope, logEventInfo ,$modalInstance) {
 
	$scope.Data = {
			logEventInfo : logEventInfo
    }
    console.log('$scope.Data.logEventInfo')
	$scope.cancel = function() {
		$modalInstance.dismiss();
	};

});