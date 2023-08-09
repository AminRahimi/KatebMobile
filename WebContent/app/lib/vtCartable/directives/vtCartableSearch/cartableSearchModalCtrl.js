angular.module('cartableSearch').controller('cartableSearchModalCtrl',
    function ($scope, $modalInstance, controlFn, options) {

        $scope.controlFn = controlFn;
        $scope.options = options;

        $scope.Func = {
            onCancelClick: function () {
                $modalInstance.dismiss();
            },
            onSearchClick: function () {
                $modalInstance.close('onSearchClick');
            },
            onExitSearchModeClick: function () {
                $modalInstance.close('onExitSearchModeClick');
            }
        }
    })