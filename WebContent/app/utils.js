app.factory('utils', ['$modal', function ($modal) {

    var openConfirmModal = function (title, subTitle, options) {
        var modalInstance = $modal.open({
            template: `
                    <div class="modal-body" style="padding: 15px;">
                        <div style="font-weight: bold; font-size: 16px;" ng-style="{ 'color' : Data.options.titleColor }">{{ Data.title }}</div>
                        <div ng-if="Data.subTitle">{{ Data.subTitle }}</div>
                        <div class="text-left" style="margin-top: 15px;">
                            <button class="btn btn-default" ng-click="Func.onCancelClick()" type="button">{{ Data.cancelButtonTitle }}</button>
                            <button class="btn btn-success" ng-click="Func.onOkClick()" type="button">{{ Data.confirmButtonTitle }}</button>
                        </div>
                    </div>
                `,
            controller: function ($scope, $modalInstance, title, subTitle, options) {
                $scope.Data = {
                    title: title,
                    subTitle: subTitle,
                    cancelButtonTitle: options.cancelButtonTitle || 'انصراف',
                    confirmButtonTitle: options.confirmButtonTitle || 'بله',
                    options: options
                };

                $scope.Func = {
                    onOkClick: function () {
                        $modalInstance.close(true);
                    },
                    onCancelClick: function () {
                        $modalInstance.dismiss(false);
                    }
                }
            },
            size: 'sm',
            resolve: {
                title: function () {
                    return title || "آیا از حذف مطمئن هستید؟";
                },
                subTitle: function () {
                    return subTitle;
                },
                options: function () {
                    return options || {};
                }
            }
        });

        return modalInstance.result;
    };

    return {
        removeConfirmModal: function(){
            return openConfirmModal(undefined, undefined, { confirmButtonTitle: 'بله، حذف شود', titleColor: 'red' });
        },
        confirmModal: openConfirmModal
    }

}]);