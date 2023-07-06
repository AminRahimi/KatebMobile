angular.module("bigText").controller('bigTextModalCtrl', function($scope, $modalInstance, model, isEditMode, direction) {

	$scope.model = model;
	$scope.isEditMode = isEditMode;
	$scope.direction = direction;

	$scope.ok = function(m) {
		$modalInstance.close(m);
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
});