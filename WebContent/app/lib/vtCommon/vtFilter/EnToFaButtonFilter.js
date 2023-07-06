var restProj =  restProj || {};
restProj.enToFaButton = function() {
	return function(input) {
		if (input == undefined)
			return;
		var symbolMap = {
			'CANCEL' : 'انصراف',
			'SAVE' : 'ذخیره',
			'CREATE' : 'ایجاد',
			'UPDATE' : 'ثبت تغییرات',
			'EDIT' : 'ویرایش',
			'DELETE' : 'حذف'
		};
		return symbolMap[input];
	};
};