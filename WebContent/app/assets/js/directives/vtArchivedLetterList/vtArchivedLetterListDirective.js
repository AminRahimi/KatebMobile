angular.module("vtArchivedLetterListModule", [])
    /////////////////////////////////////////// DIRECTIVE ///////////////////////////////////////////
    .directive("vtArchivedLetterList", function () {

        return {
            restrict: "EA",
            templateUrl: "app/assets/js/directives/vtArchivedLetterList/vtArchivedLetterList.html",
            scope: {
                api: "=",
                getArchivedLetterListFn: "="
            },
            controller: function ($scope, $modal) {

                $scope.Data = {
                    isShowArchivedLetterList: false,
                    archivedLetterList: []
                };

                $scope.Func = {
                    getArchivedLetterList: function () {
                        if ($scope.api.getArchivedLetterListFn) {
                            return $scope.api.getArchivedLetterListFn().then(function (res) {
                                $scope.Data.archivedLetterList = res.data;
                                if ($scope.Data.archivedLetterList.length > 0) {
                                    $scope.Data.isShowArchivedLetterList = true;
                                } else {
                                    $scope.Data.isShowArchivedLetterList = false;
                                }
                            });
                        }
                    },
                    refreshArchivedLetterList: function () {
                        return $scope.Func.getArchivedLetterList();
                    },
                    onShowDetailsModalClick: function (event, archivedLetter) {
                        event.stopPropagation();
                        event.preventDefault;
                        var modalInstance = $modal.open({
                            templateUrl: 'app/assets/js/directives/vtArchivedLetterList/vtArchivedLetterListDetailsModal.html',
                            controller: 'vtArchivedLetterListDetailsModalCtrl',
                            resolve: {
                                archivedLetter: function () {
                                    return archivedLetter;
                                }
                            }
                        });
                        modalInstance.result.then(function (response) {

                        }, function () {

                        });
                    }
                };

                var Run = function () {
                    $scope.Func.getArchivedLetterList();
                    $scope.api.refreshArchivedLetterList = $scope.Func.refreshArchivedLetterList;
                };

                Run();

            }
        };

    })
    /////////////////////////////////////////// CONTROLLER ///////////////////////////////////////////
    .controller("vtArchivedLetterListDetailsModalCtrl", function ($scope, $modalInstance, archivedLetter) {

        $scope.Data = {
            archivedLetter: archivedLetter
        };

        $scope.Func = {
            onCloseModalClick: function () {
                $modalInstance.dismiss();
            }
        };

    });