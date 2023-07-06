angular.module('katebModule').controller('sendLettersModalCtrl', ['$scope', '$rootScope', '$modalInstance', 'katebSrvc', 'cartableSrvc', 'Restangular', function ($scope, $rootScope, $modalInstance, katebSrvc, cartableSrvc, Restangular) {
    $scope.Data = {
        orgUid: $rootScope.currentUserOrg.uid,
        validationClicked: false,
        isLoadingSaveClick: false
    };
    $scope.Controller = {

    };
    $scope.Func = {
        getExternalOrganizationList: function () {
            cartableSrvc.getExternalOrganizationList($scope.Data.orgUid).then(function (res) {
                $scope.Data.organizationList = res.data;
            });
        },
        onOrganiztionChange: function (data) {
            cartableSrvc.getSenderList($scope.Data.orgUid, data.uid).then(function (res) {
                $scope.Data.members = res.data;
            });
        },
        onSaveClick: function(){
            $scope.Data.isLoadingSaveClick = true;
            var sendData = $scope.Func.prepareSendData($scope.Data.letter);
            $modalInstance.close(sendData);
            $scope.Data.isLoadingSaveClick = false;
        },
        prepareSendData: function(data){
            switch (data.type) {
                case "Post":
                    var sendData = {
                        postalCode: data.postalCode,
                        boxNumber: data.boxNumber
                    }
                    break;
                case "Fax":
                    var sendData = {
                        faxNumber: data.faxNumber
                    }
                    break;
                case "Courier":
                    var sendData = {
                        courierName: data.courierName
                    }
                    break;
                case "Org":
                    var sendData = {
                        reciverPostionUserAssignment: Restangular.stripRestangular(data.reciverPostionUserAssignment)
                    }
                    break;
                case "Ece":
                    var sendData = {
                        //position: data.position
                    }
                    break;
            }
            sendData.uid = data.uid;
            sendData.type = data.type.toUpperCase();
            sendData.description = data.description;
            return sendData;
        },
    };
    var Run = function(){
        $scope.Func.getExternalOrganizationList();
    };
    Run();
}]);