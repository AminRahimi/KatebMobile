angular.module('vtCartable').constant('cartableNotificationHandlerConst', function(){
    return{
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
        filterSaved: {
            type: 'success',
            title: '',
            message: 'فیلتر با موفقیت ذخیره شد.'
        },
        filterRemoved: {
            type: 'success',
            title: '',
            message: 'فیلتر با موفقیت حذف شد.'
        },

    }
});