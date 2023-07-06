angular.module('loginSettingModule').controller('loginSettingCtrl', function ($scope, $timeout, loginSettingSrvc, vtShowMessageSrvc) {

    $scope.Data = {
        photoList: [],
        photoInfo: '',
        vtPhoto: true,
        mode: 'view',
        selectedPhoto: {},
    }

    $scope.Func = {
        getBgPhotoList: function () {
            return loginSettingSrvc.getBgPhotoList().then(function (res) {
                $scope.Data.photoList = res.data;
                return true;
            })
        },
        getActiveBgPhoto: function () {
            loginSettingSrvc.getActiveBgPhoto().then(function (res) {
                $scope.Data.selectedPhoto = res.data;
            })
        },
        preview: function (selectedPhoto) {
            $scope.Data.selectedPhoto = selectedPhoto;

        },
        deleteBgPhoto: function (uid) {
            loginSettingSrvc.deleteBgPhoto(uid).then(function () {
                $scope.Func.getBgPhotoList();
                $scope.Data.selectedPhoto = {};
                vtShowMessageSrvc.showMassage('success', 'تصویر با موفقیت حذف شد شد.');
            })
        },
        onSaveClick: function () {
            loginSettingSrvc.activateBgPhoto($scope.Data.selectedPhoto.uid).then(function () {
                angular.forEach($scope.Data.photoList, function (item) {
                    if($scope.Data.selectedPhoto.uid === item.uid){
                        item.active = true;
                    } else {
                        item.active = false;
                    }
                });
                vtShowMessageSrvc.showMassage('success', 'تصویر صفحه ورود باموفقیت بروزرسانی شد.');
            });

        },
        onAddToAlbum: function(){
            loginSettingSrvc.addBgPhoto($scope.Data.selectedPhoto.hash).then(function () {
                $scope.Func.getBgPhotoList().then(function () {
                    $scope.Func.onClickBack();
                });
            })
        },
        onClickAddBgPhoto: function () {
            $scope.Data.mode = 'add';
            $scope.Data.selectedPhoto = {};
        },
        onClickBack: function () {
            $scope.Data.mode = 'view';
            $scope.Data.selectedPhoto = {};
            $scope.Func.getActiveBgPhoto();
        }

    }

    var Run = function () {
        $scope.Func.getBgPhotoList();
        $scope.Func.getActiveBgPhoto();
    }

    Run();
});
