angular.module('multiselectReciever').directive('multiselectBottomSheetOpener', [

    function () {
        return {
            scope: {
                model: "=",
                isEditMode: "=",
                onRefresh: "&",
                onSelect: "&",
                onModelItemSelect: "&",
                onRemove: "&",
                options: "="
            },
            templateUrl: 'app/assets/js/directives/multiselectReciever/bottomSheetOpener/bottomSheetOpener.html',
            controller: function ($scope, bottomSheetSrvc) {

                $scope.Data = {
                }


                $scope.Func = {
                    openMultiselectBottomSheet: function (params) {
                        return bottomSheetSrvc.open('multiselectBottomSheetCtrl', 'app/assets/js/directives/multiselectReciever/bottomSheetOpener/multiselectBottomSheet.html', params)
                    },
                    onOpenClick() {
                        $scope.Func.openMultiselectBottomSheet(
                            {
                                model: $scope.model,
                                isEditMode: $scope.isEditMode,
                                onRefresh: $scope.onRefresh,
                                onSelect: $scope.onSelect,
                                onRemove: $scope.onRemove,
                                options: $scope.options
                            });
                    }
                }

            }
        }
    }]);
