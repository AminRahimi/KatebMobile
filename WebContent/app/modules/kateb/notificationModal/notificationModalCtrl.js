angular.module('katebModule').controller('notificationModalCtrl', 
	function($scope, $modalInstance,notificationModalSrvc, notification) {
		$scope.notificationBody = notificationModalSrvc.notify[notification];
		$scope.ok = function () {
			$modalInstance.close('ok');
		};
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
});
angular.module('katebModule').factory('notificationModalSrvc', function () {
	var notificationPool = {
		'onExitDraft': 'تغییرات انجام شده یا داده های وارد شده ذخیره نمیشود. آیا از خروج از پیش نویس مطمئن هستید؟',
		'scannerError': 'خطایی رخ داده است آیا مایل به اسکن کردن دوباره می باشید؟',
		'onSignatureDraft': 'تمامی پاراف‌کنندگان اقدام به امضای این نامه نکرده‌اند. آیا از امضای نامه مطمئن هستید؟',
		'onEditDraft': 'با انتخاب دکمه ویرایش، امضای پاراف‌کنندگان برداشته خواهد شد. آیا از ویرایش این پیش‌نویس مطمئن هستید؟'
	}
	return {
		notify: notificationPool
	}
});