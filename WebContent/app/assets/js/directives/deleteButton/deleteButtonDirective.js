angular.module('deleteButton', []).directive('deleteButton', function() {
	return {
		restrict : 'EA',
		templateUrl : 'app/assets/js/directives/deleteButton/deleteButton.html',
		scope : {
			exchangeFunctionForDelete : "=",
		},
		link : function ($scope){
			$scope.title = 'حذف نامه';
			$scope.modalMessage = 'آیا از حذف نامه انتخاب شده مطمئن هستید؟';
		}
	}
});