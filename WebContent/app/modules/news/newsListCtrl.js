angular.module('newsModule').controller('newsListCtrl',function ( $scope,$rootScope, $state ,newsSrvc,$modal) {
    $scope.Data = {
        newsList: [],
        itemsPagination : {
            totalItems : -1,
            currentPage : 1,
            perPage : 5,
            maxSize : 5,
            show : true,
            onPageChange: function() {
                $scope.Func.getNewsList((parseInt($scope.Data.itemsPagination.currentPage) - 1) * $scope.Data.itemsPagination.perPage, $scope.Data.itemsPagination.perPage);
            }
        }
    };

    $scope.Func = {
        onUserList:function (newsUid){
            var modalInstance= $modal.open({
                templateUrl:'app/modules/news/userListModal/userListModal.html',
                controller:'userListModalCtrl',
                size:'sm',
                resolve:{
                    newsUid:function(){
                    return newsUid;
                    }
                }
            });
            modalInstance.result.then(function (){

            });
        },
        getNewsList: function (start, len) {
            newsSrvc.getNewsList(start, len).then(function (res) {
                $scope.Data.newsList = res.data;
                $scope.Data.itemsPagination.totalItems = parseInt(res.data.totalCount);
                if ($scope.Data.itemsPagination.totalItems <= $scope.Data.itemsPagination.perPage) {
                    $scope.Data.itemsPagination.show = false;
                } else {
                    $scope.Data.itemsPagination.show = true;
                }
            });
        },

    };

    $scope.Controller = {};

    var Run = function () {
        newsSrvc.setOrgUid($rootScope.currentUserOrg.uid);
        $scope.Func.getNewsList(0, $scope.Data.itemsPagination.perPage);
    }

    Run();
});
