angular.module("moreBtnBottomSheetOpener", []).directive('moreBtnBottomSheetOpener', function () {
    return {
        restrict: 'EA',
        templateUrl: 'app/assets/js/directives/moreBtnBottomSheetOpener/moreBtnBottomSheetOpener.html',
        scope: {
            menuItemTpls: "=",
            actionButtonsMap:"="
        },
        controller: function ($scope, bottomSheetSrvc) {




            $scope.Data = {

            };
            $scope.Func = {
                onMoreBtnClick: function () {
                    bottomSheetSrvc.open('moreBtnBottomSheetCtrl',
                        'app/assets/js/directives/moreBtnBottomSheetOpener/bottomSheet/menu.html',
                        {
                            menuItemTpls: $scope.menuItemTpls,
                            actionButtonsMap: $scope.actionButtonsMap
                        })
                }
            };
            var Run = function () {
            };
            Run();


        }
    };
});
