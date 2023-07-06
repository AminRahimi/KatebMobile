angular.module('notificationHandlerConstModule', []).constant('notificationHandlerConst', function(){
	return{
		addToUserArchiveSuccess: {
			type: 'success',
			title: '',
			message: 'نامه با موفقیت به آرشیو شخصی شما اضافه شد.'
		},
		removeFromUserArchiveSuccess: {
			type: 'success',
			title: '',
			message: 'نامه‌ با موفقیت از آرشیو شخصی شما خارج شد.'
		},
		addLettersToUserArchiveSuccess: {
			type: 'success',
			title: '',
			message: 'نامه‌های انتخاب شده با موفقیت به آرشیو شخصی شما اضافه شدند.'
		},
		removeLettersFromUserArchiveSuccess: {
			type: 'success',
			title: '',
			message: 'نامه‌های انتخاب شده با موفقیت از آرشیو شخصی شما خارج شدند.'
		},
		 forwardSucceded: {
		 	type: 'success',
		 	title: '',
		 	message: 'ارجاع با موفقیت انجام شد.'
		 },
        sendSucceded: {
			type: 'success',
			title: '',
			message: 'ارسال با موفقیت انجام شد.'
		},
		 templateSaved: {
		 	type: 'success',
		 	title: '',
		 	message: 'قالب با موفقیت ذخیره شد.'
		 },
		 templateRenamed: {
		 	type: 'success',
		 	title: '',
		 	message: 'تغیر نام با موفقیت انجام شد.'
		 },
		 templateRemoved: {
		 	type: 'success',
		 	title: '',
		 	message: 'قالب با موفقیت حذف شد.'
		 },
		deploySucceded: {
			type: 'success',
			title: '',
			message: 'عملیات نصب با موفقیت انجام شد.'
		},
		deployFailed: {
			type: 'error',
			title: '',
			message: 'عملیات نصب با خطا مواجه شده است.'
		},
		organizationNotSelected:{
			type: 'error',
			title: '',
			message: 'لطفا نام سازمان فرستنده را انتخاب کنید.'
		},
		fillEmptyFields:{
			type: 'error',
			title: '',
			message: 'لطفا فیلد های ضروری را پر کنید.'
		},
		filterNotAdded:{
			type: 'error',
			title: '',
			message: 'فیلتری اضافه نشده است.'
		}
	}
});
