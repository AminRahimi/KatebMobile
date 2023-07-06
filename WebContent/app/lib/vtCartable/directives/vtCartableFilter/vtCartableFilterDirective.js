angular.module('vtCartable').directive('vtCartableFilter', function () {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            Data: '=data',
            Controller: '=controller',
            visibleHeader: "="
        },
        templateUrl: 'app/lib/vtCartable/directives/vtCartableFilter/vtCartableFilterTemplate.html',
        controller: function ($scope, vtCartableSearchSrvc, cartableSrvc, $location) {
            $scope.Func = {
                onSaveFilterClick: function () {
                    var sendData = {
                        title: $scope.Data.title,
                        query: vtCartableSearchSrvc.createSearchQuery($scope.Controller.searchController.searchQuery, $scope.Controller.searchController.searchableFieldInfo)
                    };
                    sendData.query.orders = $scope.Controller.listController.searchQuery.orders;
                    sendData.displayedColumns = [];
                    var appState = cartableSrvc.getCartableState();
                    // appState.visibleHeaders.forEach(function (item) {
                    //     sendData.displayedColumns.push(item.key);
                    // });
                    $scope.visibleHeader.forEach(function (item) {
                        sendData.displayedColumns.push(item.key);
                    });
                    sendData.query.orders = $scope.Controller.listController.searchQuery.orders;

                    sendData.extraData={searchQuery: JSON.stringify($scope.Controller.searchController.searchQuery)};
                    sendData.extraData.selectedFromMultiselect =  JSON.stringify($scope.Controller.searchController.getSelectedFromMultiselect());

                    sendData.extraData.searchableFieldInfo = JSON.stringify($scope.Controller.searchController.searchableFieldInfo);
                    cartableSrvc.saveTaskFilter(sendData, $scope.Data.selectedCartable.taskType, $scope.Data.selectedFilter.uid).then(function () {
                        cartableSrvc.showNotification('filterSaved');
                        cartableSrvc.updateMenu();;
                    });
                },
                onSaveasFilterClick: function () {
                    var data = {
                        title: $scope.Data.title,
                        query: vtCartableSearchSrvc.createSearchQuery($scope.Controller.searchController.searchQuery, $scope.Controller.searchController.searchableFieldInfo)
                    };
                    data.displayedColumns = [];
                    var appState = cartableSrvc.getCartableState();
                    // appState.visibleHeaders.forEach(function (item) {
                    //     data.displayedColumns.push(item.key);
                    // });
                    $scope.visibleHeader.forEach(function (item) {
                        data.displayedColumns.push(item.key);
                    });
                    data.query.orders = $scope.Controller.listController.searchQuery.orders;
                    
                    data.extraData={searchQuery: JSON.stringify($scope.Controller.searchController.searchQuery)};
                    data.extraData.selectedFromMultiselect =  JSON.stringify($scope.Controller.searchController.getSelectedFromMultiselect());
                    
                    data.extraData.searchableFieldInfo = JSON.stringify($scope.Controller.searchController.searchableFieldInfo);
                    cartableSrvc.saveAsFilter($scope.Data.selectedCartable.taskType, data).then(function (res) {
                        cartableSrvc.showNotification('filterSaved');
                        cartableSrvc.updateMenu();;
                    });
                }, onRenameFilterClick: function () {
                    var data = {
                        title: $scope.Data.title,
                        query: $scope.Data.selectedFilter.query,
                        displayedColumns: $scope.Data.selectedFilter.displayedColumns
                    };
                    data.query.orders = $scope.Data.selectedFilter.query.orders;
                    cartableSrvc.renameFilter($scope.Data.selectedCartable.taskType, data, $scope.Data.selectedFilter.uid).then(function (res) {
                        cartableSrvc.showNotification('templateRenamed');
                        cartableSrvc.updateMenu();;
                    });
                }, onRemoveFilterClick: function () {
                    cartableSrvc.removeFilter($scope.Data.selectedCartable.taskType, $scope.Data.selectedFilter.uid).then(function (res) {
                        cartableSrvc.showNotification('filterRemoved');
                        $location.search({});
                        $scope.Controller.listController.searchQuery = {};
                        // $scope.Data.selectedFilter.query.restrictions = [{"field":"content.archive","type":"ne","value":true},{"field":"read","type":"eq","value":false}];
                        $scope.Controller.searchController.exitSearchApi();
                        cartableSrvc.updateMenu();;
//                        $scope.Controller.searchController.searchQuery = {};
//                        $scope.Controller.listController.refreshList(true);

                    });
                }
            };
        }
    }
});