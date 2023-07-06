angular.module('vtFolderSelector').controller("chooseFolderModalCtrl", function ($scope, $modalInstance, vtFolderSelectorSrvc,
                                                                                 hasUpload, $timeout) {

    $scope.Data = {
        selectedNode: "",
        isMultiSelectTree: false,
        hasUpload: hasUpload,
        searchFolder: "",
        isShowSearch: false,
        searchedFolderList: [],
        resultIndex: -1,
        isShowTreeBox: false,
        searchResultsTotalSize: 0,
        selectedLabel: []
    };

    $scope.Func = {
        onCloseModalClick: function () {
            $modalInstance.dismiss();
        },
        onSubmitClick: function () {
            if($scope.Data.selectedLabel){
                var selectedLabelPluck = [];
                angular.forEach($scope.Data.selectedLabel, function (label) {
                    selectedLabelPluck.push(label.uid);
                });
                $scope.Data.selectedNode.label = JSON.stringify({ labelUIDs: selectedLabelPluck });
            }
            $modalInstance.close({selectedNode: $scope.Data.selectedNode, selectedNodePathList: $scope.Data.selectedNodePathList});
        },
        // Tree //
        getRootFolder: function () {
            return vtFolderSelectorSrvc.getRootFolder().then(function (res) {
                $scope.Data.isShowTreeBox = true;
                return res;
            });
        },
        getChildernOfFolder: function (parentUid, isSearch, start, len) {
            return vtFolderSelectorSrvc.getChildernOfFolder(parentUid, isSearch, start, len);
        },
        // Tree-END //
        onSearchKeypress: function (event) {
            if (event.keyCode == 13) {
                $scope.Func.onSearchFolderClick();
            }
        },
        onBreadcrumbSearchResultClick: function (nodeArray, index) {
            $scope.Apis.viraTree.onNodeArrayClick(angular.copy(nodeArray), true);
            angular.forEach($scope.Data.searchResults, function (searchedFolder) {
                searchedFolder.isSelected = false;
            });
            nodeArray.isSelected = true;
            $scope.Data.nodeArray = angular.copy(nodeArray);
        },
        onSearchFolderClick: function () {
            if ($scope.Data.searchFolder) {
                vtFolderSelectorSrvc.searchFolder($scope.Data.searchFolder).then(function (response) {
                    $scope.Data.searchResults = [];
                    if (response.data.totalSize > 0) {
                        $scope.Data.searchResultsTotalSize = response.data.totalSize;
                        var searchResultList = []
                        angular.forEach(response.data, function (item) {
                            if (item.uid == "ganjeh-root-tree-node") {
                                searchResultList.push(item.children[0]);
                            } else {
                                searchResultList.push(item);
                            }
                        });
                        _.each(searchResultList, function (resultTree) {
                            if (resultTree) {
                                var searchResultArray = [];
                                searchResultArray.push(resultTree);
                                while (resultTree.children && resultTree.children.length) {
                                    searchResultArray.push(resultTree.children[0]);
                                    resultTree = resultTree.children[0];
                                }
                                $scope.Data.searchResults.push(angular.copy(searchResultArray));
                            }
                        });
                    }
                    $scope.Data.isShowSearch = true;
                });
            }
        },
        onClearSearchClick: function () {
            $scope.Data.searchFolder = "";
            $scope.Data.isShowSearch = false;
        },
        goToNodeLocation: function () {
            /*$timeout(function () {
                var scrollToOffset = function (el) {
                    var offset = 0;
                    var elTop = $(el).offset().top - $(".tree-box .mCSB_container").offset().top;
                    return elTop - offset;
                };
                $('.tree-box').mCustomScrollbar("scrollTo", scrollToOffset("#" + $scope.Data.nodeArray[$scope.Data.nodeArray.length - 1].uid), {
                    timeout: 0,
                    scrollInertia: 1000
                });
//                if($scope.Data.nodeArrayBackup){
//                    $timeout.cancel($scope.Data.addClassTimeout);
//                    $timeout.cancel($scope.Data.removeClassTimeout);
//                    $timeout(function () {
//                        $("#" + $scope.Data.nodeArrayBackup[$scope.Data.nodeArrayBackup.length - 1].uid).removeClass('search-find-animation');
//                    }, 100);
//                }
                $timeout(function(){
                    $scope.Data.nodeArrayBackup = angular.copy($scope.Data.nodeArray);
                    $scope.Data.addClassTimeout = $timeout(function () {
                        $('.search-find-animation').removeClass('search-find-animation');
                        $("#" + $scope.Data.nodeArray[$scope.Data.nodeArray.length - 1].uid).addClass('search-find-animation');
                    }, 200);
                    $scope.Data.removeClassTimeout = $timeout(function () {
                        $("#" + $scope.Data.nodeArray[$scope.Data.nodeArray.length - 1].uid).removeClass('search-find-animation');
                    }, 2500);
                },150);
            }, 500);*/
        }
    };

    $scope.Apis = {
        viraTree: {
            getTopicTree: function (parentUid) {
                if (!parentUid) {
                    return $scope.Func.getRootFolder();
                } else {
                    return $scope.Func.getChildernOfFolder(parentUid);
                }
            },
            getChildrenFn: function (parentUid) {
                return $scope.Func.getChildernOfFolder(parentUid);
            },
            onSelectNodeClick: function (selectedNode, isTreeClicked) {
                $scope.Data.selectedNode = angular.copy(selectedNode);
                /*$timeout(function () {
                    $scope.Data.selectedNodePathList = $scope.Data.selectedNode.path.split("/");
                }, 100);*/
            },
            getTopicTreeChildsFn: function (nodeUid) {
                return $scope.Func.getChildernOfFolder(nodeUid, true);
            },
            onSelectNode: function (selectedNode) {

            },
            goToNodeLocation: function () {
                $scope.Func.goToNodeLocation();
            }
        },
        docList: {
            getDocList: function (parentUid, start, len) {
                if (!parentUid) {
                    return $scope.Func.getRootFolder();
                } else {
                    return $scope.Func.getChildernOfFolder(parentUid, null, start, len);
                }
            },
            getChildrenFn: function (parentUid) {
                return $scope.Func.getChildernOfFolder(parentUid);
            },
            onSelectItem: function (selectedNode, isTreeClicked) {
                $scope.Data.selectedNode = angular.copy(selectedNode);
                $timeout(function () {
                    $scope.Data.selectedNodePathList = $scope.Data.selectedNode.path.split("/");
                }, 100);
            },
            onSelectSearchItem: function (selectedNode, index) {
                if(index){
                    $scope.Data.selectedNode = angular.copy(selectedNode[index]);
                } else {
                    $scope.Data.selectedNode = angular.copy(selectedNode[selectedNode.length-1]);
                }
                $timeout(function () {
                    $scope.Data.selectedNodePathList = [''];
                    angular.forEach(selectedNode, function (item, itemIndex) {
                        if(index && itemIndex <= index){
                            $scope.Data.selectedNodePathList.push(item.title);
                        } else if(!index) {
                            $scope.Data.selectedNodePathList.push(item.title);
                        }
                    });
                }, 100);

            },
            getTopicTreeChildsFn: function (nodeUid) {
                return $scope.Func.getChildernOfFolder(nodeUid, true);
            },
            onSelectNode: function (selectedNode) {

            },
            goToNodeLocation: function () {
                $scope.Func.goToNodeLocation();
            }
        }
    };

    var Run = function () {
        /*$timeout(function () {
            $('.tree-box').mCustomScrollbar({
                theme: "dark-thin",
                axis: "yx",
                advanced: {
                    autoExpandHorizontalScroll: 2,
                    updateOnContentResize: true
                }
            });
        }, 1000);*/
    };

    Run();

});
