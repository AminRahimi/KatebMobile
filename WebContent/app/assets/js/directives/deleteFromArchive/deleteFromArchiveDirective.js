angular.module('deleteFromArchive', []).directive('unArchive', function() {
	return {
		restrict : 'EA',
		templateUrl : 'app/assets/js/directives/deleteFromArchive/deleteFromArchive.html',
		scope : {
			exchangeFunctionForDelete : "=",
		},
		link : function ($scope){
			$scope.title = 'حذف از آرشیو شخصی';
			$scope.modalMessage = ' آیا از حذف این نامه از آرشیو نامه‌های شخصی اطمینان دارید؟';
		}
	}
});