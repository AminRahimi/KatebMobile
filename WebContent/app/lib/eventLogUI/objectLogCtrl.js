angular.module("logModule").controller('objectLogCtrl', function ($scope, logSrvc, vtSearchSrvc, Restangular) {

    $scope.Data = {
        logList: [],
        objectTypeList: [],
        itemsPagination: {
            totalItems: -1,
            currentPage: 1,
            perPage: 10,
            maxSize: 5,
            show: false,
        }

    };

    $scope.Func = {
        getObjectTypeList: function () {
            logSrvc.getObjectTypeList().then(function (response) {
                angular.forEach(response.data, function (objectType) {
                    $scope.Data.objectTypeList.push({
                        uid: objectType.key,
                        title: objectType.displayString
                    });
                })
            });
        },

        // getLogList: function (start, len) {
        //     $scope.Data.itemList = [];
        //     var objectType = $scope.Controller.logSearchController.searchQuery.object_type.uid;
        //     var query = $scope.Controller.logSearchController.searchQuery.q;
        //     logSrvc.getObjectList(objectType, query, start, len).then(function (response) {
        //         $scope.Data.logList = response.data;
        //         $scope.Data.itemsPagination.totalItems = parseInt(response.data.totalCount);
        //         if ($scope.Data.itemsPagination.totalItems <= $scope.Data.itemsPagination.perPage) {
        //             $scope.Data.itemsPagination.show = false;
        //         } else {
        //             $scope.Data.itemsPagination.show = true;
        //         }
        //
        //     })
        // },
        onExitSearchModeClick: function () {
            $scope.Controller.logSearchController.searchQuery = {};
        },
        onLogItemClick: function (log) {
            logSrvc.getItemList(log.uid).then(function (res) {
                $scope.Data.itemList = res.data;
            });
        },
        onShowFullnameClick: function (log) {
            if (!log.tooltipContent) {
                logSrvc.getFullname(log.username).then(function (res) {
                    if (res.data[0]) {
                        log.tooltipContent = res.data[0].title;
                        log.showTooltip = true;
                    }
                });
            } else {
                log.showTooltip = !log.showTooltip;
            }
        },
        onPageChange: function() {
            $scope.Controller.logSearchController.onSearchClick = $scope.Func.getLogList(parseInt($scope.Data.itemsPagination.currentPage), $scope.Data.itemsPagination.perPage);
            $scope.Controller.logSearchController.onSearchClick();
        },
        getLogList: function (start, len) {
            return function (advanced) {
                $scope.Data.itemList = [];
                var objectType = $scope.Controller.logSearchController.searchQuery.object_type.uid;
                var query = $scope.Controller.logSearchController.searchQuery.q;
                logSrvc.getObjectList(objectType, query, start, len).then(function (response) {
                    $scope.Data.logList = response.data;
                    $scope.Data.itemsPagination.totalItems = parseInt(response.data.size);
                    if ($scope.Data.itemsPagination.totalItems <= $scope.Data.itemsPagination.perPage) {
                        $scope.Data.itemsPagination.show = false;
                    } else {
                        $scope.Data.itemsPagination.show = true;
                    }

                })
            }
        }
    };

    $scope.Controller = {
        logSearchController: {
            advanced: false,
            searchableFieldInfo: [
                {key: "object_type", type: "enum", label: "نوع", itemList: $scope.Data.objectTypeList},
                {key: "q", type: "string", label: "جستجو"}
            ],
            onSearchClick: $scope.Func.getLogList(1, $scope.Data.itemsPagination.perPage),
            onExitSearchModeClick: $scope.Func.onExitSearchModeClick
        }
    }

    $scope.Func.getObjectTypeList();

});