angular.module('vtFormManagement').controller('optionViewCtrl',
		function($scope, $modalInstance, baseSelector) {
			$scope.baseSelector = baseSelector;
			$scope.onReturnClick = function() {
				$modalInstance.dismiss('return');
			};

		});