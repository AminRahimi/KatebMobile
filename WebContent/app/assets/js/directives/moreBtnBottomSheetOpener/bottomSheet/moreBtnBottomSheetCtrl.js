angular.module("moreBtnBottomSheetOpener").controller('moreBtnBottomSheetCtrl',
    function ($scope, bottomSheetSrvc) {

        $scope.Data = {
            actionButtonsMap : bottomSheetSrvc.getInputObject().actionButtonsMap,
            menuItemTpls : bottomSheetSrvc.getInputObject().menuItemTpls,
        }

        $scope.onMenuItemClick = function(menuItemTpl){
            bottomSheetSrvc.close(menuItemTpl);
        }

    });