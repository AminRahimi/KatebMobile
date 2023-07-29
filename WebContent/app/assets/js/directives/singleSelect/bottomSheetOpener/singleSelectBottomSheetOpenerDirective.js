angular.module('singleSelect').directive('singleSelectBottomSheetOpener', [

    function () {
        return {
            scope: {
                model: "=",
                isEditMode: "=",
                onRefresh: "&",
                onSelect: "&",
                appEnumKey:"@",
                titlePropKey:"@",
                // FIXME:change options to initialList and place all optional inputs to option
                options: "="
            },
            templateUrl: 'app/assets/js/directives/singleSelect/bottomSheetOpener/singleSelectBottomSheetOpener.html',
            controller: function ($scope, bottomSheetSrvc) {

                $scope.Data = {
                }


                $scope.Func = {
                    openSingleSelectBottomSheet: function (params) {
                        return bottomSheetSrvc.open('singleSelectBottomSheetCtrl', 'app/assets/js/directives/singleSelect/bottomSheetOpener/singleSelectBottomSheet.html', params)
                    },
                    onOpenClick() {
                        $scope.Func.openSingleSelectBottomSheet(
                            {
                                model: $scope.model,
                                isEditMode: $scope.isEditMode,
                                onRefresh: $scope.onRefresh,
                                onSelect: $scope.onSelect,
                                appEnumKey:$scope.appEnumKey,
                                titlePropKey:$scope.titlePropKey,
                                options: $scope.options
                            });
                    }
                }

            }
        }
    }]);
