angular.module('vtFormManagement').controller('helpCtrl',
		function($scope, $modalInstance) {
			
			
			
			$scope.onReturnClick = function() {
				$modalInstance.dismiss('return');
			};

		});