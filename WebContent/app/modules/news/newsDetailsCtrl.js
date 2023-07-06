angular.module('newsModule').controller('newsDetailsCtrl', function ($rootScope, $sce, $scope, newsSrvc, $stateParams) {

    $scope.Data = {
        selectedNews: $stateParams.selectedNews
    };

    $scope.Func = {

    };

    function Run() {
        newsSrvc.setOrgUid($rootScope.currentUserOrg.uid);
        newsSrvc.findOneNews($stateParams.newsUid).then(function (response) {
            $scope.Data.selectedNews = response.data;
            if(!$scope.Data.selectedNews.originalElement.viewed){
                $rootScope.$broadcast('decreaceUnreadNewsCount');
            }
        });
        newsSrvc.getPublicNewsList(0, 5).then(function (response) {
            $scope.Data.latestNews = response.data;
        });
    }

    Run();

});
