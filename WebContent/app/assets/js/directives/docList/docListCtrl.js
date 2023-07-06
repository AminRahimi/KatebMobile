angular.module('docList', []).directive('docList', function () {

    return {
        restrict: 'EA',
        templateUrl: 'app/assets/js/directives/docList/docList.html',
        scope: {
            api: "="
        },
        controller: function ($scope, $debounce, $timeout) {

            $scope.Data = {
                docList: {},
                start: 0,
                len: 40,
                isLoading: true,
                parentUid: null,
                selectedItem: {}
            };

            $scope.Func = {
                onGoToFolder: function (parentUid) {
                    $scope.Data.parentUid = parentUid;
                    $scope.Data.start = 0;
                    $scope.Data.len = 40;
                    $scope.Data.isLoading = true;
                    $scope.api.getDocList($scope.Data.parentUid, $scope.Data.start, $scope.Data.len).then(function (res) {
                        $scope.Data.docList = res.data.originalElement;
                        $scope.Data.isLoading = false;
                    }, function () {
                        $scope.Data.isLoading = false;
                    });
                },
                goToNextPage: function() {
                    if($scope.Data.docList.hasMore && $scope.Data.parentUid) {
                        $scope.Data.isLoading = true;
                        $scope.Data.start += $scope.Data.len;
                        $scope.api.getDocList($scope.Data.parentUid, $scope.Data.start, $scope.Data.len).then(function (res) {
                            $scope.Data.docList = $scope.Data.docList.concat(res.data.originalElement);
                            $scope.Data.docList.hasMore = res.data.originalElement.hasMore;
                            $scope.Data.docList.pathWay = res.data.originalElement.pathWay;
                            if(!$scope.Data.docList.hasMore) {
                                $scope.Data.isLoading = false;
                            }
                        }, function () {
                            $scope.Data.isLoading = false;
                        });
                    }
                },
                setScrollbar: function() {
                    // call this func in timeout
                    var elm = document.getElementById('doc-list-scroll');
                    elm.addEventListener('scroll', $debounce(function() {
                        if(elm.offsetHeight + elm.scrollTop >= elm.scrollHeight - 50) {
                            $scope.Func.goToNextPage();
                        }
                    }, 100));
                },
                onSelectFolder: function(doc){
                    $scope.Data.selectedItem = doc;
                    $scope.api.onSelectItem(doc);
                },
                onSelectFolderSearched: function(doc, index){
                    if(index){
                        $scope.Data.selectedItem = doc[index];
                    } else {
                        $scope.Data.selectedItem = doc[doc.length-1];
                    }
                    $scope.api.onSelectSearchItem(doc, index);
                },
                setApis: function () {
                    $scope.api.onGoToFolder = $scope.Func.onGoToFolder;
                    $scope.api.onSelectFolderSearched = $scope.Func.onSelectFolderSearched;
                }
            };

            var Run = function () {
                $scope.Func.onGoToFolder();
                $scope.Func.setApis();
                $timeout(function () {
                    $scope.Func.setScrollbar();
                }, 1);
            };

            Run();

        }
    }

});