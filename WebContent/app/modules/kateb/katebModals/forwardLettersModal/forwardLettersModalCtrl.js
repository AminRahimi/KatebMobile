angular.module('katebModule').controller('forwardLettersModalCtrl', ['$scope', '$modalInstance','cartableKatebSrvc','katebSrvc', function ($scope, $modalInstance,cartableKatebSrvc,katebSrvc) {
    $scope.Data = {
        validationClicked: false
    };
    cartableKatebSrvc.getFullhameshhotkeyList().then(function (response) {
        $scope.Data.hameshList = response.data;
        $scope.Data.forward = {
            priority: "Normal"
        };
    });
    $scope.Controller = {
        multiSelectorsController: {
            multiSelectTranslate: new katebSrvc.MultiselectTranslate('انتخاب گیرندگان'),
            multiSelectSettings: {
                externalIdProp: '',
                displayProp: 'title',
                enableSearch: true,
                scrollableHeight: '300px',
                scrollable: true,
                idProp: 'uid',
                showCheckAll: true,
                showUncheckAll: true
            }
        },
        // typeahead: {
        //     getList: cartableKatebSrvc.getPuaListSEPFalse,
        //     onSelect: function (item) {
        //         if (item.type === 'THROUGH_SECRETARIAT') {
        //             $scope.Data.counter += 1;
        //         }
        //     },
        //     onRemove: function (item) {
        //         if (item.type === 'THROUGH_SECRETARIAT') {
        //             $scope.Data.counter -= 1;
        //         }
        //     }
        // },
        multiselectRecieverSearch: cartableKatebSrvc.getPuaListSEPFalse,
    };
    $scope.Func = {
        onForwardLetters: function () {
            if ($scope.form.$valid) {
                $modalInstance.close($scope.Data.forward);
            }else{
                $scope.Data.validationClicked = true;
            }
        },
        onForwardAndArchiveClick: function () {
            var forwardObj = {
                data: $scope.Data.forward,
                archive: true
            };
            if ($scope.form.$valid) {
                $modalInstance.close(forwardObj);
            }else{
                $scope.Data.validationClicked = true;
            }
        },
        onSelectItemInMultiselect: function (item) {
            if (item.type === 'THROUGH_SECRETARIAT') {
                $scope.Data.counter += 1;
            }
        },
        onRemoveItemInMultiselect: function (item) {
            if (item.type === 'THROUGH_SECRETARIAT') {
                $scope.Data.counter -= 1;
            }
        },
        onHameshSelect: function (item, model) {
            if ($scope.Data.forward) {
                $scope.Data.forward.hamesh = item.content;
            } else {
                $scope.Data.forward = {
                    hamesh: item.content
                }
            }

        }
    };
}]);
