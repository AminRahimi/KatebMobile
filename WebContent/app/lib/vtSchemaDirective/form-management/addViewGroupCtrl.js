angular.module('vtFormManagement').controller('addViewGroupCtrl', function($scope, $modalInstance, viewGroup, viewGroupList) {

	$scope.viewGroupList = viewGroupList;
	$scope.secretLevels = [ {
		id : 1,
		name : "عادی"
	}, {
		id : 2,
		name : "محرمانه"
	}, {
		id : 3,
		name : "خیلی محرمانه"
	}, {
		id : 4,
		name : "سری"
	}, {
		id : 5,
		name : "به کلی سری"
	} ];

	$scope.Data = {
		mainForm : {},
		validationClicked : false
	};

	$scope.viewGroup = viewGroup;
	if (viewGroup.secretLevel != '')
		$scope.viewGroup.secretLevel = _.find($scope.secretLevels, function(v) {
			return v.id == viewGroup.secretLevel;
		});

	if ($scope.viewGroup.key != '')
		$scope.editFlag = true;

	$scope.isDuplicateKey = function(viewGroupKey) {
		if (_.find(viewGroupList, function(_viewGroup) {
			return _viewGroup.key == viewGroupKey
		})) {
			return true;
		} else {
			return false;
		}
	}
	$scope.create = function() {

		if ($scope.Data.mainForm.$valid) {
			if (!$scope.isDuplicateKey($scope.viewGroup.key)) {
				$modalInstance.close($scope.viewGroup);
			} else {
				$scope.Data.validationClicked = true;
				$scope.Data.duplicateKey = true;
			}
		} else {
			$scope.Data.validationClicked = true;
		}
	}
	$scope.onReturnClick = function() {
		$modalInstance.dismiss('return');
	};

});