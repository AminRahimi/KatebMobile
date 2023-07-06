angular.module('newsModule').controller('newsListManagementCtrl', function ($scope, $state, $stateParams, newsSrvc) {

    $scope.Data = {};
    $scope.Func = {
        onAddNewsClick: function () {
            $state.go('home.management.news',
                {
                    orgUid: $stateParams.orgUid,
                    mode: 'add'
                });
        },
        onSelectNews: function (selectedNews) {
            $state.go('home.management.news',
                {
                    orgUid: $stateParams.orgUid,
                    mode: 'view',
                    newsId: selectedNews.uid
                });

        },
        onSearchClick: function () {

        },
        onExitSearchModeClick: function () {

        },
        onSearchClick: function(advancedMode){
            if(advancedMode){
                $scope.Func.onChangeSearchModeClick('advanced');
                $scope.Controller.newsListController.searchQuery = $scope.Controller.userAdvancedSearchController.searchQuery;
                $scope.Controller.newsListController.searchableFieldInfo = $scope.Controller.userAdvancedSearchController.searchableFieldInfo;
            }else{
                $scope.Func.onChangeSearchModeClick('quick');
                $scope.Controller.newsListController.searchQuery = $scope.Controller.userSearchController.searchQuery;
                $scope.Controller.newsListController.searchableFieldInfo = $scope.Controller.userSearchController.searchableFieldInfo;
            }
            $scope.Controller.newsListController.refreshList(true);
        },
        onExitSearchModeClick: function(){
            $scope.Func.onChangeSearchModeClick('none');
            $scope.Controller.userAdvancedSearchController.searchQuery = {};
            $scope.Controller.userSearchController.searchQuery = {};
            $scope.Controller.newsListController.exitSearchMode();
        },
        onChangeSearchModeClick: function(mode){
            $scope.Data.searchMode = mode;
        },
    };

    $scope.Controller = {
        newsListController: {
            headers: [
                //{type: 'checkbox'},
                {key: 'title'},
                {key: 'creationDate'},
//                {key: 'status'},
                {key: 'writer.title'}
            ],
            getList: newsSrvc.getManagementNewsList,
            onListItemSelect: $scope.Func.onSelectNews,
            searchFunction: newsSrvc.searchNews
        },
        userSearchController: {
            advanced: false,
            searchableFieldInfo: [
//                {key:"creationDate", type:"date", label:"تاریخ ایجاد"},
                {key:"title", type:"string", label:"عنوان"},
//                {key:"tags", type:"string", label:"برچسب های موضوعی"},
//                {key:"status", type:"string", label:"وضعیت"},
            ],
            onSearchClick: $scope.Func.onSearchClick,
            onExitSearchModeClick: $scope.Func.onExitSearchModeClick
        },
    };
    function Run() {
        newsSrvc.setOrgUid($stateParams.orgUid);
    }

    Run();
});
