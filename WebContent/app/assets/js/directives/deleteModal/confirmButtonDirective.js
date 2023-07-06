angular.module('deleteModule', []).controller('deleteFromModalCtrl', [ '$scope', 'modalTitle', 'modalMessage', '$modalInstance', function($scope, modalTitle, modalMessage, $modalInstance) {
    $scope.modalTitle = modalTitle ? modalTitle : 'آیتم';
    $scope.modalMessage= modalMessage ? modalMessage : '';
    $scope.onNoClick = function() {
        $modalInstance.close(false)
    };
    $scope.onYesClick = function() {
        $modalInstance.close(true)
    };
} ]).directive('confirmButton', function() {
    return {
        restrict : 'EA',
        templateUrl : 'app/assets/js/directives/deleteModal/confirmButton.html',
        scope : {
            modalTitle : "=",
            modalMessage : "=",
            mode : "=mode",
            exchangeConfirmFunction : "=",
            buttonTitle : "=",
        },
        controller : function($scope, $rootScope, $modal, $q) {
            // Open Modal
            $scope.onConfirmationClick = function(event) {
                event.stopPropagation();
                event.preventDefault;
                var modalInstance = $modal.open({
                    templateUrl : 'app/assets/js/directives/deleteModal/deleteModal.html',
                    controller : 'deleteFromModalCtrl',
                    size : 'sm',
                    resolve : {
                        modalTitle : function() {
                            return $scope.modalTitle;
                        },
                        modalMessage: function (){
                            return $scope.modalMessage;
                        }
                    }
                });
                modalInstance.result.then(function(response) {
                    $scope.exchangeConfirmFunction.closeModalConfirm(response);
                }, function() {
                });
            }
        }
    }
});