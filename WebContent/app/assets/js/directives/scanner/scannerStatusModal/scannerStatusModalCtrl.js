angular.module('scannerModule').controller('scannerStatusModalCtrl', function($scope, $window, $modalInstance, scannerStatus) {
    $scope.Data = {
        scannerStatus: scannerStatus,
    };
    
    $scope.Func = {
        onReloadPage: function() {
            $window.location.reload();
        },
        onClose: function() {
           
            $modalInstance.close();
        }
    };
    
    $scope.Apis = {
    
    };
    
    var Run = function() {
    
    };
    
    Run();
    
});
